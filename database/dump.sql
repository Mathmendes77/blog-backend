-- =========================================================
-- Dump do banco de dados "blog_db"
-- Sistema de Blog - Case Mind Group
-- Como usar:
--   mysql -u root -p < dump.sql
-- =========================================================

CREATE DATABASE IF NOT EXISTS blog_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE blog_db;

DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(255) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE articles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content LONGTEXT NOT NULL,
  summary VARCHAR(500) NULL,
  banner_image LONGBLOB NULL,
  banner_mime VARCHAR(100) NULL,
  author_id INT NOT NULL,
  published_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_articles_author
    FOREIGN KEY (author_id) REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_articles_author ON articles(author_id);
CREATE INDEX idx_articles_published_at ON articles(published_at);

-- Usuário de exemplo (senha: 123456)
INSERT INTO users (name, email, password) VALUES
('Admin Demo', 'admin@blog.com', '$2b$10$a0/o2kSZrIDrOSy0RSocPOFvgS4oQjLKlNRcVLxwj/ZrcBj9Zsrsq');

-- Artigos de exemplo
INSERT INTO articles (title, content, summary, author_id) VALUES
('Bem-vindo ao nosso Blog', 'Este é o primeiro artigo de exemplo do sistema de blog. Aqui você pode escrever, editar e compartilhar suas ideias com o mundo.', 'Um artigo de boas-vindas para testar o sistema.', 1),
('Como o React facilita o desenvolvimento Front-end', 'React é uma biblioteca JavaScript para construção de interfaces de usuário, criada pelo Facebook. Ela permite a criação de componentes reutilizáveis...', 'Uma introdução rápida sobre o React.', 1);
