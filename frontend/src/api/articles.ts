import client from "./client";
import type { Article, ArticleListItem, PaginatedResponse } from "../types";

export async function getArticles(
  page = 1,
  pageSize = 20
): Promise<PaginatedResponse<ArticleListItem>> {
  const res = await client.get("/api/articles", {
    params: { page, page_size: pageSize },
  });
  return res.data;
}

export async function getArticle(slug: string): Promise<Article> {
  const res = await client.get(`/api/articles/${slug}`);
  return res.data;
}

export async function createArticle(data: {
  title: string;
  summary?: string;
  content_md: string;
  status?: string;
}): Promise<Article> {
  const res = await client.post("/api/articles", data);
  return res.data;
}

export async function updateArticle(
  id: number,
  data: Partial<{
    title: string;
    summary: string;
    content_md: string;
    status: string;
  }>
): Promise<Article> {
  const res = await client.put(`/api/articles/${id}`, data);
  return res.data;
}

export async function deleteArticle(id: number): Promise<void> {
  await client.delete(`/api/articles/${id}`);
}
