CREATE DATABASE futour_sight;
USE futour_sight;


CREATE TABLE NivelPermissao (
    idNivelPermissao INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE,
    descricao VARCHAR(255)
);

INSERT INTO NivelPermissao (nome, descricao) VALUES
('PLATAFORMA_ADMIN', 'Administrador da FuTour Sight, acesso total ao sistema'),
('EMPRESA_ADMIN', 'Administrador do cliente, gerencia sua empresa e funcionarios'),
('EMPRESA_USER', 'Funcionario da empresa, acesso limitado ao dashboard');

CREATE TABLE Status (
    idStatus  INT AUTO_INCREMENT PRIMARY KEY,
    contexto  VARCHAR(50) NOT NULL,
    nome      VARCHAR(50) NOT NULL,
    descricao VARCHAR(255),
    UNIQUE (contexto, nome)
);

INSERT INTO Status (contexto, nome, descricao) VALUES
('EMPRESA',  'ATIVA',    'Empresa ativa na plataforma'),
('EMPRESA',  'SUSPENSA', 'Empresa temporariamente suspensa'),
('EMPRESA',  'PENDENTE', 'Aguardando ativação ou aprovação'),
('USUARIO',  'ATIVO',    'Usuario com acesso liberado'),
('USUARIO',  'INATIVO',  'Usuario desativado'),
('USUARIO',  'PENDENTE', 'Aguardando ativação'),
('UNIDADE',  'ATIVA',    'Unidade em operação'),
('UNIDADE',  'INATIVA',  'Unidade desativada');

CREATE TABLE TipoAcaoLog (
    idTipoAcaoLog INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE,
    descricao VARCHAR(255)
);

INSERT INTO TipoAcaoLog (nome, descricao) VALUES
('LOGIN',     'Autenticação de usuario'),
('LOGOUT',    'Encerramento de sessão'),
('CRIAR',     'Criação de usuário'),
('ATUALIZAR', 'Atualização de usuário'),
('DELETAR',   'Remoção de usuário');

CREATE TABLE Empresa (
    idEmpresa       INT AUTO_INCREMENT PRIMARY KEY,
    nome            VARCHAR(150),
    cnpj            CHAR(14) UNIQUE,
    email           VARCHAR(150) UNIQUE,
    telefone        VARCHAR(20),
    FkStatus        INT NOT NULL DEFAULT 3,
    dataCriacao     DATETIME DEFAULT CURRENT_TIMESTAMP,
    dataAtualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (FkStatus) REFERENCES Status(idStatus)
);

CREATE TABLE Usuario (
    idUsuario        INT AUTO_INCREMENT PRIMARY KEY,
    nome             VARCHAR(150),
    email            VARCHAR(150) NOT NULL UNIQUE,
    senha            VARCHAR(255),
    FkNivelPermissao INT NOT NULL,
    FkEmpresa        INT,
    FkStatus         INT NOT NULL DEFAULT 6,
    primeiroAcesso   BOOLEAN DEFAULT TRUE,
    dataCriacao      DATETIME DEFAULT CURRENT_TIMESTAMP,
    dataAtualizacao  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (FkNivelPermissao) REFERENCES NivelPermissao(idNivelPermissao),
    FOREIGN KEY (FkEmpresa)        REFERENCES Empresa(idEmpresa),
    FOREIGN KEY (FkStatus)         REFERENCES Status(idStatus)
);

CREATE TABLE Unidade (
    idUnidade         INT AUTO_INCREMENT PRIMARY KEY,
    nome              VARCHAR(150) NOT NULL,
    cidade            VARCHAR(100),
    estado            VARCHAR(100),
    cep               CHAR(8),
    logradouro        VARCHAR(100),
    numero            CHAR(6),
    FkStatus          INT NOT NULL DEFAULT 7,
    Empresa_idEmpresa INT NOT NULL,
    dataCriacao       DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (FkStatus)          REFERENCES Status(idStatus),
    FOREIGN KEY (Empresa_idEmpresa) REFERENCES Empresa(idEmpresa)
);

CREATE TABLE Chegadas_turistas (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    via_de_acesso    VARCHAR(20),
    uf               VARCHAR(50),
    nome_pais_origem VARCHAR(100),
    mes              VARCHAR(20),
    ano              INT,
    chegadas         INT
);

CREATE TABLE Log (
    idLog             INT AUTO_INCREMENT PRIMARY KEY,
    FkTipoAcaoLog     INT NOT NULL,
    descricao         TEXT,
    ip                VARCHAR(45),
    dataCriacao       DATETIME DEFAULT CURRENT_TIMESTAMP,
    Usuario_idUsuario INT NOT NULL,
    FOREIGN KEY (FkTipoAcaoLog)     REFERENCES TipoAcaoLog(idTipoAcaoLog),
    FOREIGN KEY (Usuario_idUsuario) REFERENCES Usuario(idUsuario)
);

CREATE TABLE Contato (
    idContato   INT AUTO_INCREMENT PRIMARY KEY,
    mensagem    TEXT NOT NULL,
    dataCriacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FkEmpresa   INT,
    FOREIGN KEY (FkEmpresa) REFERENCES Empresa(idEmpresa)
);