import { Request, Response } from "express";
import { pool } from "../config/database";

export async function listComments(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const [rows] = await pool.query<any[]>(
      `SELECT c.id, c.content, c.created_at, c.user_id, u.name AS author_name
       FROM comments c
       JOIN users u ON u.id = c.user_id
       WHERE c.article_id = ?
       ORDER BY c.created_at ASC`,
      [id]
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno ao listar comentários." });
  }
}

export async function createComment(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user?.id;

    if (!content || !content.trim()) {
      res.status(400).json({ message: "O comentário não pode estar vazio." });
      return;
    }

    const [articleRows] = await pool.query<any[]>("SELECT id FROM articles WHERE id = ?", [id]);
    if (articleRows.length === 0) {
      res.status(404).json({ message: "Artigo não encontrado." });
      return;
    }

    const [result] = await pool.query<any>(
      "INSERT INTO comments (article_id, user_id, content) VALUES (?, ?, ?)",
      [id, userId, content.trim()]
    );

    const [rows] = await pool.query<any[]>(
      `SELECT c.id, c.content, c.created_at, c.user_id, u.name AS author_name
       FROM comments c JOIN users u ON u.id = c.user_id WHERE c.id = ?`,
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno ao criar comentário." });
  }
}

export async function deleteComment(req: Request, res: Response): Promise<void> {
  try {
    const { commentId } = req.params;
    const userId = req.user?.id;

    const [rows] = await pool.query<any[]>("SELECT user_id FROM comments WHERE id = ?", [
      commentId,
    ]);

    if (rows.length === 0) {
      res.status(404).json({ message: "Comentário não encontrado." });
      return;
    }

    if (rows[0].user_id !== userId) {
      res.status(403).json({ message: "Você não tem permissão para excluir este comentário." });
      return;
    }

    await pool.query("DELETE FROM comments WHERE id = ?", [commentId]);
    res.json({ message: "Comentário excluído com sucesso." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno ao excluir comentário." });
  }
}
