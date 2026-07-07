package br.com.ifsul.api.dto.book;

import br.com.ifsul.api.model.BookStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record BookRequest(

        @NotBlank(message = "O título é obrigatório")
        String titulo,

        String autor,

        String sinopse,

        String urlCapa,

        @NotNull(message = "O status é obrigatório")
        BookStatus status
) {
}
