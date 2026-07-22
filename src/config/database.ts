import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "blog_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
});

export async function testarConexao(): Promise<void> {
  try {
    const conexao = await pool.getConnection();
    console.log("✅ Conexão com o banco de dados MySQL estabelecida com sucesso.");
    conexao.release();
  } catch (erro) {
    console.error("❌ Erro ao conectar ao banco de dados:", erro);
    process.exit(1);
  }
}
