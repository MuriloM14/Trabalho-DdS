package br.com.ifsul.api.repository;

import br.com.ifsul.api.model.Book;
import br.com.ifsul.api.model.BookStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<Book, Long> {

    // RNF006: listagem paginada
    Page<Book> findByUserId(Long userId, Pageable pageable);

    // REQ004: categorizar por status
    Page<Book> findByUserIdAndStatus(Long userId, BookStatus status, Pageable pageable);
}
