package br.com.ifsul.api.controller;

import br.com.ifsul.api.dto.book.BookRequest;
import br.com.ifsul.api.dto.book.BookResponse;
import br.com.ifsul.api.model.BookStatus;
import br.com.ifsul.api.service.BookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    // REQ003 / REQ004 / RNF006: listagem paginada e filtrável por status
    @GetMapping
    public ResponseEntity<Page<BookResponse>> listMyBooks(
            @RequestParam(required = false) BookStatus status,
            @ParameterObject
            @PageableDefault(size = 10) Pageable pageable
    ) {
        return ResponseEntity.ok(bookService.listMyBooks(status, pageable));
    }

    // REQ005
    @PostMapping
    public ResponseEntity<BookResponse> addBook(@Valid @RequestBody BookRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookService.addBook(request));
    }

    // REQ007
    @PutMapping("/{id}")
    public ResponseEntity<BookResponse> updateBook(
            @PathVariable Long id,
            @Valid @RequestBody BookRequest request
    ) {
        return ResponseEntity.ok(bookService.updateBook(id, request));
    }

    // REQ006
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }
}
