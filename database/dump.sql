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

DROP TABLE IF EXISTS comments;
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
  tags VARCHAR(255) NULL,
  banner_image LONGBLOB NULL,
  banner_mime VARCHAR(100) NULL,
  author_id INT NOT NULL,
  published_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_articles_author
    FOREIGN KEY (author_id) REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  article_id INT NOT NULL,
  user_id INT NOT NULL,
  content VARCHAR(1000) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_comments_article
    FOREIGN KEY (article_id) REFERENCES articles(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_comments_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_articles_author ON articles(author_id);
CREATE INDEX idx_articles_published_at ON articles(published_at);
CREATE INDEX idx_comments_article ON comments(article_id);

-- Usuários de exemplo (senha para ambos: 123456)
INSERT INTO users (name, email, password) VALUES
('Admin Demo', 'admin@blog.com', '$2b$10$a0/o2kSZrIDrOSy0RSocPOFvgS4oQjLKlNRcVLxwj/ZrcBj9Zsrsq'),
('Marie Smith', 'marie@blog.com', '$2b$10$a0/o2kSZrIDrOSy0RSocPOFvgS4oQjLKlNRcVLxwj/ZrcBj9Zsrsq');

-- Artigos de exemplo
INSERT INTO articles (title, content, summary, tags, author_id) VALUES
('O Futuro da Inteligência Artificial em 2025',
'A inteligência artificial continua a evoluir em um ritmo acelerado. Neste artigo, vamos explorar as principais tendências e inovações que estão moldando o futuro da IA.

Modelos de Linguagem Avançados
Os modelos de linguagem estão se tornando cada vez mais sofisticados, capazes de entender e gerar texto com precisão impressionante.

Automação Inteligente
A automação está alcançando novos patamares com sistemas de IA que podem tomar decisões complexas e se adaptar a novas situações.

Ética e Responsabilidade
Com o avanço da IA, questões éticas se tornam cada vez mais importantes. É crucial desenvolver sistemas responsáveis e transparentes.',
'Explorando as tendências e inovações que moldarão o futuro da IA nos próximos anos.',
'Inteligência Artificial,Desenvolvimento backend', 1),
('Como o React facilita o desenvolvimento Front-end',
'React é uma biblioteca JavaScript para construção de interfaces de usuário. Ela permite a criação de componentes reutilizáveis, o que acelera o desenvolvimento e facilita a manutenção de aplicações web modernas.',
'Uma introdução rápida sobre os fundamentos e vantagens do React.',
'Desenvolvimento web', 2),
('Bem-vindo ao nosso Blog',
'Este é o primeiro artigo de exemplo do sistema de blog. Aqui você pode escrever, editar e compartilhar suas ideias com o mundo.',
'Um artigo de boas-vindas para testar o sistema.',
'Desenvolvimento web', 1);

-- Comentários de exemplo
INSERT INTO comments (article_id, user_id, content) VALUES
(1, 2, 'Excelente artigo! Muito bem explicado sobre as tendências de IA.'),
(1, 1, 'Artigo muito interessante, mostra claramente como a IA está deixando de ser tendência para se tornar essencial nas soluções do dia a dia.');
