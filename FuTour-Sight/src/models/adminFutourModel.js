const database = require("../database/config.js");

function aprovarSolicitacao(idSolicitacao) {
    const instrucaoSql = `
        UPDATE solicitacao_cadastro
        SET fk_status = ?
        WHERE id_solicitacao = ?;
    `;

    return database.executar(instrucaoSql, [1, idSolicitacao]);
}

function cancelarSolicitacao(idSolicitacao) {
    const instrucaoSql = `
        UPDATE solicitacao_cadastro
        SET fk_status = ?
        WHERE id_solicitacao = ?;
    `;

    return database.executar(instrucaoSql, [2, idSolicitacao]);
}

function listarSolicitacoes() {
    const instrucaoSql = `
        SELECT *
        FROM solicitacao_cadastro
        WHERE fk_status = ?;
    `;

    return database.executar(instrucaoSql, [9]);
}

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

function listarEmpresas() {
    const instrucaoSql = `
        SELECT *
        FROM vw_empresas
        ORDER BY nome ASC;
    `;

    return database.executar(instrucaoSql);
}

function listarEmpresasProcuradas(nomeEmpresa) {
    const instrucaoSql = `
        SELECT *
        FROM vw_empresas
        WHERE nome LIKE ?
        ORDER BY nome ASC;
    `;

    return database.executar(instrucaoSql, [
        `%${nomeEmpresa}%`
    ]);
}

function editarStatusEmpresa(idEmpresa) {
    const instrucaoSql = `
        UPDATE empresa
        SET fk_status = ?
        WHERE id_empresa = ?;
    `;

    return database.executar(instrucaoSql, [5, idEmpresa]);
}

function buscarSolicitacaoPorId(idSolicitacao) {
    const instrucaoSql = `
        SELECT *
        FROM solicitacao_cadastro
        WHERE id_solicitacao = ?;
    `;

    return database.executar(instrucaoSql, [idSolicitacao]);
}

function buscarEmpresaPorCnpj(cnpj) {
    const instrucaoSql = `
        SELECT id_empresa
        FROM empresa
        WHERE cnpj = ?;
    `;

    return database.executar(instrucaoSql, [cnpj]);
}

function criarEmpresa(nome, cnpj, email, telefone) {
    const instrucaoSql = `
        INSERT INTO empresa (
            nome,
            cnpj,
            email,
            telefone
        )
        VALUES (?, ?, ?, ?);
    `;

    return database.executar(instrucaoSql, [
        nome,
        cnpj,
        email,
        telefone
    ]);
}

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

    return database.executar(instrucaoSql, [
        nome,
        email,
        senha,
        2,
        idEmpresa,
        1
    ]);
}

function criarEndereco(idEmpresa) {
    const instrucaoSql = `
        INSERT INTO endereco (
            fk_empresa
        )
        VALUES (?);
    `;

    return database.executar(instrucaoSql, [idEmpresa]);
}

function listarConfiguracoesNotificacao() {
    const sql = `
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
                    'receber',    un.receber
                )
            ) AS destinatarios
        FROM configuracao_notificacao cn
        LEFT JOIN usuario_notificacao un
            ON un.fk_configuracao_notificacao = cn.id_configuracao_notificacao
        LEFT JOIN usuario u
            ON u.id_usuario = un.fk_usuario
        WHERE cn.tipo IN ('ETL_SUCESSO', 'ETL_ERRO')
        GROUP BY cn.id_configuracao_notificacao
        ORDER BY cn.id_configuracao_notificacao;
    `;
    return database.executar(sql);
}

function atualizarConfiguracao(id, ativo, intervalo) {
    const sql = `
        UPDATE configuracao_notificacao
        SET ativo = ?, intervalo_minutos = ?
        WHERE id_configuracao_notificacao = ?;
    `;
    return database.executar(sql, [ativo, intervalo, id]);
}

function atualizarDestinatario(idUsuario, idConfiguracao, receber) {
    const sql = `
        UPDATE usuario_notificacao
        SET receber = ?
        WHERE fk_usuario = ? AND fk_configuracao_notificacao = ?;
    `;
    return database.executar(sql, [receber, idUsuario, idConfiguracao]);
}

module.exports = {
    aprovarSolicitacao,
    cancelarSolicitacao,
    listarSolicitacoes,
    buscarLogs,
    listarEmpresas,
    listarEmpresasProcuradas,
    editarStatusEmpresa,
    buscarSolicitacaoPorId,
    buscarEmpresaPorCnpj,
    criarEmpresa,
    criarUsuario,
    criarEndereco, 
    listarConfiguracoesNotificacao,
    atualizarConfiguracao,
    atualizarDestinatario 
};