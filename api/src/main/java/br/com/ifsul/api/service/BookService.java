package br.com.ifsul.api.service;

import br.com.ifsul.api.dto.book.BookRequest;
import br.com.ifsul.api.dto.book.BookResponse;
import br.com.ifsul.api.exception.AccessDeniedCustomException;
import br.com.ifsul.api.exception.ResourceNotFoundException;
import br.com.ifsul.api.model.Book;
import br.com.ifsul.api.model.BookStatus;
import br.com.ifsul.api.model.User;
import br.com.ifsul.api.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class BookService {

    private final BookRepository bookRepository;
    private final CurrentUserProvider currentUserProvider;

    public Page<BookResponse> listMyBooks(BookStatus status, Pageable pageable) {
        User currentUser = currentUserProvider.getCurrentUser();

        Page<Book> books = (status != null)
                ? bookRepository.findByUserIdAndStatus(currentUser.getId(), status, pageable)
                : bookRepository.findByUserId(currentUser.getId(), pageable);

        return books.map(BookResponse::fromEntity);
    }

    public BookResponse addBook(BookRequest request) {
        User currentUser = currentUserProvider.getCurrentUser();

        Book book = Book.builder()
                .titulo(request.titulo())
                .autor(request.autor())
                .sinopse(request.sinopse())
                .urlCapa(request.urlCapa())
                .status(request.status())
                .user(currentUser)
                .build();

        Book saved = bookRepository.save(book);
        log.info("Livro '{}' adicionado pelo usuário {}", saved.getTitulo(), currentUser.getEmail());

        return BookResponse.fromEntity(saved);
    }

    public BookResponse updateBook(Long bookId, BookRequest request) {
        Book book = findBookOrThrow(bookId);
        assertOwnership(book);

        book.setTitulo(request.titulo());
        book.setAutor(request.autor());
        book.setSinopse(request.sinopse());
        book.setUrlCapa(request.urlCapa());
        book.setStatus(request.status());

        return BookResponse.fromEntity(bookRepository.save(book));
    }

    public void deleteBook(Long bookId) {
        Book book = findBookOrThrow(bookId);
        assertOwnership(book);
        bookRepository.delete(book);
    }

    private Book findBookOrThrow(Long bookId) {
        return bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Livro não encontrado: " + bookId));
    }

    private void assertOwnership(Book book) {
        User currentUser = currentUserProvider.getCurrentUser();
        if (!book.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedCustomException("Você só pode gerenciar seus próprios livros");
        }
    }
}
