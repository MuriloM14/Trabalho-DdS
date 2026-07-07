package br.com.ifsul.api.dto.post;

import br.com.ifsul.api.model.Post;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostResponse {

    private Long id;
    private String conteudo;
    private Long userId;
    private String autorNome;
    private long totalComentarios;
    private LocalDateTime createdAt;

    public static PostResponse fromEntity(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .conteudo(post.getConteudo())
                .userId(post.getUser().getId())
                .autorNome(post.getUser().getNome())
                .totalComentarios(post.getComentarios() != null ? post.getComentarios().size() : 0)
                .createdAt(post.getCreatedAt())
                .build();
    }
}
