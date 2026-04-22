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

    console.log("Executando SQL:", instrucaoSql);

    return database.executar(instrucaoSql, [
        `%${nomeEmpresalistarEmpresasProcuradas}%`
    ]);
}

module.exports = {
    buscarLogs,
    listarEmpresas,
    listarEmpresasProcuradas
};