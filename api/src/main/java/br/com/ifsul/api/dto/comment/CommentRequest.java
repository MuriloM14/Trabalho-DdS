package br.com.ifsul.api.dto.comment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CommentRequest(

        @NotBlank(message = "O comentário não pode ser vazio")
        @Size(max = 1000, message = "O comentário deve ter no máximo 1000 caracteres")
        String conteudo
) {
}
