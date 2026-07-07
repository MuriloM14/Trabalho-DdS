package br.com.ifsul.api.service;

import br.com.ifsul.api.dto.comment.CommentRequest;
import br.com.ifsul.api.dto.comment.CommentResponse;
import br.com.ifsul.api.exception.AccessDeniedCustomException;
import br.com.ifsul.api.exception.ResourceNotFoundException;
import br.com.ifsul.api.model.Comment;
import br.com.ifsul.api.model.Post;
import br.com.ifsul.api.model.User;
import br.com.ifsul.api.repository.CommentRepository;
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
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final CurrentUserProvider currentUserProvider;

    public Page<CommentResponse> listByPost(Long postId, Pageable pageable) {
        return commentRepository.findByPostId(postId, pageable).map(CommentResponse::fromEntity);
    }

    public CommentResponse addComment(Long postId, CommentRequest request) {
        User currentUser = currentUserProvider.getCurrentUser();

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Publicação não encontrada: " + postId));

        Comment comment = Comment.builder()
                .conteudo(request.conteudo())
                .autor(currentUser)
                .post(post)
                .build();

        Comment saved = commentRepository.save(comment);
        log.info("Comentário adicionado por {} na publicação {}", currentUser.getEmail(), postId);

        return CommentResponse.fromEntity(saved);
    }

    public void deleteComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comentário não encontrado: " + commentId));

        User currentUser = currentUserProvider.getCurrentUser();

        boolean isAuthor = comment.getAutor().getId().equals(currentUser.getId());
        boolean isPostOwner = comment.getPost().getUser().getId().equals(currentUser.getId());

        if (!isAuthor && !isPostOwner) {
            throw new AccessDeniedCustomException(
                    "Você só pode excluir seus próprios comentários ou comentários na sua publicação");
        }

        commentRepository.delete(comment);
    }
}
