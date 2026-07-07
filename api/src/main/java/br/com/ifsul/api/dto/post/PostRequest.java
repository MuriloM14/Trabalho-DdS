package br.com.ifsul.api.dto.post;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PostRequest(

        @NotBlank(message = "O conteúdo da publicação é obrigatório")
        @Size(max = 2000, message = "A publicação deve ter no máximo 2000 caracteres")
        String conteudo
) {
}
