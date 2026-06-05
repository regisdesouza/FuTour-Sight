const database = require("../database/config.js");

// ============================================================
// POST — criarEmpresa
// ============================================================

function criarEmpresa(nome, cnpj, email, telefone) {
    const instrucaoSql = `
        INSERT INTO empresa (
            nome,
            cnpj,
            email,
            telefone,
            fk_status
        )
        VALUES (?, ?, ?, ?, ?);
    `;

    return database.executar(instrucaoSql, [nome, cnpj, email, telefone, 1]);
}

// ============================================================
// POST — criarEndereco
// ============================================================

function criarEndereco(idEmpresa) {
    const instrucaoSql = `
        INSERT INTO endereco (fk_empresa)
        VALUES (?);
    `;

    return database.executar(instrucaoSql, [idEmpresa]);
}

// ============================================================
// POST — criarUsuario
// ============================================================

function criarUsuario(nome, email, senha, idEmpresa) {
    const instrucaoSql = `
        INSERT INTO usuario (
            nome,
            email,
            senha,
            fk_nivel_permissao,
            fk_empresa,
            fk_status
        )
        VALUES (?, ?, ?, ?, ?, ?);
    `;

    return database.executar(instrucaoSql, [nome, email, senha, 2, idEmpresa, 4]);
}

// ============================================================
// POST — criarFiltrosPadrao
// ============================================================

function criarFiltrosPadrao(idUsuario) {
    const instrucaoSql = `
        INSERT INTO filtro_personalizado (nome, ano_inicio, ano_fim, estado, continente, fk_usuario)
        VALUES
            ('América do Sul em SP', 2020, 2023, 'São Paulo',         'América do Sul', ?),
            ('América do Sul no RS', 2020, 2023, 'Rio Grande do Sul', 'América do Sul', ?),
            ('Europa em SP',         2020, 2023, 'São Paulo',         'Europa',         ?);
    `;

    return database.executar(instrucaoSql, [idUsuario, idUsuario, idUsuario]);
}

// ============================================================
// POST — aprovarSolicitacao
// ============================================================

function aprovarSolicitacao(idSolicitacao) {
    const instrucaoSql = `
        UPDATE solicitacao_cadastro
        SET fk_status = ?
        WHERE id_solicitacao = ?;
    `;

    return database.executar(instrucaoSql, [1, idSolicitacao]);
}

// ============================================================
// POST — cancelarSolicitacao
// ============================================================

function cancelarSolicitacao(idSolicitacao) {
    const instrucaoSql = `
        UPDATE solicitacao_cadastro
        SET fk_status = ?
        WHERE id_solicitacao = ?;
    `;

    return database.executar(instrucaoSql, [2, idSolicitacao]);
}

// ============================================================
// GET — listarSolicitacoes
// ============================================================

function listarSolicitacoes() {
    const instrucaoSql = `
        SELECT *
        FROM solicitacao_cadastro
        WHERE fk_status = ?;
    `;

    return database.executar(instrucaoSql, [9]);
}

// ============================================================
// GET — buscarSolicitacaoPorId
// ============================================================

function buscarSolicitacaoPorId(idSolicitacao) {
    const instrucaoSql = `
        SELECT *
        FROM solicitacao_cadastro
        WHERE id_solicitacao = ?;
    `;

    return database.executar(instrucaoSql, [idSolicitacao]);
}

// ============================================================
// GET — buscarLogs
// ============================================================

function buscarLogs() {
    const instrucaoSql = `
        SELECT
            id_log,
            tabela,
            registros_lidos,
            sucesso,
            mensagem,
            data_criacao
        FROM log
        ORDER BY data_criacao DESC;
    `;

    return database.executar(instrucaoSql);
}

// ============================================================
// GET — listarConfiguracoesNotificacao
// ============================================================

