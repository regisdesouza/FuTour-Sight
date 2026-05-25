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
            vu.id_usuario,
            vu.nome,
            vu.email,
            vu.nivel_permissao,
            vu.id_empresa AS empresa,
            vu.primeiro_acesso,
            vu.status     AS status_usuario,
            e.nome        AS nome_empresa,
            s.nome        AS status_empresa
        FROM vw_usuarios vu
        INNER JOIN usuario u ON u.id_usuario = vu.id_usuario
        LEFT JOIN empresa e  ON e.id_empresa = vu.id_empresa
        LEFT JOIN status  s  ON s.id_status  = e.fk_status
        WHERE vu.email = ?
          AND u.senha  = ?;
    `;

    return database.executar(instrucaoSql, [email, senha]);
}

function criarFiltro(
    nome,
    estado,
    continente,
    anoInicio,
    anoFim,
    fkUsuario
) {
    const instrucaoSql = `
        INSERT INTO filtro_personalizado (
            nome,
            estado,
            continente,
            ano_inicio,
            ano_fim,
            fk_usuario
        )
        VALUES (?, ?, ?, ?, ?, ?);
    `;

    return database.executar(instrucaoSql, [
        nome,
        estado,
        continente,
        anoInicio,
        anoFim,
        fkUsuario
    ]);
}

function listarFiltros(idUsuario) {
    const instrucaoSql = `
        SELECT 
            id_filtro,
            nome, 
            estado, 
            continente, 
            ano_inicio, 
            ano_fim 
        FROM 
            filtro_personalizado 
        WHERE fk_usuario = ?
    `;

    return database.executar(instrucaoSql, [idUsuario]);
}

function buscarFiltro(idFiltro) {
    const instrucaoSql = `
        SELECT 
            nome, 
            estado, 
            continente, 
            ano_inicio, 
            ano_fim 
        FROM 
            filtro_personalizado 
        WHERE id_filtro = ?
    `;

    return database.executar(instrucaoSql, [idFiltro]);
}

function listarEstados() {
    return database.executar(`SELECT DISTINCT uf FROM chegadas_turistas ORDER BY uf;`);
}

function listarContinentes() {
    const instrucaoSql = `
        SELECT DISTINCT(continente) FROM vw_continente_turistas ORDER BY continente;
    `;

    return database.executar(instrucaoSql);
}

function listarAnos() {
    return database.executar(`SELECT DISTINCT ano FROM chegadas_turistas ORDER BY ano DESC;`);
}

function atualizarFiltro(
    nomeFiltro,
    estado,
    continente,
    ano_inicio,
    ano_fim,
    idFiltro
) {
    const instrucaoSql = `
        UPDATE filtro_personalizado
        SET
            nome = ?,
            estado = ?,
            continente = ?,
            ano_inicio = ?,
            ano_fim = ?
        WHERE id_filtro = ?;
    `;

    return database.executar(instrucaoSql, [
        nomeFiltro,
        estado,
        continente,
        ano_inicio,
        ano_fim,
        idFiltro
    ]);
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
    listarContinentes,
    listarAnos,
    atualizarFiltro,
    editarPerfil,
    excluirFiltro
};