CREATE IF NOT EXISTS DATABASE restpastrop;
USE restpastrop;

CREATE TABLE users(
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    username VARCHAR(30),
    email VARCHAR(255),
    name VARCHAR(40),
    lastname VARCHAR(40),
    password VARCHAR(255)
);

CREATE TABLE apparts(
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    owner INT NOT NULL,
    title VARCHAR(200),
    address VARCHAR(200),
    status INT,
    price INT
);