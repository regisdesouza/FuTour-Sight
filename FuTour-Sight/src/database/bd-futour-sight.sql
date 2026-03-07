CREATE DATABASE futour_sight;
USE futour_sight;


CREATE TABLE Empresa (
    idEmpresa INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    cnpj CHAR(14) NOT NULL UNIQUE,
    email VARCHAR(150) UNIQUE,
    status ENUM('ATIVA','SUSPENSA') DEFAULT 'ATIVA',
    dataCriacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    dataAtualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Usuario (
    idUsuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    tipo ENUM('PLATAFORMA_ADMIN','EMPRESA_ADMIN','EMPRESA_USER') NOT NULL,
    FkEmpresa INT,
    status ENUM('ATIVO','INATIVO') DEFAULT 'ATIVO',
    dataCriacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    dataAtualizacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (FkEmpresa) REFERENCES Empresa(idEmpresa)
);

CREATE TABLE Token (
    idToken INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(100) NOT NULL UNIQUE,
    usado BOOLEAN DEFAULT FALSE,
    dataCriacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    dataExpiracao DATETIME,
    dataUso DATETIME
);


CREATE TABLE Unidade (
    idUnidade INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    cidade VARCHAR(100),
    estado VARCHAR(100),
    cep CHAR(8),
    status ENUM('ATIVA','INATIVA') DEFAULT 'ATIVA',
    Empresa_idEmpresa INT NOT NULL,
    dataCriacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Empresa_idEmpresa) REFERENCES Empresa(idEmpresa)
);

CREATE TABLE Feedback (
    idFeedback INT AUTO_INCREMENT PRIMARY KEY,
    mensagem TEXT NOT NULL,
    nota INT CHECK (nota BETWEEN 0 AND 5),
    dataCriacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    Usuario_idUsuario INT NOT NULL,
    Empresa_idEmpresa INT NOT NULL,
    UNIQUE (Usuario_idUsuario, Empresa_idEmpresa),
    FOREIGN KEY (Usuario_idUsuario) REFERENCES Usuario(idUsuario),
    FOREIGN KEY (Empresa_idEmpresa) REFERENCES Empresa(idEmpresa)
);

CREATE TABLE Chegadas_turistas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    via_de_acesso VARCHAR(20),
    uf VARCHAR(50),
    nome_pais_origem VARCHAR(100),
    mes VARCHAR(20),
    ano INT,
    chegadas INT
);

CREATE TABLE Log (  
    idLog INT AUTO_INCREMENT PRIMARY KEY,
    acao ENUM('LOGIN','LOGOUT','CRIAR','ATUALIZAR','DELETAR') NOT NULL,
    descricao TEXT,
    ip VARCHAR(45),
    dataCriacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    Usuario_idUsuario INT NOT NULL,
    FOREIGN KEY (Usuario_idUsuario) REFERENCES Usuario(idUsuario)
);