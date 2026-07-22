# Blog - Backend

API REST para o sistema de blog, desenvolvida com **Node.js**, **Express** e **TypeScript**, utilizando **MySQL** como banco de dados.

 Tecnologias

- Node.js + Express
- TypeScript
- MySQL (driver `mysql2`, sem ORM)
- JWT (autenticação)
- bcrypt (hash de senhas)
- Multer (upload de imagens, armazenadas como BLOB no banco)

Como rodar o projeto
- Node.js 18+
- MySQL 8+ 

Clonar e instalar dependências

git clone <url-deste-repositorio>
cd blog-backend
npm install

 Configurar o banco de dados
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

Rodar em modo desenvolvimento

npm run dev

O servidor sobe em `http://localhost:3333`.

Build para produção

npm run build
npm start


