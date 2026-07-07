import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CommentItem, CommentPayload, PageResponse } from '../interfaces';
import { ApiSupportService } from './api-support.service';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private readonly http = inject(HttpClient);
  private readonly apiSupport = inject(ApiSupportService);

  listComments(postId: number, page = 0, size = 5) {
    return this.http.get<PageResponse<CommentItem>>(
      `${this.apiSupport.apiUrl}/posts/${postId}/comments`,
      this.apiSupport.withAuth(this.apiSupport.createPageParams(page, size))
    );
  }

  createComment(postId: number, payload: CommentPayload) {
    return this.http.post<CommentItem>(
      `${this.apiSupport.apiUrl}/posts/${postId}/comments`,
      payload,
      this.apiSupport.withAuth()
    );
  }

  deleteComment(commentId: number) {
    return this.http.delete<void>(
      `${this.apiSupport.apiUrl}/comments/${commentId}`,
      this.apiSupport.withAuth()
    );
  }
}
