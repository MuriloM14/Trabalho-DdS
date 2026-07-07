package br.com.ifsul.api.dto.user;

import br.com.ifsul.api.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO usado para exibir o perfil de outro usuário (REQ009), sem dados sensíveis.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {

    private Long id;
    private String nome;
    private String bio;

    public static UserProfileResponse fromEntity(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .nome(user.getNome())
                .bio(user.getBio())
                .build();
    }
}
