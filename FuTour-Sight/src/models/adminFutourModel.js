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
    criarEndereco
};