import { Request, Response } from "express";
import { pool } from "../config/database";

export async function listarComentarios(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const [linhas] = await pool.query<any[]>(
      `SELECT c.id, c.content, c.created_at, c.user_id, u.name AS author_name
       FROM comments c
       JOIN users u ON u.id = c.user_id
       WHERE c.article_id = ?
       ORDER BY c.created_at ASC`,
      [id]
    );

    res.json(linhas);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ message: "Erro interno ao listar comentários." });
  }
}

export async function criarComentario(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const idUsuario = req.usuario?.id;

    if (!content || !content.trim()) {
      res.status(400).json({ message: "O comentário não pode estar vazio." });
      return;
    }

    const [linhasArtigo] = await pool.query<any[]>("SELECT id FROM articles WHERE id = ?", [id]);
    if (linhasArtigo.length === 0) {
      res.status(404).json({ message: "Artigo não encontrado." });
      return;
    }

    const [resultado] = await pool.query<any>(
      "INSERT INTO comments (article_id, user_id, content) VALUES (?, ?, ?)",
      [id, idUsuario, content.trim()]
    );

    const [linhas] = await pool.query<any[]>(
      `SELECT c.id, c.content, c.created_at, c.user_id, u.name AS author_name
       FROM comments c JOIN users u ON u.id = c.user_id WHERE c.id = ?`,
      [resultado.insertId]
    );

    res.status(201).json(linhas[0]);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ message: "Erro interno ao criar comentário." });
  }
}

export async function excluirComentario(req: Request, res: Response): Promise<void> {
  try {
    const { commentId } = req.params;
    const idUsuario = req.usuario?.id;

    const [linhas] = await pool.query<any[]>("SELECT user_id FROM comments WHERE id = ?", [
      commentId,
    ]);

    if (linhas.length === 0) {
      res.status(404).json({ message: "Comentário não encontrado." });
      return;
    }

    if (linhas[0].user_id !== idUsuario) {
      res.status(403).json({ message: "Você não tem permissão para excluir este comentário." });
      return;
    }

    await pool.query("DELETE FROM comments WHERE id = ?", [commentId]);
    res.json({ message: "Comentário excluído com sucesso." });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ message: "Erro interno ao excluir comentário." });
  }
}
