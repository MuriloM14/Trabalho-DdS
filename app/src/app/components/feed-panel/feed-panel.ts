import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommentItem, PageResponse, PostItem, createEmptyPage } from '../../interfaces';
import { PaginationComponent } from '../pagination/pagination';

@Component({
  selector: 'app-feed-panel',
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './feed-panel.html',
  styleUrl: './feed-panel.css'
})
export class FeedPanelComponent {
  @Input({ required: true }) feedPage!: PageResponse<PostItem>;
  @Input({ required: true }) currentUserId!: number;
  @Input() postContent = '';
  @Input() postSaving = false;
  @Input() feedError = '';
  @Input() feedLoading = false;
  @Input() commentsByPost: Partial<Record<number, CommentItem[]>> = {};
  @Input() commentPagesByPost: Partial<Record<number, PageResponse<CommentItem>>> = {};
  @Input() commentDrafts: Partial<Record<number, string>> = {};
  @Input() commentErrors: Partial<Record<number, string>> = {};
  @Input() commentsLoading: Partial<Record<number, boolean>> = {};
  @Input() commentsOpen: Partial<Record<number, boolean>> = {};

  @Output() postContentChange = new EventEmitter<string>();
  @Output() submitPostForm = new EventEmitter<NgForm>();
  @Output() removePost = new EventEmitter<PostItem>();
  @Output() togglePostComments = new EventEmitter<number>();
  @Output() submitCommentForm = new EventEmitter<{ post: PostItem; form: NgForm }>();
  @Output() commentDraftChange = new EventEmitter<{ postId: number; value: string }>();
  @Output() removeComment = new EventEmitter<{ comment: CommentItem; post: PostItem }>();
  @Output() commentsPageChange = new EventEmitter<{ postId: number; page: number }>();
  @Output() feedPageChange = new EventEmitter<number>();
  @Output() profileOpen = new EventEmitter<number>();

  readonly emptyCommentsPage = createEmptyPage<CommentItem>();

  onSubmitPost(form: NgForm): void {
    this.submitPostForm.emit(form);
  }

  onSubmitComment(post: PostItem, form: NgForm): void {
    this.submitCommentForm.emit({ post, form });
  }

  onPostContentChange(value: string): void {
    this.postContentChange.emit(value);
  }

  onCommentDraftChange(postId: number, value: string): void {
    this.commentDraftChange.emit({ postId, value });
  }

  getCommentPage(postId: number): PageResponse<CommentItem> {
    return this.commentPagesByPost[postId] ?? this.emptyCommentsPage;
  }

  getComments(postId: number): CommentItem[] {
    return this.commentsByPost[postId] ?? [];
  }

  getCommentDraft(postId: number): string {
    return this.commentDrafts[postId] ?? '';
  }

  isCommentsOpen(postId: number): boolean {
    return this.commentsOpen[postId] === true;
  }

  canDeletePost(post: PostItem): boolean {
    return this.currentUserId === post.userId;
  }

  canDeleteComment(comment: CommentItem, post: PostItem): boolean {
    return this.currentUserId === comment.autorId || this.currentUserId === post.userId;
  }

  trackById(_: number, item: { id: number }): number {
    return item.id;
  }
}
