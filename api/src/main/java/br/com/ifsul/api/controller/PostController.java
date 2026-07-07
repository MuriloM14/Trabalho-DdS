package br.com.ifsul.api.controller;

import br.com.ifsul.api.dto.post.PostRequest;
import br.com.ifsul.api.dto.post.PostResponse;
import br.com.ifsul.api.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    // Feed geral, paginado (RNF006)
    @GetMapping
    public ResponseEntity<Page<PostResponse>> listFeed(@PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(postService.listFeed(pageable));
    }

    // REQ009: publicações de um usuário específico (visita ao perfil)
    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<PostResponse>> listByUser(
            @PathVariable Long userId,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        return ResponseEntity.ok(postService.listByUser(userId, pageable));
    }

    // REQ008
    @PostMapping
    public ResponseEntity<PostResponse> createPost(@Valid @RequestBody PostRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(postService.createPost(request));
    }

    // REQ012
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }
}
