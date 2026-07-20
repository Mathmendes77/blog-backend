export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface UserPublic {
  id: number;
  name: string;
  email: string;
  avatar_url?: string | null;
  created_at?: string;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  summary?: string | null;
  banner_image?: Buffer | null;
  banner_mime?: string | null;
  author_id: number;
  published_at: string;
  updated_at: string;
}

export interface ArticleWithAuthor extends Omit<Article, "banner_image"> {
  author_name: string;
  has_banner: boolean;
}

export interface AuthTokenPayload {
  id: number;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}
