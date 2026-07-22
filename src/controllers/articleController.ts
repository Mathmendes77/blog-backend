import { Request, Response } from "express";
import { pool } from "../config/database";

// Lista todos os artigos (não retorna a imagem em binário, apenas indica se existe)
export async function listarArtigos(req: Request, res: Response): Promise<void> {
  try {
    const busca = (req.query.search as string) || "";

    const [linhas] = await pool.query<any[]>(
      `SELECT a.id, a.title, a.summary, a.tags, a.author_id, a.published_at, a.updated_at,
              CHAR_LENGTH(a.content) AS content_length,
              u.name AS author_name,
              (a.banner_image IS NOT NULL) AS has_banner,
              (SELECT COUNT(*) FROM comments c WHERE c.article_id = a.id) AS comment_count
       FROM articles a
       JOIN users u ON u.id = a.author_id
       WHERE a.title LIKE ? OR a.summary LIKE ? OR a.tags LIKE ?
       ORDER BY a.published_at DESC`,
      [`%${busca}%`, `%${busca}%`, `%${busca}%`]
    );

    res.json(linhas);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ message: "Erro interno ao listar artigos." });
  }
}

// Busca um artigo específico pelo id (sem a imagem binária)
export async function buscarArtigoPorId(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const [linhas] = await pool.query<any[]>(
      `SELECT a.id, a.title, a.content, a.summary, a.tags, a.author_id, a.published_at, a.updated_at,
              u.name AS author_name,
              (a.banner_image IS NOT NULL) AS has_banner,
              (SELECT COUNT(*) FROM comments c WHERE c.article_id = a.id) AS comment_count
       FROM articles a
       JOIN users u ON u.id = a.author_id
       WHERE a.id = ?`,
      [id]
    );

    if (linhas.length === 0) {
      res.status(404).json({ message: "Artigo não encontrado." });
      return;
    }

    res.json(linhas[0]);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ message: "Erro interno ao buscar artigo." });
  }
}

// Retorna a imagem banner do artigo como arquivo binário
export async function buscarBannerArtigo(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const [linhas] = await pool.query<any[]>(
      "SELECT banner_image, banner_mime FROM articles WHERE id = ?",
      [id]
    );

    if (linhas.length === 0 || !linhas[0].banner_image) {
      res.status(404).json({ message: "Imagem não encontrada." });
      return;
    }

    res.setHeader("Content-Type", linhas[0].banner_mime || "image/jpeg");
    res.send(linhas[0].banner_image);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ message: "Erro interno ao buscar imagem." });
  }
}

export async function criarArtigo(req: Request, res: Response): Promise<void> {
  try {
    const { title, content, summary, tags } = req.body;
    const idAutor = req.usuario?.id;

    if (!title || !content) {
      res.status(400).json({ message: "Título e conteúdo são obrigatórios." });
      return;
    }

    const bufferBanner = req.file ? req.file.buffer : null;
    const tipoBanner = req.file ? req.file.mimetype : null;

    const [resultado] = await pool.query<any>(
      `INSERT INTO articles (title, content, summary, tags, banner_image, banner_mime, author_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, content, summary || null, tags || null, bufferBanner, tipoBanner, idAutor]
    );

    res.status(201).json({ message: "Artigo criado com sucesso.", id: resultado.insertId });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ message: "Erro interno ao criar artigo." });
  }
}

export async function atualizarArtigo(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { title, content, summary, tags } = req.body;
    const idUsuario = req.usuario?.id;

    const [linhas] = await pool.query<any[]>("SELECT author_id FROM articles WHERE id = ?", [id]);

    if (linhas.length === 0) {
      res.status(404).json({ message: "Artigo não encontrado." });
      return;
    }

    if (linhas[0].author_id !== idUsuario) {
      res.status(403).json({ message: "Você não tem permissão para editar este artigo." });
      return;
    }

    if (req.file) {
      await pool.query(
        `UPDATE articles SET title = ?, content = ?, summary = ?, tags = ?, banner_image = ?, banner_mime = ?
         WHERE id = ?`,
        [title, content, summary || null, tags || null, req.file.buffer, req.file.mimetype, id]
      );
    } else {
      await pool.query(
        `UPDATE articles SET title = ?, content = ?, summary = ?, tags = ? WHERE id = ?`,
        [title, content, summary || null, tags || null, id]
      );
    }

    res.json({ message: "Artigo atualizado com sucesso." });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ message: "Erro interno ao atualizar artigo." });
  }
}

export async function excluirArtigo(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const idUsuario = req.usuario?.id;

    const [linhas] = await pool.query<any[]>("SELECT author_id FROM articles WHERE id = ?", [id]);

    if (linhas.length === 0) {
      res.status(404).json({ message: "Artigo não encontrado." });
      return;
    }

    if (linhas[0].author_id !== idUsuario) {
      res.status(403).json({ message: "Você não tem permissão para excluir este artigo." });
      return;
    }

    await pool.query("DELETE FROM articles WHERE id = ?", [id]);

    res.json({ message: "Artigo excluído com sucesso." });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ message: "Erro interno ao excluir artigo." });
  }
}
