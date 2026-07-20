import app from "./app";
import { testConnection } from "./config/database";

const PORT = process.env.PORT || 3333;

async function start() {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  });
}

start();
