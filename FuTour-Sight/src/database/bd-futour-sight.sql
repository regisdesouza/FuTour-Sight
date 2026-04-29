CREATE DATABASE IF NOT EXISTS futour_sight;
 
USE futour_sight;
 
 
CREATE TABLE nivel_permissao (
    id_nivel_permissao INT AUTO_INCREMENT PRIMARY KEY,
    nome               VARCHAR(50)  NOT NULL UNIQUE,
    descricao          VARCHAR(255)
);
 
INSERT INTO nivel_permissao (nome, descricao) VALUES
('PLATAFORMA_ADMIN', 'Administrador da FuTour Sight - acesso total ao sistema'),
('EMPRESA_ADMIN',    'Administrador da empresa cliente - gerencia sua equipe'),
('EMPRESA_USER',     'Funcionario da empresa - acesso ao dashboard');
 
 
CREATE TABLE status (
    id_status INT AUTO_INCREMENT PRIMARY KEY,
    contexto  VARCHAR(50) NOT NULL,
    nome      VARCHAR(50) NOT NULL,
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
    id_contato   INT AUTO_INCREMENT PRIMARY KEY,
    nome         VARCHAR(150) NOT NULL,
    email        VARCHAR(150) NOT NULL,
    telefone     VARCHAR(20),
    mensagem     TEXT         NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
);
 
 
CREATE TABLE empresa (
    id_empresa       INT AUTO_INCREMENT PRIMARY KEY,
    nome             VARCHAR(150) NOT NULL,
    cnpj             CHAR(14)     NOT NULL UNIQUE,
    email            VARCHAR(150) UNIQUE,
    telefone         VARCHAR(20),
    fk_status        INT          NOT NULL DEFAULT 3,
    data_criacao     DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (fk_status) REFERENCES status(id_status)
);
 
INSERT INTO empresa (nome, cnpj, email, telefone, fk_status) VALUES
('FutourSight', '01253456200015', 'futoursight@gmail.com', '11944444444', 1),
('Hotel Haddock', '53145733000180', 'hotelhaddock@gmail.com', '1127888634', 1);
 
 
CREATE TABLE usuario (
    id_usuario         INT AUTO_INCREMENT PRIMARY KEY,
    nome               VARCHAR(150),
    email              VARCHAR(150) NOT NULL UNIQUE,
    senha              VARCHAR(255),
    fk_nivel_permissao INT          NOT NULL,
    fk_empresa         INT,
    fk_status          INT          NOT NULL DEFAULT 6,
    primeiro_acesso    BOOLEAN DEFAULT TRUE,
    data_criacao       DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (fk_nivel_permissao) REFERENCES nivel_permissao(id_nivel_permissao),
    FOREIGN KEY (fk_empresa)         REFERENCES empresa(id_empresa),
    FOREIGN KEY (fk_status)          REFERENCES status(id_status)
);
 
INSERT INTO usuario (nome, email, senha, fk_nivel_permissao, fk_empresa, fk_status) VALUES
('Reginaldo de Souza',  'reginaldo@futoursight.com.br',        'Senha@1234', 1, 1, 4),
('Debora Marsal',       'deboramarsal@futoursight.com.br',     'Senha@4321', 1, 1, 4),
('Lucas Eiki Gushiken', 'lucaseiki@futoursight.com.br',        'Senha@1232', 1, 1, 4),
('Gabriel Rodrigues',   'gabrielrodrigues@futoursight.com.br', 'Senha@1333', 1, 1, 4),
('Lucas Frossi',        'lucasfrossi@futoursight.com.br',      'Senha@4123', 1, 1, 4),
('Jorge Araújo',        'jorgearaujo@haddock.com.br',      'Codig0@123', 2, 2, 4),
('Mariana Martins',        'marianamartins@haddock.com.br',      'Codig0@224', 3, 2, 4);
 
CREATE TABLE solicitacao_cadastro (
    id_solicitacao       INT AUTO_INCREMENT PRIMARY KEY,
    nome_responsavel     VARCHAR(150) NOT NULL,
    email_responsavel    VARCHAR(150) NOT NULL,
    telefone_responsavel VARCHAR(20),
    nome_empresa         VARCHAR(150) NOT NULL,
    cnpj_empresa         CHAR(14)     NOT NULL,
    email_empresa        VARCHAR(150),
    telefone_empresa     VARCHAR(20),
    fk_status            INT          NOT NULL DEFAULT 9,
    data_criacao         DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao     DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (fk_status) REFERENCES status(id_status)
);
 
 
CREATE TABLE endereco (
    id_endereco  INT AUTO_INCREMENT PRIMARY KEY,
    cep          CHAR(8),
    logradouro   VARCHAR(100),
    numero       CHAR(6),
    bairro       VARCHAR(100),
    cidade       VARCHAR(100),
    estado       VARCHAR(100),
    complemento  VARCHAR(100),
    fk_status    INT NOT NULL DEFAULT 7,
    fk_empresa   INT NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fk_status)  REFERENCES status(id_status),
    FOREIGN KEY (fk_empresa) REFERENCES empresa(id_empresa)
);

INSERT INTO endereco (cep, logradouro, numero, bairro, cidade, estado, complemento, fk_status, fk_empresa) VALUES
('11706230', 'Rua São Cristóvão', '331', 'Caiçara', 'Praia Grande', 'São Paulo', null, 7, 2);
 
