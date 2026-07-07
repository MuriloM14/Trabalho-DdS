package br.com.ifsul.api.service;

import br.com.ifsul.api.dto.user.UserProfileResponse;
import br.com.ifsul.api.exception.ResourceNotFoundException;
import br.com.ifsul.api.model.User;
import br.com.ifsul.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;

    public UserProfileResponse getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado: " + userId));
        return UserProfileResponse.fromEntity(user);
    }
}
