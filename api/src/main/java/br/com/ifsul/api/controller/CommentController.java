package br.com.ifsul.api.controller;

import br.com.ifsul.api.dto.comment.CommentRequest;
import br.com.ifsul.api.dto.comment.CommentResponse;
import br.com.ifsul.api.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/api/posts/{postId}/comments")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable Long postId,
            @Valid @RequestBody CommentRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(commentService.addComment(postId, request));
    }

    @GetMapping("/api/posts/{postId}/comments")
    public ResponseEntity<Page<CommentResponse>> listComments(
            @PathVariable Long postId,
            @ParameterObject
            @PageableDefault(size = 10) Pageable pageable
    ) {
        return ResponseEntity.ok(commentService.listByPost(postId, pageable));
    }

    @DeleteMapping("/api/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        commentService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }
}
