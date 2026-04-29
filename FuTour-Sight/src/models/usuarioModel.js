var database = require("../database/config.js")

function enviarMensagem(
    nomeMensagem,
    emailMensagem,
    telefoneMensagem,
    mensagemMensagem
) {
    console.log("function enviarMensagem():",
        nomeMensagem,
        emailMensagem,
        telefoneMensagem,
        mensagemMensagem
    );

    var instrucaoSql = `
        INSERT INTO contato (nome, email, telefone, mensagem) 
        VALUES (?, ?, ?, ?);
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [
        nomeMensagem,
        emailMensagem,
        telefoneMensagem,
        mensagemMensagem
    ]);
}

function buscarPorCnpj(cnpj) {
    var instrucaoSql = `
        SELECT id_solicitacao 
        FROM solicitacao_cadastro 
        WHERE cnpj_empresa = ?;
    `;

    return database.executar(instrucaoSql, [cnpj]);
}

function preCadastrar(
    nomePreCadastro,
    emailPessoalPreCadastro,
    empresaPreCadastro,
    emailCorporativoPreCadastro,
    cnpjPreCadastro,
    telefoneCorporativoPreCadastro
) {
    console.log("function preCadastrar():",
        nomePreCadastro,
        emailPessoalPreCadastro,
        empresaPreCadastro,
        emailCorporativoPreCadastro,
        cnpjPreCadastro,
        telefoneCorporativoPreCadastro
    );

    var instrucaoSql = `
        INSERT INTO solicitacao_cadastro 
        (nome_responsavel, email_responsavel, nome_empresa, cnpj_empresa, email_empresa, telefone_empresa) 
        VALUES (?, ?, ?, ?, ?, ?);
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [
        nomePreCadastro,
        emailPessoalPreCadastro,
        empresaPreCadastro,
        cnpjPreCadastro,
        emailCorporativoPreCadastro,
        telefoneCorporativoPreCadastro
    ]);
}

function autenticar(
    emailLogin,
    senhaLogin
) {
    console.log("function autenticar(): ",
        emailLogin,
        senhaLogin
    )

    var instrucaoSql = `
        SELECT id_usuario, nome, email, fk_nivel_permissao as nivel_permissao, fk_empresa as empresa, primeiro_acesso 
        FROM usuario 
        WHERE email = ? AND senha = ?;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [
        emailLogin,
        senhaLogin
    ]);
}

function criarFiltro(
    nomeFiltro,
    mes_inicio,
    mes_fim,
    ano,
    fkUsuario
) {
    var instrucaoSql = `
        INSERT INTO filtro_personalizado (nome, mes_inicio, mes_fim, ano_referencia, fk_usuario) VALUES
        (?, ?, ?, ?, ?);
    `;

    return database.executar(instrucaoSql, [
        nomeFiltro,
        mes_inicio,
        mes_fim,
        ano,
        fkUsuario
    ])
}

function criarFiltroItem(
    fkFiltro,
    tipo,
    valor
) {
    var instrucaoSql = `
        INSERT INTO filtro_item (fk_filtro, tipo, valor) VALUES
        (?, ?, ?);
    `;

    return database.executar(instrucaoSql, [
        fkFiltro,
        tipo,
        valor
    ])
}

function listarFiltros(idUsuario) {
    var instrucaoSql = `
        SELECT
            fp.id_filtro,
            fp.nome,
            fp.mes_inicio,
            fp.mes_fim,
            fp.ano_referencia,
            GROUP_CONCAT(CASE WHEN fi.tipo = 'ESTADO' THEN fi.valor END) AS estados,
            GROUP_CONCAT(CASE WHEN fi.tipo = 'PAIS' THEN fi.valor END) AS paises
        FROM filtro_personalizado fp
        LEFT JOIN filtro_item fi ON fi.fk_filtro = fp.id_filtro
        WHERE fp.fk_usuario = ?
        GROUP BY fp.id_filtro;
    `

    return database.executar(instrucaoSql, [
        idUsuario
    ])
}

function atualizarFiltro(
    nomeFiltro,
    mes_inicio,
    mes_fim,
    ano,
    idFiltro
) {
    var instrucaoSql = `
        UPDATE filtro_personalizado 
        SET nome = ?, 
        mes_inicio = ?, 
        mes_fim = ?, 
        ano_referencia = ? 
        WHERE id_filtro = ?;
    `;

    return database.executar(instrucaoSql, [
        nomeFiltro,
        mes_inicio,
        mes_fim,
        ano,
        idFiltro
    ])
}

function deletarFiltrosItens (idFiltro) {
    var instrucaoSql = `
        DELETE FROM filtro_item 
        WHERE fk_filtro = ?;
    `;

    return database.executar(instrucaoSql, [
        idFiltro
    ])
}

function excluirFiltro(idFiltro) {
    var instrucaoSql = `
        DELETE FROM filtro_personalizado 
        WHERE id_filtro = ?;
    `;

    return database.executar(instrucaoSql, [
        idFiltro
    ])
}

function editarPerfil(
    idUsuarioEditarPerfil,
    nomeEditarPerfil,
    emailEditarPerfil,
    senhaEditarPerfil
) {
    var instrucaoSql = `
        UPDATE usuario 
        SET nome = ?, email = ?, senha = ? 
        WHERE id_usuario = ?;
    `;

    return database.executar(instrucaoSql, [
        nomeEditarPerfil,
        emailEditarPerfil,
        senhaEditarPerfil,
        idUsuarioEditarPerfil
    ])
}

module.exports = {
    enviarMensagem,
    buscarPorCnpj,
    preCadastrar,
    autenticar,
    criarFiltro,
    criarFiltroItem,
    listarFiltros,
    atualizarFiltro,
    deletarFiltrosItens,
    editarPerfil,
    excluirFiltro
};