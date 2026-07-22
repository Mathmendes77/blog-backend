import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { pool } from "../config/database";
import { gerarToken } from "../utils/jwt";
import { Usuario } from "../types";

const RODADAS_SALT = 10;

export async function cadastrar(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: "Nome, email e senha são obrigatórios." });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ message: "A senha deve ter no mínimo 6 caracteres." });
      return;
    }

    const [existentes] = await pool.query<any[]>("SELECT id FROM users WHERE email = ?", [email]);
    if (existentes.length > 0) {
      res.status(409).json({ message: "Já existe um usuário cadastrado com este email." });
      return;
    }

    const senhaCriptografada = await bcrypt.hash(password, RODADAS_SALT);

    const [resultado] = await pool.query<any>(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, senhaCriptografada]
    );

    const token = gerarToken({ id: resultado.insertId, email });

    res.status(201).json({
      message: "Usuário cadastrado com sucesso.",
      token,
      user: { id: resultado.insertId, name, email },
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ message: "Erro interno ao cadastrar usuário." });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email e senha são obrigatórios." });
      return;
    }

    const [linhas] = await pool.query<any[]>("SELECT * FROM users WHERE email = ?", [email]);
    const usuario = linhas[0] as Usuario | undefined;

    if (!usuario) {
      res.status(401).json({ message: "Email ou senha inválidos." });
      return;
    }

    const senhaCorreta = await bcrypt.compare(password, usuario.password);
    if (!senhaCorreta) {
      res.status(401).json({ message: "Email ou senha inválidos." });
      return;
    }

    const token = gerarToken({ id: usuario.id, email: usuario.email });

    res.json({
      message: "Login realizado com sucesso.",
      token,
      user: { id: usuario.id, name: usuario.name, email: usuario.email },
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ message: "Erro interno ao realizar login." });
  }
}

export async function buscarUsuarioLogado(req: Request, res: Response): Promise<void> {
  try {
    const idUsuario = req.usuario?.id;
    const [linhas] = await pool.query<any[]>(
      `SELECT id, name, email, created_at, (avatar_image IS NOT NULL) AS has_avatar
       FROM users WHERE id = ?`,
      [idUsuario]
    );

    if (linhas.length === 0) {
      res.status(404).json({ message: "Usuário não encontrado." });
      return;
    }

    res.json(linhas[0]);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ message: "Erro interno ao buscar usuário." });
  }
}

export async function atualizarPerfil(req: Request, res: Response): Promise<void> {
  try {
    const idUsuario = req.usuario?.id;
    const { name } = req.body;

    if (!name || !name.trim()) {
      res.status(400).json({ message: "O nome não pode ficar vazio." });
      return;
    }

    if (req.file) {
      await pool.query("UPDATE users SET name = ?, avatar_image = ?, avatar_mime = ? WHERE id = ?", [
        name.trim(),
        req.file.buffer,
        req.file.mimetype,
        idUsuario,
      ]);
    } else {
      await pool.query("UPDATE users SET name = ? WHERE id = ?", [name.trim(), idUsuario]);
    }

    const [linhas] = await pool.query<any[]>(
      `SELECT id, name, email, created_at, (avatar_image IS NOT NULL) AS has_avatar
       FROM users WHERE id = ?`,
      [idUsuario]
    );

    res.json({ message: "Perfil atualizado com sucesso.", user: linhas[0] });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ message: "Erro interno ao atualizar perfil." });
  }
}

export async function buscarAvatar(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const [linhas] = await pool.query<any[]>(
      "SELECT avatar_image, avatar_mime FROM users WHERE id = ?",
      [id]
    );

    if (linhas.length === 0 || !linhas[0].avatar_image) {
      res.status(404).json({ message: "Avatar não encontrado." });
      return;
    }

    res.setHeader("Content-Type", linhas[0].avatar_mime || "image/jpeg");
    res.send(linhas[0].avatar_image);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ message: "Erro interno ao buscar avatar." });
  }
}