function listarConfiguracoesNotificacao() {
    const instrucaoSql = `
        SELECT
            cn.id_configuracao_notificacao,
            cn.nome,
            cn.tipo,
            cn.ativo,
            cn.intervalo_minutos,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id_usuario', u.id_usuario,
                    'nome',       u.nome,
                    'email',      u.email,
                    'slack_id',   u.slack_id,
                    'receber',    un.receber
                )
            ) AS destinatarios
        FROM configuracao_notificacao cn
        LEFT JOIN usuario_notificacao un
            ON un.fk_configuracao_notificacao = cn.id_configuracao_notificacao
        LEFT JOIN usuario u
            ON u.id_usuario = un.fk_usuario
        WHERE cn.tipo IN (?, ?)
        GROUP BY cn.id_configuracao_notificacao
        ORDER BY cn.id_configuracao_notificacao;
    `;

    return database.executar(instrucaoSql, ['ETL_SUCESSO', 'ETL_ERRO']);
}

// ============================================================
// GET — listarEmpresas
// ============================================================

function listarEmpresas() {
    const instrucaoSql = `
        SELECT *
        FROM vw_empresas
        ORDER BY nome ASC;
    `;

    return database.executar(instrucaoSql);
}

// ============================================================
// GET — listarEmpresasProcuradas
// ============================================================

function listarEmpresasProcuradas(nomeEmpresa) {
    const instrucaoSql = `
        SELECT *
        FROM vw_empresas
        WHERE nome LIKE ?
        ORDER BY nome ASC;
    `;

    return database.executar(instrucaoSql, [`%${nomeEmpresa}%`]);
}

// ============================================================
// GET — buscarEmpresaPorId
// ============================================================

function buscarEmpresaPorId(idEmpresa) {
    const instrucaoSql = `
        SELECT
            id_empresa,
            nome,
            cnpj,
            email,
            telefone,
            fk_status AS nivel
        FROM empresa
        WHERE id_empresa = ?;
    `;

    return database.executar(instrucaoSql, [idEmpresa]);
}

// ============================================================
// GET — buscarEmpresaPorCnpj
// ============================================================

function buscarEmpresaPorCnpj(cnpj) {
    const instrucaoSql = `
        SELECT id_empresa
        FROM empresa
        WHERE cnpj = ?;
    `;

    return database.executar(instrucaoSql, [cnpj]);
}

// ============================================================
// PUT — atualizarDestinatario
// ============================================================

function atualizarDestinatario(idUsuario, idConfiguracao, receber) {
    const instrucaoSql = `
        UPDATE usuario_notificacao
        SET receber = ?
        WHERE fk_usuario = ?
          AND fk_configuracao_notificacao = ?;
    `;

    return database.executar(instrucaoSql, [receber, idUsuario, idConfiguracao]);
}

// ============================================================
// PUT — atualizarConfiguracao
// ============================================================

function atualizarConfiguracao(id, ativo, intervalo) {
    const instrucaoSql = `
        UPDATE configuracao_notificacao
        SET ativo              = ?,
            intervalo_minutos  = ?
        WHERE id_configuracao_notificacao = ?;
    `;

    return database.executar(instrucaoSql, [ativo, intervalo, id]);
}

// ============================================================
// PUT — atualizarEmpresa  (inclui campo nivel vindo do JS)
// ============================================================

function atualizarEmpresa(idEmpresa, nome, cnpj, email, telefone, nivel) {
    const instrucaoSql = `
        UPDATE empresa
        SET nome      = ?,
            cnpj      = ?,
            email     = ?,
            telefone  = ?,
            fk_status = ?
        WHERE id_empresa = ?;
    `;

    return database.executar(instrucaoSql, [nome, cnpj, email, telefone, nivel, idEmpresa]);
}

// ============================================================
// PUT — editarStatusEmpresa
// ============================================================

function editarStatusEmpresa(idEmpresa) {
    const instrucaoSql = `
        UPDATE empresa
        SET fk_status = ?
        WHERE id_empresa = ?;
    `;

    return database.executar(instrucaoSql, [5, idEmpresa]);
}

module.exports = {
    criarEmpresa,
    criarEndereco,
    criarUsuario,
    criarFiltrosPadrao,
    aprovarSolicitacao,
    cancelarSolicitacao,
    listarSolicitacoes,
    buscarSolicitacaoPorId,
    buscarLogs,
    listarConfiguracoesNotificacao,
    listarEmpresas,
    listarEmpresasProcuradas,
    buscarEmpresaPorId,
    buscarEmpresaPorCnpj,
    atualizarDestinatario,
    atualizarConfiguracao,
    atualizarEmpresa,
    editarStatusEmpresa
};
