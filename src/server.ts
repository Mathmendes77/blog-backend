import app from "./app";
import { testarConexao } from "./config/database";

const PORTA = process.env.PORT || 3333;

async function iniciar() {
  await testarConexao();
  app.listen(PORTA, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORTA}`);
  });
}

iniciar();
