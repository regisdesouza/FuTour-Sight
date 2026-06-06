const database = require("../database/config.js");

// ============================================================
// POST — enviarMensagem
// ============================================================

function enviarMensagem(nome, email, telefone, mensagem) {
    const instrucaoSql = `
        INSERT INTO contato (nome, email, telefone, mensagem)
        VALUES (?, ?, ?, ?);
    `;

    return database.executar(instrucaoSql, [nome, email, telefone, mensagem]);
}

// ============================================================
// POST — buscarSolicitacaoExistente  (auxiliar de preCadastrar)
// ============================================================

function buscarSolicitacaoExistente(cnpj, emailCorporativo) {

    const instrucaoSql = `
        SELECT id_solicitacao
        FROM solicitacao_cadastro
        WHERE
            REPLACE(
                REPLACE(
                    REPLACE(cnpj_empresa, '.', ''),
                '/', ''),
            '-', '') = ?
        OR LOWER(TRIM(email_empresa)) = LOWER(TRIM(?));
    `;

    return database.executar(instrucaoSql, [
        cnpj,
        emailCorporativo
    ]);
}

// ============================================================
// POST — preCadastrar
// ============================================================

function preCadastrar(nome, emailPessoal, empresa, emailCorporativo, cnpj, telefoneCorporativo) {
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

// ============================================================
// POST — autenticar
// ============================================================

function autenticar(email) {
    const instrucaoSql = `
        SELECT
            vu.id_usuario,
            vu.nome,
            vu.email,
            vu.nivel_permissao,
            vu.id_empresa AS empresa,
            vu.primeiro_acesso,
            vu.status AS status_usuario,
            u.senha,
            e.nome AS nome_empresa,
            s.nome AS status_empresa
        FROM vw_usuarios vu
        INNER JOIN usuario u ON u.id_usuario = vu.id_usuario
        LEFT JOIN empresa e ON e.id_empresa = vu.id_empresa
        LEFT JOIN status s ON s.id_status = e.fk_status
        WHERE vu.email = ?;
    `;

    return database.executar(instrucaoSql, [email]);
}

// ============================================================
// POST — criarFiltro
// ============================================================

function criarFiltro(nome, estado, continente, anoInicio, anoFim, fkUsuario) {
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

// ============================================================
// GET — listarFiltros
// ============================================================

function listarFiltros(idUsuario) {
    const instrucaoSql = `
        SELECT
            id_filtro,
            nome,
            estado,
            continente,
            ano_inicio,
            ano_fim
        FROM filtro_personalizado
        WHERE fk_usuario = ?;
    `;

    return database.executar(instrucaoSql, [idUsuario]);
}

// ============================================================
// GET — buscarFiltro
// ============================================================

function buscarFiltro(idFiltro) {
    const instrucaoSql = `
        SELECT
            nome,
            estado,
            continente,
            ano_inicio,
            ano_fim
        FROM filtro_personalizado
        WHERE id_filtro = ?;
    `;

    return database.executar(instrucaoSql, [idFiltro]);
}

// ============================================================
// GET — listarEstados
// ============================================================

function listarEstados() {
    const instrucaoSql = `
        SELECT DISTINCT uf
        FROM chegadas_turistas
        ORDER BY uf;
    `;

    return database.executar(instrucaoSql);
}

// ============================================================
// GET — listarContinentes
// ============================================================

function listarContinentes() {
    const instrucaoSql = `
        SELECT DISTINCT continente
        FROM vw_continente_turistas
        ORDER BY continente;
    `;

    return database.executar(instrucaoSql);
}

// ============================================================
// GET — listarAnos
// ============================================================

function listarAnos() {
    const instrucaoSql = `
        SELECT DISTINCT ano
        FROM chegadas_turistas
        ORDER BY ano DESC;
    `;

    return database.executar(instrucaoSql);
}

// ============================================================
// PUT — atualizarFiltro
// ============================================================

function atualizarFiltro(nomeFiltro, estado, continente, ano_inicio, ano_fim, idFiltro) {
    const instrucaoSql = `
        UPDATE filtro_personalizado
        SET
            nome       = ?,
            estado     = ?,
            continente = ?,
            ano_inicio = ?,
            ano_fim    = ?
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

// ============================================================
// PUT — editarPerfil
// ============================================================

function editarPerfil(idUsuario, nome, email, senha) {
    const instrucaoSql = `
        UPDATE usuario
        SET nome  = ?,
            email = ?,
            senha = ?
        WHERE id_usuario = ?;
    `;

    return database.executar(instrucaoSql, [nome, email, senha, idUsuario]);
}

// ============================================================
// DELETE — excluirFiltro
// ============================================================

function excluirFiltro(idFiltro) {
    const instrucaoSql = `
        DELETE FROM filtro_personalizado
        WHERE id_filtro = ?;
    `;

    return database.executar(instrucaoSql, [idFiltro]);
}

module.exports = {
    enviarMensagem,
    buscarSolicitacaoExistente,
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
