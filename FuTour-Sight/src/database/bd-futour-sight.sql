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

INSERT INTO empresa(nome, cnpj, email, telefone) VALUES
('FutourSight', '01253456200015', 'futoursight@gmail.com', '11944444444');

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

INSERT INTO usuario(nome, email, senha, fk_nivel_permissao, fk_empresa, fk_status) VALUES
('Reginaldo de Souza', 'reginaldo@futoursight.com.br', 'Senha@1234', 1, 1, 1),
('Débora Marsal', 'deboramarsal@futoursight.com.br', 'Senha@4321', 1, 1, 1),
('Lucas Eiki Gushiken', 'lucaseiki@futoursight.com.br', 'Senha@1232', 1, 1, 1),
('Gabriel Rodrigues', 'gabrielrodrigues@futoursight.com.br', 'Senha@1333', 1, 1, 1),
('Lucas Frossi', 'lucasfrossi@futoursight.com.br', 'Senha@4123', 1, 1, 1);

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

CREATE TABLE endereco (
 id_endereco INT AUTO_INCREMENT PRIMARY KEY,
 nome VARCHAR(150) NOT NULL,
 cep CHAR(8),
 logradouro VARCHAR(100),
 numero CHAR(6),
 bairro VARCHAR(100),
 cidade VARCHAR(100),
 estado VARCHAR(100),
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


CREATE TABLE filtro_personalizado (
    id_filtro INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(255),
    ano_referencia INT,
    fk_usuario INT NOT NULL,
    fk_empresa INT,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (fk_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (fk_empresa) REFERENCES empresa(id_empresa)
);


CREATE TABLE filtro_pais (
    id_filtro_pais INT AUTO_INCREMENT PRIMARY KEY,
    fk_filtro INT NOT NULL,
    pais_origem VARCHAR(100) NOT NULL,
    FOREIGN KEY (fk_filtro) REFERENCES filtro_personalizado(id_filtro) ON DELETE CASCADE
);


CREATE TABLE filtro_estado (
    id_filtro_estado INT AUTO_INCREMENT PRIMARY KEY,
    fk_filtro INT NOT NULL,
    uf VARCHAR(50) NOT NULL,
    FOREIGN KEY (fk_filtro) REFERENCES filtro_personalizado(id_filtro) ON DELETE CASCADE
);


CREATE TABLE filtro_mes (
    id_filtro_mes INT AUTO_INCREMENT PRIMARY KEY,
    fk_filtro INT NOT NULL,
    mes VARCHAR(20) NOT NULL,
    FOREIGN KEY (fk_filtro) REFERENCES filtro_personalizado(id_filtro) ON DELETE CASCADE
);


CREATE VIEW vw_metricas_filtro AS
SELECT
    ct.ano,
    COUNT(DISTINCT ct.uf) AS total_estados,
    SUM(ct.chegadas) AS total_turistas,
    (SELECT nome_pais_origem 
     FROM chegadas_turistas ct2
     WHERE ct2.ano = ct.ano
     GROUP BY nome_pais_origem
     ORDER BY SUM(chegadas) DESC
     LIMIT 1) AS pais_lider,
    ROUND(
        (SELECT SUM(chegadas) 
         FROM chegadas_turistas ct2
         WHERE ct2.ano = ct.ano
         AND ct2.nome_pais_origem = (
             SELECT nome_pais_origem 
             FROM chegadas_turistas ct3
             WHERE ct3.ano = ct.ano
             GROUP BY nome_pais_origem
             ORDER BY SUM(chegadas) DESC
             LIMIT 1
         )) * 100.0 / SUM(ct.chegadas), 0
    ) AS percentual_pais_lider,
    (SELECT mes
     FROM chegadas_turistas ct2
     WHERE ct2.ano = ct.ano
     GROUP BY mes
     ORDER BY SUM(chegadas) DESC
     LIMIT 1) AS melhor_mes,
    (SELECT SUM(chegadas)
     FROM chegadas_turistas ct2
     WHERE ct2.ano = ct.ano
     AND ct2.mes = (
         SELECT mes
         FROM chegadas_turistas ct3
         WHERE ct3.ano = ct.ano
         GROUP BY mes
         ORDER BY SUM(chegadas) DESC
         LIMIT 1
     )) AS turistas_melhor_mes
FROM chegadas_turistas ct
GROUP BY ct.ano;

CREATE VIEW vw_fluxo_mensal AS
SELECT
    ano,
    mes,
    SUM(chegadas) AS total_turistas,
    CASE mes
        WHEN 'Janeiro' THEN 1
        WHEN 'Fevereiro' THEN 2
        WHEN 'Março' THEN 3
        WHEN 'Abril' THEN 4
        WHEN 'Maio' THEN 5
        WHEN 'Junho' THEN 6
        WHEN 'Julho' THEN 7
        WHEN 'Agosto' THEN 8
        WHEN 'Setembro' THEN 9
        WHEN 'Outubro' THEN 10
        WHEN 'Novembro' THEN 11
        WHEN 'Dezembro' THEN 12
    END AS mes_numero
FROM chegadas_turistas
GROUP BY ano, mes
ORDER BY ano, mes_numero;


CREATE VIEW vw_ranking_paises AS
SELECT
    ano,
    nome_pais_origem,
    SUM(chegadas) AS total_turistas,
    ROUND(
        SUM(chegadas) * 100.0 / (
            SELECT SUM(chegadas)
            FROM chegadas_turistas ct2
            WHERE ct2.ano = ct.ano
        ), 0
    ) AS percentual
FROM chegadas_turistas ct
GROUP BY ano, nome_pais_origem
ORDER BY ano, total_turistas DESC;


CREATE VIEW vw_dashboard_filtrado AS
SELECT
    ct.ano,
    ct.mes,
    ct.uf,
    ct.nome_pais_origem,
    ct.via_de_acesso,
    SUM(ct.chegadas) AS total_turistas
FROM chegadas_turistas ct
GROUP BY ct.ano, ct.mes, ct.uf, ct.nome_pais_origem, ct.via_de_acesso;


SELECT 
    COUNT(DISTINCT df.uf) AS total_estados,
    SUM(df.total_turistas) AS total_turistas,
    (SELECT nome_pais_origem 
     FROM vw_dashboard_filtrado df2
     WHERE df2.ano = 2024
     AND df2.uf IN (SELECT uf FROM filtro_estado WHERE fk_filtro = 1)
     AND df2.nome_pais_origem IN (SELECT pais_origem FROM filtro_pais WHERE fk_filtro = 1)
     AND df2.mes IN (SELECT mes FROM filtro_mes WHERE fk_filtro = 1)
     GROUP BY nome_pais_origem
     ORDER BY SUM(total_turistas) DESC
     LIMIT 1) AS pais_lider
FROM vw_dashboard_filtrado df
WHERE df.ano = 2024
AND df.uf IN (SELECT uf FROM filtro_estado WHERE fk_filtro = 1)
AND df.nome_pais_origem IN (SELECT pais_origem FROM filtro_pais WHERE fk_filtro = 1)
AND df.mes IN (SELECT mes FROM filtro_mes WHERE fk_filtro = 1);


SELECT 
    fm.mes,
    fm.mes_numero,
    SUM(ct.chegadas) AS total_turistas
FROM chegadas_turistas ct
INNER JOIN vw_fluxo_mensal fm ON fm.mes = ct.mes AND fm.ano = ct.ano
WHERE ct.ano = 2024
AND ct.uf IN (SELECT uf FROM filtro_estado WHERE fk_filtro = 1)
AND ct.nome_pais_origem IN (SELECT pais_origem FROM filtro_pais WHERE fk_filtro = 1)
AND ct.mes IN (SELECT mes FROM filtro_mes WHERE fk_filtro = 1)
GROUP BY fm.mes, fm.mes_numero
ORDER BY fm.mes_numero;


SELECT 
    ct.nome_pais_origem,
    SUM(ct.chegadas) AS total_turistas,
    ROUND(
        SUM(ct.chegadas) * 100.0 / (
            SELECT SUM(chegadas)
            FROM chegadas_turistas ct2
            WHERE ct2.ano = 2024
            AND ct2.uf IN (SELECT uf FROM filtro_estado WHERE fk_filtro = 1)
            AND ct2.mes IN (SELECT mes FROM filtro_mes WHERE fk_filtro = 1)
        ), 0
    ) AS percentual
FROM chegadas_turistas ct
WHERE ct.ano = 2024
AND ct.uf IN (SELECT uf FROM filtro_estado WHERE fk_filtro = 1)
AND ct.nome_pais_origem IN (SELECT pais_origem FROM filtro_pais WHERE fk_filtro = 1)
AND ct.mes IN (SELECT mes FROM filtro_mes WHERE fk_filtro = 1)
GROUP BY ct.nome_pais_origem
ORDER BY total_turistas DESC
LIMIT 6;


SELECT 
    ano,
    SUM(chegadas) AS total_turistas
FROM chegadas_turistas
WHERE ano IN (2024, 2023)
AND uf IN (SELECT uf FROM filtro_estado WHERE fk_filtro = 1)
AND nome_pais_origem IN (SELECT pais_origem FROM filtro_pais WHERE fk_filtro = 1)
AND mes IN (SELECT mes FROM filtro_mes WHERE fk_filtro = 1)
GROUP BY ano;

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

SELECT * FROM usuario;

