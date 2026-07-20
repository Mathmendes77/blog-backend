# Blog - Backend

API REST para o sistema de blog, desenvolvida com **Node.js**, **Express** e **TypeScript**, utilizando **MySQL** como banco de dados.

## 🚀 Tecnologias

- Node.js + Express
- TypeScript
- MySQL (driver `mysql2`, sem ORM)
- JWT (autenticação)
- bcrypt (hash de senhas)
- Multer (upload de imagens, armazenadas como BLOB no banco)

## 📁 Estrutura do projeto

```
src/
  config/        # Conexão com o banco de dados
  controllers/   # Regras de negócio (auth, artigos)
  middlewares/   # Autenticação JWT e upload de imagens
  routes/        # Definição das rotas da API
  types/         # Tipos TypeScript compartilhados
  utils/         # Funções utilitárias (JWT)
  app.ts         # Configuração do Express
  server.ts      # Ponto de entrada da aplicação
database/
  schema.sql     # Apenas a estrutura das tabelas
  dump.sql       # Estrutura + dados de exemplo (recomendado)
```

## ⚙️ Como rodar o projeto

### 1. Pré-requisitos
- Node.js 18+
- MySQL 8+ instalado e rodando

### 2. Clonar e instalar dependências
```bash
git clone <url-deste-repositorio>
cd blog-backend
npm install
```

### 3. Configurar o banco de dados
Importe o dump (já cria o banco `blog_db`, as tabelas e um usuário de exemplo):
```bash
mysql -u root -p < database/dump.sql
```

**Usuário de exemplo criado pelo dump:**
- Email: `admin@blog.com`
- Senha: `123456`

### 4. Configurar variáveis de ambiente
Copie o arquivo de exemplo e ajuste com suas credenciais do MySQL:
```bash
cp .env.example .env
```

```env
PORT=3333
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=blog_db
JWT_SECRET=um_segredo_bem_forte_aqui
JWT_EXPIRES_IN=1d
```

### 5. Rodar em modo desenvolvimento
```bash
npm run dev
```
O servidor sobe em `http://localhost:3333`.

### 6. Build para produção
```bash
npm run build
npm start
```

## 📚 Endpoints da API

### Autenticação (`/auth`)
| Método | Rota            | Descrição                        | Autenticação |
|--------|-----------------|-----------------------------------|--------------|
| POST   | `/auth/register` | Cadastra um novo usuário          | Não          |
| POST   | `/auth/login`    | Realiza login e retorna um token  | Não          |
| GET    | `/auth/me`       | Retorna dados do usuário logado   | Sim          |

**Registro / Login - body:**
```json
{ "name": "Fulano", "email": "fulano@email.com", "password": "123456" }
```
Resposta (login/registro):
```json
{ "token": "jwt...", "user": { "id": 1, "name": "Fulano", "email": "fulano@email.com" } }
```

### Artigos (`/articles`)
| Método | Rota                   | Descrição                          | Autenticação |
|--------|------------------------|--------------------------------------|--------------|
| GET    | `/articles`             | Lista todos os artigos (aceita `?search=`) | Não   |
| GET    | `/articles/:id`         | Detalhe de um artigo                | Não          |
| GET    | `/articles/:id/banner`  | Retorna a imagem banner do artigo   | Não          |
| POST   | `/articles`              | Cria um artigo (`multipart/form-data`) | Sim       |
| PUT    | `/articles/:id`          | Edita um artigo (apenas o autor)    | Sim          |
| DELETE | `/articles/:id`          | Remove um artigo (apenas o autor)   | Sim          |

Para criar/editar um artigo, envie como `multipart/form-data` os campos:
`title`, `content`, `summary` (opcional), `tags` (opcional, string separada por vírgula, ex: `"Tecnologia,IA"`) e `banner` (arquivo de imagem, opcional).

O header de autenticação deve ser enviado em todas as rotas protegidas:
```
Authorization: Bearer <token>
```

### Comentários (`/articles/:id/comments`)
| Método | Rota                             | Descrição                          | Autenticação |
|--------|-----------------------------------|--------------------------------------|--------------|
| GET    | `/articles/:id/comments`          | Lista os comentários de um artigo   | Não          |
| POST   | `/articles/:id/comments`          | Cria um comentário (`{ "content": "..." }`) | Sim  |
| DELETE | `/articles/comments/:commentId`   | Remove um comentário (apenas o autor do comentário) | Sim |

## 🔒 Segurança
- Senhas armazenadas com hash `bcrypt`.
- Rotas de criação/edição/exclusão de artigos protegidas por middleware JWT.
- Apenas o autor de um artigo pode editá-lo ou excluí-lo.

## 🗄️ Sobre o armazenamento de imagens
As imagens de banner são salvas como `LONGBLOB` diretamente no MySQL (coluna `banner_image` da tabela `articles`), conforme especificado no case. Elas são servidas através da rota `GET /articles/:id/banner`.
