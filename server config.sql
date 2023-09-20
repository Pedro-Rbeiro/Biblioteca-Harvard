-- CREATE DATABASE harvard_db;
-- USE harvard_db;

CREATE TABLE author (
	id_author INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255)
);
-- ALTER TABLE books DROP CONSTRAINT fk_auth;
-- DROP TABLE author;
CREATE TABLE books (
	id INT PRIMARY KEY AUTO_INCREMENT,
    nome_author VARCHAR(255),
    genero VARCHAR(255),
    data_publicacao DATE,
    fk_author INT
);

ALTER TABLE books ADD CONSTRAINT fk_auth FOREIGN KEY books(fk_author) REFERENCES author(id_author);

SELECT * FROM books as b join author as a on b.fk_author = a.id_author