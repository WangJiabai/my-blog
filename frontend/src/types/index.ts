export interface User {
  id: number;
  username: string;
  email: string;
  display_name: string;
  is_admin: boolean;
}

export interface Article {
  id: number;
  author_id: number;
  title: string;
  slug: string;
  summary: string | null;
  content_md: string;
  content_html: string;
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  author_name: string | null;
}

export interface ArticleListItem {
  id: number;
  title: string;
  slug: string;
  summary: string | null;
  status: string;
  published_at: string | null;
  created_at: string;
  author_name: string | null;
}

export interface Comment {
  id: number;
  article_id: number;
  author_id: number;
  body: string;
  is_approved: boolean;
  created_at: string;
  author_name: string | null;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  display_name: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface Stats {
  total_articles: number;
  published_articles: number;
  draft_articles: number;
  total_comments: number;
  total_users: number;
}
