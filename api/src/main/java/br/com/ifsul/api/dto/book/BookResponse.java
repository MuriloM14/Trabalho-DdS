package br.com.ifsul.api.dto.book;

import br.com.ifsul.api.model.Book;
import br.com.ifsul.api.model.BookStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookResponse {

    private Long id;
    private String titulo;
    private String autor;
    private String sinopse;
    private String urlCapa;
    private BookStatus status;
    private Long userId;
    private LocalDateTime createdAt;

    public static BookResponse fromEntity(Book book) {
        return BookResponse.builder()
                .id(book.getId())
                .titulo(book.getTitulo())
                .autor(book.getAutor())
                .sinopse(book.getSinopse())
                .urlCapa(book.getUrlCapa())
                .status(book.getStatus())
                .userId(book.getUser().getId())
                .createdAt(book.getCreatedAt())
                .build();
    }
}
