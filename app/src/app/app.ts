import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { BOOK_STATUS_FILTERS, BOOK_STATUS_OPTIONS } from './constants/book-status';
import { AuthPanelComponent } from './components/auth-panel/auth-panel';
import { BooksPanelComponent } from './components/books-panel/books-panel';
import { FeedPanelComponent } from './components/feed-panel/feed-panel';
import { FeedbackBannerComponent } from './components/feedback-banner/feedback-banner';
import { HeroSectionComponent } from './components/hero-section/hero-section';
import { ProfilePanelComponent } from './components/profile-panel/profile-panel';
import {
  ApiErrorResponse,
  AuthFormModel,
  AuthMode,
  BookItem,
  BookFormModel,
  BookStatus,
  CommentItem,
  createEmptyPage,
  FeedbackKind,
  PageResponse,
  PostItem,
  UserProfile,
  UserSession
} from './interfaces';
import { AuthService } from './services/auth.service';
import { BooksService } from './services/books.service';
import { CommentsService } from './services/comments.service';
import { PostsService } from './services/posts.service';
import { SessionService } from './services/session.service';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    AuthPanelComponent,
    BooksPanelComponent,
    FeedPanelComponent,
    FeedbackBannerComponent,
    HeroSectionComponent,
    ProfilePanelComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly booksService = inject(BooksService);
  private readonly commentsService = inject(CommentsService);
  private readonly postsService = inject(PostsService);
  private readonly sessionService = inject(SessionService);
  private readonly usersService = inject(UsersService);

  readonly bookStatusOptions = BOOK_STATUS_OPTIONS;
  readonly bookStatusFilters = BOOK_STATUS_FILTERS;
  readonly statusLabels: Record<BookStatus, string> = {
    LENDO: 'Lendo',
    QUERO_LER: 'Quero ler',
    ABANDONEI: 'Abandonei',
    JA_LI: 'Ja li',
    FAVORITO: 'Favorito'
  };

  authMode: AuthMode = 'login';
  activeView: 'dashboard' | 'profile' | 'books' = 'dashboard';
  authForm: AuthFormModel = this.createEmptyAuthForm();
  bookForm: BookFormModel = this.createEmptyBookForm();
  postContent = '';
  currentUser: UserSession | null = this.sessionService.getSession();

  feedbackMessage = '';
  feedbackKind: FeedbackKind = 'success';

  authLoading = false;
  booksLoading = false;
  bookSaving = false;
  feedLoading = false;
  postSaving = false;
  profileLoading = false;

  booksError = '';
  feedError = '';
  profileError = '';

  selectedBookStatus: BookStatus | '' = '';
  editingBookId: number | null = null;

  booksPage: PageResponse<BookItem> = createEmptyPage<BookItem>();
  feedPage: PageResponse<PostItem> = createEmptyPage<PostItem>();
  profilePostsPage: PageResponse<PostItem> = createEmptyPage<PostItem>();

  selectedProfileId: number | null = this.currentUser?.userId ?? null;
  selectedProfile: UserProfile | null = null;

  commentsByPost: Partial<Record<number, CommentItem[]>> = {};
  commentPagesByPost: Partial<Record<number, PageResponse<CommentItem>>> = {};
  commentDrafts: Partial<Record<number, string>> = {};
  commentErrors: Partial<Record<number, string>> = {};
  commentsLoading: Partial<Record<number, boolean>> = {};
  commentsOpen: Partial<Record<number, boolean>> = {};

  readonly emptyCommentsPage = createEmptyPage<CommentItem>();

  ngOnInit(): void {
    if (this.currentUser) {
      void this.loadDashboard();
    }
  }

  async submitAuth(form: NgForm): Promise<void> {
    if (form.invalid) {
      form.form.markAllAsTouched();
      return;
    }

    this.authLoading = true;
    this.clearFeedback();

    try {
      const session =
        this.authMode === 'login'
          ? await firstValueFrom(
              this.authService.login({
                email: this.authForm.email,
                senha: this.authForm.senha
              })
            )
          : await firstValueFrom(
              this.authService.register({
                nome: this.authForm.nome,
                email: this.authForm.email,
                senha: this.authForm.senha
              })
            );

      this.sessionService.saveSession(session);
      this.currentUser = session;
      this.activeView = 'dashboard';
      this.selectedProfileId = session.userId;
      this.authForm = this.createEmptyAuthForm();
      form.resetForm(this.createEmptyAuthForm());
      this.showFeedback(
        this.authMode === 'login'
          ? `Bem-vindo de volta, ${session.nome}!`
          : `Conta criada com sucesso. Seja bem-vindo, ${session.nome}!`
      );

      await this.loadDashboard();
    } catch (error) {
      this.showFeedback(this.extractErrorMessage(error, 'Nao foi possivel entrar na plataforma.'), 'error');
    } finally {
      this.authLoading = false;
    }
  }

  async loadDashboard(): Promise<void> {
    await Promise.all([this.loadBooks(0), this.loadFeed(0)]);

    if (this.currentUser) {
      await this.loadProfile(this.selectedProfileId ?? this.currentUser.userId, 0);
    }
  }

  async loadBooks(page = 0): Promise<void> {
    if (!this.currentUser) {
      return;
    }

    this.booksLoading = true;
    this.booksError = '';

    try {
      this.booksPage = await firstValueFrom(this.booksService.listBooks(this.selectedBookStatus, page, 6));
    } catch (error) {
      this.booksError = this.extractErrorMessage(error, 'Nao foi possivel carregar seus livros.');
    } finally {
      this.booksLoading = false;
    }
  }

  async submitBook(form: NgForm): Promise<void> {
    if (!this.currentUser) {
      return;
    }

    if (form.invalid) {
      form.form.markAllAsTouched();
      return;
    }

    this.bookSaving = true;
    this.clearFeedback();

    try {
      const payload = {
        titulo: this.bookForm.titulo.trim(),
        autor: this.bookForm.autor.trim(),
        sinopse: this.bookForm.sinopse.trim(),
        urlCapa: this.bookForm.urlCapa.trim(),
        status: this.bookForm.status
      };

      if (this.editingBookId) {
        await firstValueFrom(this.booksService.updateBook(this.editingBookId, payload));
        this.showFeedback('Livro atualizado com sucesso.');
      } else {
        await firstValueFrom(this.booksService.createBook(payload));
        this.showFeedback('Livro adicionado com sucesso.');
      }

      const targetPage = this.editingBookId ? this.booksPage.number : 0;
      this.cancelBookEdit(form);
      await this.loadBooks(targetPage);
    } catch (error) {
      this.showFeedback(this.extractErrorMessage(error, 'Nao foi possivel salvar o livro.'), 'error');
    } finally {
      this.bookSaving = false;
    }
  }

  startBookEdit(book: BookItem): void {
    this.editingBookId = book.id;
    this.bookForm = {
      titulo: book.titulo,
      autor: book.autor ?? '',
      sinopse: book.sinopse ?? '',
      urlCapa: book.urlCapa ?? '',
      status: book.status
    };
    this.clearFeedback();
    this.activeView = 'books';
  }

  cancelBookEdit(form?: NgForm): void {
    this.editingBookId = null;
    this.bookForm = this.createEmptyBookForm();

    if (form) {
      form.resetForm(this.createEmptyBookForm());
    }
  }

  async deleteBook(book: BookItem): Promise<void> {
    if (!confirm(`Deseja remover o livro "${book.titulo}" da sua lista?`)) {
      return;
    }

    try {
      await firstValueFrom(this.booksService.deleteBook(book.id));
      this.showFeedback('Livro removido com sucesso.');
      await this.loadBooks(this.getPreviousPageIfNeeded(this.booksPage));
    } catch (error) {
      this.showFeedback(this.extractErrorMessage(error, 'Nao foi possivel remover o livro.'), 'error');
    }
  }

  async onBookFilterChange(): Promise<void> {
    await this.loadBooks(0);
  }

  async loadFeed(page = 0): Promise<void> {
    if (!this.currentUser) {
      return;
    }

    this.feedLoading = true;
    this.feedError = '';

    try {
      this.feedPage = await firstValueFrom(this.postsService.listPosts(page, 6));
    } catch (error) {
      this.feedError = this.extractErrorMessage(error, 'Nao foi possivel carregar o feed.');
    } finally {
      this.feedLoading = false;
    }
  }

  async submitPost(form: NgForm): Promise<void> {
    if (!this.currentUser) {
      return;
    }

    if (form.invalid) {
      form.form.markAllAsTouched();
      return;
    }

    this.postSaving = true;
    this.clearFeedback();

    try {
      await firstValueFrom(
        this.postsService.createPost({
          conteudo: this.postContent.trim()
        })
      );

      this.postContent = '';
      form.resetForm({ conteudo: '' });
      await Promise.all([
        this.loadFeed(0),
        this.selectedProfileId === this.currentUser.userId ? this.loadProfilePosts(0) : Promise.resolve()
      ]);
    } catch (error) {
      this.showFeedback(this.extractErrorMessage(error, 'Nao foi possivel publicar agora.'), 'error');
    } finally {
      this.postSaving = false;
    }
  }

  async deletePost(post: PostItem): Promise<void> {
    if (!confirm('Deseja excluir esta publicacao?')) {
      return;
    }

    try {
      await firstValueFrom(this.postsService.deletePost(post.id));
      this.showFeedback('Publicacao removida com sucesso.');

      await Promise.all([
        this.loadFeed(this.getPreviousPageIfNeeded(this.feedPage)),
        this.selectedProfileId === post.userId
          ? this.loadProfilePosts(this.getPreviousPageIfNeeded(this.profilePostsPage))
          : Promise.resolve()
      ]);
    } catch (error) {
      this.showFeedback(this.extractErrorMessage(error, 'Nao foi possivel excluir a publicacao.'), 'error');
    }
  }

  async toggleComments(postId: number): Promise<void> {
    this.commentsOpen[postId] = !this.isCommentsOpen(postId);

    if (this.commentsOpen[postId] && !this.commentPagesByPost[postId]) {
      await this.loadComments(postId, 0);
    }
  }

  async loadComments(postId: number, page = 0): Promise<void> {
    this.commentsLoading[postId] = true;
    this.commentErrors[postId] = '';

    try {
      const response = await firstValueFrom(this.commentsService.listComments(postId, page, 5));
      this.commentPagesByPost[postId] = response;
      this.commentsByPost[postId] = response.content;
    } catch (error) {
      this.commentErrors[postId] = this.extractErrorMessage(
        error,
        'Nao foi possivel carregar os comentarios.'
      );
    } finally {
      this.commentsLoading[postId] = false;
    }
  }

  async submitComment(post: PostItem, form: NgForm): Promise<void> {
    const draft = (this.commentDrafts[post.id] ?? '').trim();

    if (!draft) {
      form.form.markAllAsTouched();
      return;
    }

    this.commentErrors[post.id] = '';
    this.commentsLoading[post.id] = true;

    try {
      await firstValueFrom(this.commentsService.createComment(post.id, { conteudo: draft }));
      this.setCommentDraft(post.id, '');
      form.resetForm();

      await Promise.all([
        this.loadComments(post.id, 0),
        this.loadFeed(this.feedPage.number),
        this.selectedProfileId === post.userId ? this.loadProfilePosts(this.profilePostsPage.number) : Promise.resolve()
      ]);
    } catch (error) {
      this.commentErrors[post.id] = this.extractErrorMessage(
        error,
        'Nao foi possivel enviar o comentario.'
      );
    } finally {
      this.commentsLoading[post.id] = false;
    }
  }

  async deleteComment(comment: CommentItem, post: PostItem): Promise<void> {
    if (!confirm('Deseja excluir este comentario?')) {
      return;
    }

    try {
      await firstValueFrom(this.commentsService.deleteComment(comment.id));
      this.showFeedback('Comentario removido com sucesso.');

      const currentPage = this.getCommentPage(post.id);

      await Promise.all([
        this.loadComments(post.id, this.getPreviousPageIfNeeded(currentPage)),
        this.loadFeed(this.feedPage.number),
        this.selectedProfileId === post.userId ? this.loadProfilePosts(this.profilePostsPage.number) : Promise.resolve()
      ]);
    } catch (error) {
      this.commentErrors[post.id] = this.extractErrorMessage(
        error,
        'Nao foi possivel excluir o comentario.'
      );
    }
  }

  async loadProfile(userId: number, postsPage = 0): Promise<void> {
    this.selectedProfileId = userId;
    this.profileLoading = true;
    this.profileError = '';

    try {
      const [profile, posts] = await Promise.all([
        firstValueFrom(this.usersService.getProfile(userId)),
        firstValueFrom(this.postsService.listPostsByUser(userId, postsPage, 5))
      ]);

      this.selectedProfile = profile;
      this.profilePostsPage = posts;
    } catch (error) {
      this.profileError = this.extractErrorMessage(error, 'Nao foi possivel carregar este perfil.');
    } finally {
      this.profileLoading = false;
    }
  }

  async loadProfilePosts(page = 0): Promise<void> {
    if (this.selectedProfileId === null) {
      return;
    }

    this.profileLoading = true;
    this.profileError = '';

    try {
      this.profilePostsPage = await firstValueFrom(
        this.postsService.listPostsByUser(this.selectedProfileId, page, 5)
      );
    } catch (error) {
      this.profileError = this.extractErrorMessage(
        error,
        'Nao foi possivel atualizar as publicacoes deste perfil.'
      );
    } finally {
      this.profileLoading = false;
    }
  }

  async openProfile(userId: number): Promise<void> {
    await this.loadProfile(userId, 0);
    this.activeView = 'profile';
    this.clearFeedback();
  }

  showDashboard(): void {
    this.activeView = 'dashboard';
    this.clearFeedback();
  }

  showBooks(): void {
    this.activeView = 'books';
    this.clearFeedback();
  }

  logout(): void {
    this.handleSessionExpired('Sessao encerrada com sucesso.');
    this.feedbackKind = 'success';
  }

  setAuthMode(mode: AuthMode): void {
    this.authMode = mode;
    this.clearFeedback();
  }

  setCommentDraft(postId: number, value: string): void {
    this.commentDrafts[postId] = value;
  }

  private getCommentPage(postId: number): PageResponse<CommentItem> {
    return this.commentPagesByPost[postId] ?? this.emptyCommentsPage;
  }

  private isCommentsOpen(postId: number): boolean {
    return this.commentsOpen[postId] === true;
  }

  private extractErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401) {
        this.handleSessionExpired('Sua sessao expirou. Faca login novamente.');
        return 'Sua sessao expirou. Faca login novamente.';
      }

      if (typeof error.error === 'string' && error.error.trim()) {
        return error.error;
      }

      if (error.error && typeof error.error === 'object') {
        const apiError = error.error as Partial<ApiErrorResponse>;

        if (Array.isArray(apiError.detalhes) && apiError.detalhes.length > 0) {
          return apiError.detalhes[0] ?? fallback;
        }

        if (typeof apiError.mensagem === 'string' && apiError.mensagem.trim()) {
          return apiError.mensagem;
        }

        if (typeof apiError.erro === 'string' && apiError.erro.trim()) {
          return apiError.erro;
        }
      }

      if (typeof error.message === 'string' && error.message.trim()) {
        return error.message;
      }
    }

    return fallback;
  }

  private handleSessionExpired(message: string): void {
    this.sessionService.clearSession();
    this.currentUser = null;
    this.activeView = 'dashboard';
    this.selectedProfileId = null;
    this.selectedProfile = null;
    this.authMode = 'login';
    this.authForm = this.createEmptyAuthForm();
    this.bookForm = this.createEmptyBookForm();
    this.postContent = '';
    this.selectedBookStatus = '';
    this.editingBookId = null;
    this.commentsByPost = {};
    this.commentPagesByPost = {};
    this.commentDrafts = {};
    this.commentErrors = {};
    this.commentsLoading = {};
    this.commentsOpen = {};
    this.booksPage = createEmptyPage<BookItem>();
    this.feedPage = createEmptyPage<PostItem>();
    this.profilePostsPage = createEmptyPage<PostItem>();
    this.showFeedback(message, 'error');
  }

  private getPreviousPageIfNeeded<T>(page: PageResponse<T>): number {
    const isLastItemOnPage = page.content.length === 1 && page.number > 0;
    return isLastItemOnPage ? page.number - 1 : page.number;
  }

  private createEmptyAuthForm(): AuthFormModel {
    return {
      nome: '',
      email: '',
      senha: ''
    };
  }

  private createEmptyBookForm(): BookFormModel {
    return {
      titulo: '',
      autor: '',
      sinopse: '',
      urlCapa: '',
      status: 'LENDO'
    };
  }

  private showFeedback(message: string, kind: FeedbackKind = 'success'): void {
    this.feedbackMessage = message;
    this.feedbackKind = kind;
  }

  private clearFeedback(): void {
    this.feedbackMessage = '';
  }
}
