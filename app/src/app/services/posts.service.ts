import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PageResponse, PostItem, PostPayload } from '../interfaces';
import { ApiSupportService } from './api-support.service';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private readonly http = inject(HttpClient);
  private readonly apiSupport = inject(ApiSupportService);

  listPosts(page = 0, size = 6) {
    return this.http.get<PageResponse<PostItem>>(
      `${this.apiSupport.apiUrl}/posts`,
      this.apiSupport.withAuth(this.apiSupport.createPageParams(page, size))
    );
  }

  listPostsByUser(userId: number, page = 0, size = 5) {
    return this.http.get<PageResponse<PostItem>>(
      `${this.apiSupport.apiUrl}/posts/user/${userId}`,
      this.apiSupport.withAuth(this.apiSupport.createPageParams(page, size))
    );
  }

  createPost(payload: PostPayload) {
    return this.http.post<PostItem>(
      `${this.apiSupport.apiUrl}/posts`,
      payload,
      this.apiSupport.withAuth()
    );
  }

  deletePost(postId: number) {
    return this.http.delete<void>(
      `${this.apiSupport.apiUrl}/posts/${postId}`,
      this.apiSupport.withAuth()
    );
  }
}
