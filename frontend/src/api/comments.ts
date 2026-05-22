import client from "./client";
import type { Comment, PaginatedResponse } from "../types";

export async function getComments(
  articleId: number,
  page = 1,
  pageSize = 20
): Promise<PaginatedResponse<Comment>> {
  const res = await client.get(`/api/articles/${articleId}/comments`, {
    params: { page, page_size: pageSize },
  });
  return res.data;
}

export async function createComment(
  articleId: number,
  body: string
): Promise<Comment> {
  const res = await client.post(`/api/articles/${articleId}/comments`, {
    body,
  });
  return res.data;
}

export async function deleteComment(commentId: number): Promise<void> {
  await client.delete(`/api/comments/${commentId}`);
}
