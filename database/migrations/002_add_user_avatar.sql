-- Script de migração: adiciona suporte a avatar de usuário (BLOB).
-- Use este script se você já tem dados no banco e não quer rodar o dump.sql
-- (que apaga e recria as tabelas do zero).
--
-- Como usar:
--   mysql -u root -p blog_db < database/migrations/002_add_user_avatar.sql

USE blog_db;

ALTER TABLE users DROP COLUMN avatar_url;
ALTER TABLE users ADD COLUMN avatar_image LONGBLOB NULL;
ALTER TABLE users ADD COLUMN avatar_mime VARCHAR(100) NULL;
