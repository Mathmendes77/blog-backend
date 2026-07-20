import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import articleRoutes from "./routes/articleRoutes";

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "API do Blog - Case Mind Group está rodando 🚀" });
});

app.use("/auth", authRoutes);
app.use("/articles", articleRoutes);

// Handler de erros do multer e outros erros não tratados
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (err.message?.includes("suportado") || err.message?.includes("File too large")) {
    res.status(400).json({ message: err.message });
    return;
  }
  console.error(err);
  res.status(500).json({ message: "Erro interno no servidor." });
});

// Rota não encontrada
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Rota não encontrada." });
});

export default app;
