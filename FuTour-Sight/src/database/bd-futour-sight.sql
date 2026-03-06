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

CREATE TABLE DadosAereos (
    idDadosAereos INT AUTO_INCREMENT PRIMARY KEY,
    empresaSigla VARCHAR(10) NOT NULL,
    empresaNome VARCHAR(200) NOT NULL,
    empresaNacionalidade ENUM('BRASILEIRA','ESTRANGEIRA') NOT NULL,
    ano SMALLINT NOT NULL,
    mes TINYINT NOT NULL CHECK (mes BETWEEN 1 AND 12),
    origemSigla CHAR(4) NOT NULL,
    origemNome VARCHAR(150),
    origemUF CHAR(2),
    origemRegiao VARCHAR(50),
    origemPais VARCHAR(100),
    origemContinente VARCHAR(50),
    destinoSigla CHAR(4) NOT NULL,
    destinoNome VARCHAR(150),
    destinoUF CHAR(2),
    destinoRegiao VARCHAR(50),
    destinoPais VARCHAR(100),
    destinoContinente VARCHAR(50),
    natureza VARCHAR(50),
    grupoVoo VARCHAR(50),
    passageirosPagos INT DEFAULT 0,
    passageirosGratis INT DEFAULT 0,
    decolagens INT DEFAULT 0,
    assentos INT DEFAULT 0,
    dataCriacao DATETIME DEFAULT CURRENT_TIMESTAMP
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