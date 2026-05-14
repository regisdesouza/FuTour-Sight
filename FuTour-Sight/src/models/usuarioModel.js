const database = require("../database/config.js");

function enviarMensagem(nome, email, telefone, mensagem) {
    const instrucaoSql = `
        INSERT INTO contato (
            nome,
            email,
            telefone,
            mensagem
        )
        VALUES (?, ?, ?, ?);
    `;

    return database.executar(instrucaoSql, [
        nome,
        email,
        telefone,
        mensagem
    ]);
}

function buscarPorCnpj(cnpj) {
    const instrucaoSql = `
        SELECT id_solicitacao
        FROM solicitacao_cadastro
        WHERE cnpj_empresa = ?;
    `;

    return database.executar(instrucaoSql, [cnpj]);
}

function preCadastrar(
    nome,
    emailPessoal,
    empresa,
    emailCorporativo,
    cnpj,
    telefoneCorporativo
) {
    const instrucaoSql = `
        INSERT INTO solicitacao_cadastro (
            nome_responsavel,
            email_responsavel,
            nome_empresa,
            cnpj_empresa,
            email_empresa,
            telefone_empresa
        )
        VALUES (?, ?, ?, ?, ?, ?);
    `;

    return database.executar(instrucaoSql, [
        nome,
        emailPessoal,
        empresa,
        cnpj,
        emailCorporativo,
        telefoneCorporativo
    ]);
}

function autenticar(email, senha) {
    const instrucaoSql = `
        SELECT
            id_usuario,
            nome,
            email,
            fk_nivel_permissao AS nivel_permissao,
            fk_empresa AS empresa,
            primeiro_acesso
        FROM usuario
        WHERE email = ?
        AND senha = ?;
    `;

    return database.executar(instrucaoSql, [
        email,
        senha
    ]);
}

function criarFiltro(
    nome,
    mesInicio,
    mesFim,
    ano,
    fkUsuario
) {
    const instrucaoSql = `
        INSERT INTO filtro_personalizado (
            nome,
            mes_inicio,
            mes_fim,
            ano_referencia,
            fk_usuario
        )
        VALUES (?, ?, ?, ?, ?);
    `;

    return database.executar(instrucaoSql, [
        nome,
        mesInicio,
        mesFim,
        ano,
        fkUsuario
    ]);
}

function listarFiltros(idUsuario) {
    const instrucaoSql = `
        SELECT
            fp.id_filtro,
            fp.nome,
            fp.mes_inicio,
            fp.mes_fim,
            fp.ano_referencia,
            GROUP_CONCAT(
                CASE
                    WHEN fi.tipo = 'ESTADO'
                    THEN fi.valor
                END
            ) AS estados,
            GROUP_CONCAT(
                CASE
                    WHEN fi.tipo = 'PAIS'
                    THEN fi.valor
                END
            ) AS paises
        FROM filtro_personalizado fp
        LEFT JOIN filtro_item fi
            ON fi.fk_filtro = fp.id_filtro
        WHERE fp.fk_usuario = ?
        GROUP BY fp.id_filtro;
    `;

    return database.executar(instrucaoSql, [idUsuario]);
}

function buscarFiltro(idFiltro) {
    const instrucaoSql = `
        SELECT
            fp.id_filtro,
            fp.nome,
            fp.mes_inicio,
            fp.mes_fim,
            fp.ano_referencia,
            GROUP_CONCAT(
                CASE
                    WHEN fi.tipo = 'ESTADO'
                    THEN fi.valor
                END
            ) AS estados,
            GROUP_CONCAT(
                CASE
                    WHEN fi.tipo = 'PAIS'
                    THEN fi.valor
                END
            ) AS paises
        FROM filtro_personalizado fp
        LEFT JOIN filtro_item fi
            ON fi.fk_filtro = fp.id_filtro
        WHERE fp.id_filtro = ?
        GROUP BY fp.id_filtro;
    `;

    return database.executar(instrucaoSql, [idFiltro]);
}

function listarEstados() {
    const instrucaoSql = `
        SELECT DISTINCT uf
        FROM chegadas_turistas
        ORDER BY uf;
    `;

    return database.executar(instrucaoSql);
}

function listarPaises() {
    const instrucaoSql = `
        SELECT DISTINCT nome_pais_origem
        FROM chegadas_turistas
        ORDER BY nome_pais_origem;
    `;

    return database.executar(instrucaoSql);
}

function listarAnos() {
    const instrucaoSql = `
        SELECT DISTINCT ano
        FROM chegadas_turistas
        ORDER BY ano DESC;
    `;

    return database.executar(instrucaoSql);
}

function atualizarFiltro(
    nome,
    mesInicio,
    mesFim,
    ano,
    idFiltro
) {
    const instrucaoSql = `
        UPDATE filtro_personalizado
        SET
            nome = ?,
            mes_inicio = ?,
            mes_fim = ?,
            ano_referencia = ?
        WHERE id_filtro = ?;
    `;

    return database.executar(instrucaoSql, [
        nome,
        mesInicio,
        mesFim,
        ano,
        idFiltro
    ]);
}

function editarPerfil(idUsuario, nome, email, senha) {
    const instrucaoSql = `
        UPDATE usuario
        SET
            nome = ?,
            email = ?,
            senha = ?
        WHERE id_usuario = ?;
    `;

    return database.executar(instrucaoSql, [
        nome,
        email,
        senha,
        idUsuario
    ]);
}

function deletarFiltrosItens(idFiltro) {
    const instrucaoSql = `
        DELETE FROM filtro_item
        WHERE fk_filtro = ?;
    `;

    return database.executar(instrucaoSql, [idFiltro]);
}

function excluirFiltro(idFiltro) {
    const instrucaoSql = `
        DELETE FROM filtro_personalizado
        WHERE id_filtro = ?;
    `;

    return database.executar(instrucaoSql, [idFiltro]);
}

function criarFiltroItem(fkFiltro, tipo, valor) {
    const instrucaoSql = `
        INSERT INTO filtro_item (
            fk_filtro,
            tipo,
            valor
        )
        VALUES (?, ?, ?);
    `;

    return database.executar(instrucaoSql, [
        fkFiltro,
        tipo,
        valor
    ]);
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
    deletarFiltrosItens,
    excluirFiltro,
    criarFiltroItem
};