CREATE TABLE log (
    id_log          INT AUTO_INCREMENT PRIMARY KEY,
    tabela          VARCHAR(100) NOT NULL,
    registros_lidos INT DEFAULT 0,
    sucesso         BOOLEAN      NOT NULL,
    mensagem        TEXT,
    data_criacao    DATETIME DEFAULT CURRENT_TIMESTAMP
);
 
 
CREATE TABLE chegadas_turistas (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    via_de_acesso    VARCHAR(20),
    uf               VARCHAR(50),
    nome_pais_origem VARCHAR(100),
    mes              VARCHAR(20),
    ano              INT,
    chegadas         INT
);
 
 
CREATE TABLE filtro_personalizado (
    id_filtro        INT AUTO_INCREMENT PRIMARY KEY,
    nome             VARCHAR(100) NOT NULL,
    descricao        VARCHAR(255),
    ano_referencia   INT,
    mes_inicio       VARCHAR(20),
    mes_fim          VARCHAR(20),
    fk_usuario       INT NOT NULL,
    data_criacao     DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (fk_usuario) REFERENCES usuario(id_usuario)
);
 
 
CREATE TABLE filtro_item (
    id_filtro_item INT AUTO_INCREMENT PRIMARY KEY,
    fk_filtro      INT          NOT NULL,
    tipo           VARCHAR(6)   NOT NULL,
    valor          VARCHAR(100) NOT NULL,
    CONSTRAINT chk_tipo CHECK (tipo IN ('PAIS', 'ESTADO')),
    FOREIGN KEY (fk_filtro) REFERENCES filtro_personalizado(id_filtro) ON DELETE CASCADE
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
INNER JOIN status s  ON s.id_status  = e.fk_status
LEFT  JOIN usuario u ON u.fk_empresa = e.id_empresa
GROUP BY e.id_empresa, e.nome, e.cnpj, e.email, e.telefone, s.nome, e.data_criacao;
 
 
CREATE VIEW vw_usuarios AS
SELECT
    u.id_usuario,
    u.nome,
    u.email,
    u.primeiro_acesso,
    u.data_criacao,
    np.nome AS nivel_permissao,
    s.nome  AS status,
    e.id_empresa,
    e.nome  AS empresa
FROM usuario u
INNER JOIN nivel_permissao np ON np.id_nivel_permissao = u.fk_nivel_permissao
INNER JOIN status s           ON s.id_status           = u.fk_status
LEFT  JOIN empresa e          ON e.id_empresa          = u.fk_empresa;
 
 
CREATE VIEW vw_metricas_filtro AS
SELECT
    ct.ano,
    COUNT(DISTINCT ct.uf) AS total_estados,
    SUM(ct.chegadas)      AS total_turistas,
    (
        SELECT nome_pais_origem
        FROM chegadas_turistas ct2
        WHERE ct2.ano = ct.ano
        GROUP BY nome_pais_origem
        ORDER BY SUM(chegadas) DESC
        LIMIT 1
    ) AS pais_lider,
    ROUND(
        (
            SELECT SUM(chegadas)
            FROM chegadas_turistas ct2
            WHERE ct2.ano = ct.ano
              AND ct2.nome_pais_origem = (
                  SELECT nome_pais_origem
                  FROM chegadas_turistas ct3
                  WHERE ct3.ano = ct.ano
                  GROUP BY nome_pais_origem
                  ORDER BY SUM(chegadas) DESC
                  LIMIT 1
              )
        ) * 100.0 / SUM(ct.chegadas), 0
    ) AS percentual_pais_lider,
    (
        SELECT mes
        FROM chegadas_turistas ct2
        WHERE ct2.ano = ct.ano
        GROUP BY mes
        ORDER BY SUM(chegadas) DESC
        LIMIT 1
    ) AS melhor_mes,
    (
        SELECT SUM(chegadas)
        FROM chegadas_turistas ct2
        WHERE ct2.ano = ct.ano
          AND ct2.mes = (
              SELECT mes
              FROM chegadas_turistas ct3
              WHERE ct3.ano = ct.ano
              GROUP BY mes
              ORDER BY SUM(chegadas) DESC
              LIMIT 1
          )
    ) AS turistas_melhor_mes
FROM chegadas_turistas ct
GROUP BY ct.ano;
 
 
CREATE VIEW vw_fluxo_mensal AS
SELECT
    ano,
    mes,
    SUM(chegadas) AS total_turistas,
    CASE mes
        WHEN 'Janeiro'   THEN 1
        WHEN 'Fevereiro' THEN 2
        WHEN 'Marco'     THEN 3
        WHEN 'Abril'     THEN 4
        WHEN 'Maio'      THEN 5
        WHEN 'Junho'     THEN 6
        WHEN 'Julho'     THEN 7
        WHEN 'Agosto'    THEN 8
        WHEN 'Setembro'  THEN 9
        WHEN 'Outubro'   THEN 10
        WHEN 'Novembro'  THEN 11
        WHEN 'Dezembro'  THEN 12
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
 
 
SELECT * FROM vw_empresas ORDER BY nome ASC;
 
SELECT * FROM vw_empresas WHERE nome LIKE '%empresa teste%' ORDER BY nome ASC;
 
SELECT * FROM vw_usuarios WHERE status != 'PENDENTE' ORDER BY nome ASC;
 
SELECT * FROM vw_usuarios
WHERE status     != 'PENDENTE'
  AND id_empresa  = 1
  AND nome LIKE '%joao%'
ORDER BY nome ASC;
 
SELECT * FROM vw_solicitacoes ORDER BY data_criacao DESC;
 
SELECT * FROM vw_solicitacoes WHERE id_solicitacao = 1;
 
SELECT id_log, tabela, registros_lidos, sucesso, mensagem, data_criacao
FROM log
ORDER BY data_criacao DESC;