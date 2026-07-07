package br.com.ifsul.api.service;

import br.com.ifsul.api.dto.post.PostRequest;
import br.com.ifsul.api.dto.post.PostResponse;
import br.com.ifsul.api.exception.AccessDeniedCustomException;
import br.com.ifsul.api.exception.ResourceNotFoundException;
import br.com.ifsul.api.model.Post;
import br.com.ifsul.api.model.User;
import br.com.ifsul.api.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class PostService {

    private final PostRepository postRepository;
    private final CurrentUserProvider currentUserProvider;

    public Page<PostResponse> listFeed(Pageable pageable) {
        return postRepository.findAllByOrderByCreatedAtDesc(pageable).map(PostResponse::fromEntity);
    }

    public Page<PostResponse> listByUser(Long userId, Pageable pageable) {
        return postRepository.findByUserId(userId, pageable).map(PostResponse::fromEntity);
    }

    public PostResponse createPost(PostRequest request) {
        User currentUser = currentUserProvider.getCurrentUser();

        Post post = Post.builder()
                .conteudo(request.conteudo())
                .user(currentUser)
                .build();

        Post saved = postRepository.save(post);
        log.info("Publicação criada por {}", currentUser.getEmail());

        return PostResponse.fromEntity(saved);
    }

    public void deletePost(Long postId) {
        Post post = findPostOrThrow(postId);
        User currentUser = currentUserProvider.getCurrentUser();

        if (!post.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedCustomException("Você só pode excluir suas próprias publicações");
        }

        postRepository.delete(post);
    }

    private Post findPostOrThrow(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Publicação não encontrada: " + postId));
    }
}
