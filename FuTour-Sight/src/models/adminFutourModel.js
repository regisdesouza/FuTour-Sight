var database = require("../database/config.js")

function buscarLogs() {
    var instrucaoSql = `
        SELECT
        id_log,
        tabela,
        registros_lidos,
        sucesso,
        mensagem,
        data_criacao
        FROM log
        ORDER BY data_criacao DESC;`;

    return database.executar(instrucaoSql);
}

function listarEmpresas() {
    var instrucaoSql = `
        SELECT * FROM vw_empresas
        ORDER BY nome ASC;`;

    return database.executar(instrucaoSql);
}

function listarEmpresasProcuradas(nomeEmpresalistarEmpresasProcuradas) {
    var instrucaoSql = `
        SELECT * FROM vw_empresas
        WHERE nome LIKE ?
        ORDER BY nome ASC;
    `;

    return database.executar(instrucaoSql, [
        `%${nomeEmpresalistarEmpresasProcuradas}%`
    ]);
}

function editarStatusEmpresa(idEditarStatusEmpresa) {
    var instrucaoSql = `
        UPDATE empresa
        SET fk_status = 5
        WHERE id_empresa = ?;`;

    return database.executar(instrucaoSql, [idEditarStatusEmpresa]);
}

function listarSolicitacoes() {
    var sql = `
        SELECT * FROM solicitacao_cadastro 
        WHERE fk_status = ?`;
        
    return database.executar(sql, [9]);
}

function buscarPorId(id) {
    var sql = `
        SELECT * FROM solicitacao_cadastro 
        WHERE id_solicitacao = ?`;

    return database.executar(sql, [id]);
}

function buscarEmpresaPorCnpj(cnpj) {
    var sql = `
        SELECT id_empresa 
        FROM empresa 
        WHERE cnpj = ?`;

    return database.executar(sql, [cnpj]);
}

function cancelarSolicitacao(id) {
    var sql = `
        UPDATE solicitacao_cadastro 
        SET fk_status = ? 
        WHERE id_solicitacao = ?`;

    return database.executar(sql, [2, id]);
}

function aprovarSolicitacao(id) {
    var sql = `
        UPDATE solicitacao_cadastro 
        SET fk_status = ? 
        WHERE id_solicitacao = ?`;

    return database.executar(sql, [1, id]);
}

function criarEmpresa(nome, cnpj, email, telefone) {
    var sql = `
        INSERT INTO empresa (nome, cnpj, email, telefone)
        VALUES (?, ?, ?, ?)`;

    return database.executar(sql, [
        nome,
        cnpj,
        email,
        telefone
    ]);
}

function criarUsuario(nome, email, idEmpresa) {
    var sql = `
        INSERT INTO usuario 
        (nome, email, fk_empresa, fk_nivel_permissao)
        VALUES (?, ?, ?, ?)`;

    return database.executar(sql, [
        nome,
        email,
        idEmpresa,
        1
    ]);
}

module.exports = {
    buscarLogs,
    listarEmpresas,
    listarEmpresasProcuradas,
    buscarEmpresaPorCnpj,
    editarStatusEmpresa,
    listarSolicitacoes,
    buscarPorId,
    cancelarSolicitacao,
    aprovarSolicitacao,
    criarEmpresa,
    criarUsuario
};