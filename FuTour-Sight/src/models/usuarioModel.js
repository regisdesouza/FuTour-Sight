const database = require("../database/config.js");

function enviarMensagem(nome, email, telefone, mensagem) {
    return database.executar(`
        INSERT INTO contato (nome, email, telefone, mensagem)
        VALUES (?, ?, ?, ?);
    `, [nome, email, telefone, mensagem]);
}

function buscarPorCnpj(cnpj) {
    return database.executar(`
        SELECT id_solicitacao FROM solicitacao_cadastro WHERE cnpj_empresa = ?;
    `, [cnpj]);
}

function preCadastrar(nome, emailPessoal, empresa, emailCorporativo, cnpj, telefoneCorporativo) {
    return database.executar(`
        INSERT INTO solicitacao_cadastro (
            nome_responsavel, email_responsavel, nome_empresa,
            cnpj_empresa, email_empresa, telefone_empresa
        ) VALUES (?, ?, ?, ?, ?, ?);
    `, [nome, emailPessoal, empresa, cnpj, emailCorporativo, telefoneCorporativo]);
}

function autenticar(email, senha) {
    return database.executar(`
        SELECT
            id_usuario,
            nome,
            email,
            fk_nivel_permissao AS nivel_permissao,
            fk_empresa AS empresa,
            primeiro_acesso
        FROM usuario
        WHERE email = ? AND senha = ?;
    `, [email, senha]);
}

function criarFiltro(nome, anoInicio, anoFim, mesInicio, mesFim, uf, continente, fkUsuario) {
    return database.executar(`
        INSERT INTO filtro_personalizado (
            nome, ano_inicio, ano_fim, mes_inicio, mes_fim, uf, continente, fk_usuario
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `, [nome, anoInicio, anoFim, mesInicio, mesFim, uf, continente, fkUsuario]);
}

function listarFiltros(idUsuario) {
    return database.executar(`
        SELECT id_filtro, nome, ano_inicio, ano_fim, mes_inicio, mes_fim, uf, continente
        FROM filtro_personalizado
        WHERE fk_usuario = ?;
    `, [idUsuario]);
}

function buscarFiltro(idFiltro) {
    return database.executar(`
        SELECT id_filtro, nome, ano_inicio, ano_fim, mes_inicio, mes_fim, uf, continente
        FROM filtro_personalizado
        WHERE id_filtro = ?;
    `, [idFiltro]);
}

function listarEstados() {
    return database.executar(`SELECT DISTINCT uf FROM chegadas_turistas ORDER BY uf;`);
}

function listarPaises() {
    return database.executar(`SELECT DISTINCT nome_pais_origem FROM chegadas_turistas ORDER BY nome_pais_origem;`);
}

function listarAnos() {
    return database.executar(`SELECT DISTINCT ano FROM chegadas_turistas ORDER BY ano DESC;`);
}

function atualizarFiltro(nome, anoInicio, anoFim, mesInicio, mesFim, uf, continente, idFiltro) {
    return database.executar(`
        UPDATE filtro_personalizado
        SET nome = ?, ano_inicio = ?, ano_fim = ?, mes_inicio = ?, mes_fim = ?, uf = ?, continente = ?
        WHERE id_filtro = ?;
    `, [nome, anoInicio, anoFim, mesInicio, mesFim, uf, continente, idFiltro]);
}

function editarPerfil(idUsuario, nome, email, senha) {
    return database.executar(`
        UPDATE usuario SET nome = ?, email = ?, senha = ? WHERE id_usuario = ?;
    `, [nome, email, senha, idUsuario]);
}

function excluirFiltro(idFiltro) {
    return database.executar(`
        DELETE FROM filtro_personalizado WHERE id_filtro = ?;
    `, [idFiltro]);
}

module.exports = {
    enviarMensagem,
    buscarPorCnpj,
    preCadastrar,
    autenticar,
    criarFiltro,
    listarFiltros,
    buscarFiltro,
    listarEstados,
    listarPaises,
    listarAnos,
    atualizarFiltro,
    editarPerfil,
    excluirFiltro
};