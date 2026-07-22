export interface Usuario {
  id: number;
  name: string;
  email: string;
  password: string;
  avatar_image?: Buffer | null;
  avatar_mime?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface UsuarioPublico {
  id: number;
  name: string;
  email: string;
  has_avatar?: boolean;
  created_at?: string;
}

export interface Artigo {
  id: number;
  title: string;
  content: string;
  summary?: string | null;
  tags?: string | null;
  banner_image?: Buffer | null;
  banner_mime?: string | null;
  author_id: number;
  published_at: string;
  updated_at: string;
}

export interface ArtigoComAutor extends Omit<Artigo, "banner_image"> {
  author_name: string;
  has_banner: boolean;
}

export interface Comentario {
  id: number;
  article_id: number;
  user_id: number;
  content: string;
  created_at: string;
}

export interface ComentarioComAutor extends Comentario {
  author_name: string;
}

export interface PayloadToken {
  id: number;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      usuario?: PayloadToken;
    }
  }
}
