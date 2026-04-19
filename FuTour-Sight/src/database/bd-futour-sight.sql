CREATE DATABASE futour_sight;
USE futour_sight;

CREATE TABLE nivel_permissao (
    id_nivel_permissao INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE,
    descricao VARCHAR(255)
);

INSERT INTO nivel_permissao (nome, descricao) VALUES
('PLATAFORMA_ADMIN', 'Administrador da FuTour Sight - acesso total ao sistema'),
('EMPRESA_ADMIN', 'Administrador da empresa cliente - gerencia sua equipe'),
('EMPRESA_USER', 'Funcionario da empresa - acesso ao dashboard');


CREATE TABLE status (
    id_status INT AUTO_INCREMENT PRIMARY KEY,
    contexto VARCHAR(50) NOT NULL,
    nome VARCHAR(50) NOT NULL,
    descricao VARCHAR(255)
);

INSERT INTO status (contexto, nome, descricao) VALUES
('EMPRESA',     'ATIVA',      'Empresa ativa na plataforma'),
('EMPRESA',     'SUSPENSA',   'Empresa temporariamente suspensa'),
('EMPRESA',     'PENDENTE',   'Aguardando ativacao'),
('USUARIO',     'ATIVO',      'Usuario com acesso liberado'),
('USUARIO',     'INATIVO',    'Usuario desativado'),
('USUARIO',     'PENDENTE',   'Aguardando primeiro acesso'),
('UNIDADE',     'ATIVA',      'Unidade em operacao'),
('UNIDADE',     'INATIVA',    'Unidade desativada'),
('SOLICITACAO', 'PENDENTE',   'Aguardando analise do administrador'),
('SOLICITACAO', 'EM_ANALISE', 'Em analise pelo administrador'),
('SOLICITACAO', 'APROVADA',   'Solicitacao aprovada e processada'),
('SOLICITACAO', 'RECUSADA',   'Solicitacao recusada pelo administrador');


CREATE TABLE contato (
    id_contato INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telefone VARCHAR(20),
    mensagem TEXT NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE empresa (
    id_empresa INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    cnpj CHAR(14) NOT NULL UNIQUE,
    email VARCHAR(150) UNIQUE,
    telefone VARCHAR(20),
    fk_status INT NOT NULL DEFAULT 1,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (fk_status) REFERENCES status(id_status)
);


CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150),
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255),
    fk_nivel_permissao INT NOT NULL,
    fk_empresa INT,
    fk_status INT NOT NULL DEFAULT 6,
    primeiro_acesso BOOLEAN DEFAULT TRUE,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (fk_nivel_permissao) REFERENCES nivel_permissao(id_nivel_permissao),
    FOREIGN KEY (fk_empresa) REFERENCES empresa(id_empresa),
    FOREIGN KEY (fk_status) REFERENCES status(id_status)
);


CREATE TABLE solicitacao_cadastro (
    id_solicitacao INT AUTO_INCREMENT PRIMARY KEY,
    nome_responsavel VARCHAR(150) NOT NULL,
    email_responsavel VARCHAR(150) NOT NULL,
    telefone_responsavel VARCHAR(20),
    nome_empresa VARCHAR(150) NOT NULL,
    cnpj_empresa CHAR(14) NOT NULL,
    email_empresa VARCHAR(150),
    telefone_empresa VARCHAR(20),
    fk_status INT NOT NULL DEFAULT 9,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (fk_status) REFERENCES status(id_status)
);


CREATE TABLE unidade (
    id_unidade INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    cidade VARCHAR(100),
    estado VARCHAR(100),
    cep CHAR(8),
    logradouro VARCHAR(100),
    numero CHAR(6),
    complemento VARCHAR(100),
    fk_status INT NOT NULL DEFAULT 7,
    fk_empresa INT NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fk_status) REFERENCES status(id_status),
    FOREIGN KEY (fk_empresa) REFERENCES empresa(id_empresa)
);


CREATE TABLE log (
    id_log INT AUTO_INCREMENT PRIMARY KEY,
    tabela VARCHAR(100) NOT NULL,
    registros_lidos INT DEFAULT 0,
    sucesso BOOLEAN NOT NULL,
    mensagem TEXT,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE chegadas_turistas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    via_de_acesso VARCHAR(20),
    uf VARCHAR(50),
    nome_pais_origem VARCHAR(100),
    mes VARCHAR(20),
    ano INT,
    chegadas INT
);


CREATE VIEW vw_solicitacoes AS
SELECT
    sc.id_solicitacao,
    sc.nome_responsavel,
    sc.email_responsavel,
    sc.telefone_responsavel,
    sc.nome_empresa,
    sc.cnpj_empresa,
    sc.email_empresa,
    sc.telefone_empresa,
    sc.data_criacao,
    s.nome AS status
FROM solicitacao_cadastro sc
INNER JOIN status s ON s.id_status = sc.fk_status;


CREATE VIEW vw_empresas AS
SELECT
    e.id_empresa,
    e.nome,
    e.cnpj,
    e.email,
    e.telefone,
    s.nome AS status,
    e.data_criacao,
    COUNT(u.id_usuario) AS total_usuarios
FROM empresa e
INNER JOIN status s ON s.id_status = e.fk_status
LEFT JOIN usuario u ON u.fk_empresa = e.id_empresa
GROUP BY e.id_empresa, e.nome, e.cnpj, e.email, e.telefone, s.nome, e.data_criacao;


CREATE VIEW vw_usuarios AS
SELECT
    u.id_usuario,
    u.nome,
    u.email,
    u.primeiro_acesso,
    u.data_criacao,
    np.nome AS nivel_permissao,
    s.nome AS status,
    e.id_empresa,
    e.nome AS empresa
FROM usuario u
INNER JOIN nivel_permissao np ON np.id_nivel_permissao = u.fk_nivel_permissao
INNER JOIN status s ON s.id_status = u.fk_status
LEFT JOIN empresa e ON e.id_empresa = u.fk_empresa;


SELECT * FROM vw_empresas
ORDER BY nome ASC;

SELECT * FROM vw_empresas
WHERE nome LIKE '%empresa teste%'
ORDER BY nome ASC;


SELECT * FROM vw_usuarios
WHERE status != 'PENDENTE'
ORDER BY nome ASC;

SELECT * FROM vw_usuarios
WHERE status != 'PENDENTE'
  AND id_empresa = 1
  AND nome LIKE '%joao%'
ORDER BY nome ASC;


SELECT * FROM vw_solicitacoes
ORDER BY data_criacao DESC;

SELECT * FROM vw_solicitacoes
WHERE id_solicitacao = 1;


SELECT
    id_log,
    tabela,
    registros_lidos,
    sucesso,
    mensagem,
    data_criacao
FROM log
ORDER BY data_criacao DESC;