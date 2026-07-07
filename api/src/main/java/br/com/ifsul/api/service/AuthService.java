package br.com.ifsul.api.service;

import br.com.ifsul.api.config.JwtService;
import br.com.ifsul.api.dto.auth.AuthResponse;
import br.com.ifsul.api.dto.auth.LoginRequest;
import br.com.ifsul.api.dto.auth.RegisterRequest;
import br.com.ifsul.api.exception.EmailAlreadyExistsException;
import br.com.ifsul.api.model.User;
import br.com.ifsul.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * REQ001: cadastro de usuário.
 * REQ002: login/autenticação.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyExistsException("Já existe um usuário cadastrado com este e-mail");
        }

        User user = User.builder()
                .nome(request.nome())
                .email(request.email())
                .senha(passwordEncoder.encode(request.senha())) // RNF001: senha criptografada
                .build();

        User savedUser = userRepository.save(user);
        log.info("Novo usuário cadastrado: {}", savedUser.getEmail());

        String token = jwtService.generateToken(savedUser);

        return AuthResponse.builder()
                .token(token)
                .userId(savedUser.getId())
                .nome(savedUser.getNome())
                .email(savedUser.getEmail())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.senha())
        );

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalStateException("Usuário não encontrado após autenticação"));

        String token = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .nome(user.getNome())
                .email(user.getEmail())
                .build();
    }
}
