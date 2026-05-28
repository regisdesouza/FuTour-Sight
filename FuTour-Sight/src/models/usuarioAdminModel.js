const database = require("../database/config.js");

// ============================================================
// POST — cadastrarFuncionario
// ============================================================

function cadastrarFuncionario(nome, email, senha, permissao, idEmpresa) {
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
        permissao,
        idEmpresa,
        4
    ]);
}

// ============================================================
// GET — listarUsuarios
// ============================================================

function listarUsuarios(idEmpresa) {
    const instrucaoSql = `
        SELECT *
        FROM vw_usuarios
        WHERE status    != ?
          AND id_empresa = ?
        ORDER BY nome ASC;
    `;

    return database.executar(instrucaoSql, ['PENDENTE', idEmpresa]);
}

// ============================================================
// GET — listarUsuariosProcurados
// ============================================================

function listarUsuariosProcurados(idEmpresa, nomeFuncionario) {
    const instrucaoSql = `
        SELECT *
        FROM vw_usuarios
        WHERE status    != ?
          AND id_empresa = ?
          AND nome LIKE ?
        ORDER BY nome ASC;
    `;

    return database.executar(instrucaoSql, [
        'PENDENTE',
        idEmpresa,
        `%${nomeFuncionario}%`
    ]);
}

// ============================================================
// GET — buscarFuncionario
// ============================================================

function buscarFuncionario(idUsuario) {
    const instrucaoSql = `
        SELECT
            id_usuario,
            nome,
            email,
            fk_nivel_permissao
        FROM usuario
        WHERE id_usuario = ?;
    `;

    return database.executar(instrucaoSql, [idUsuario]);
}

// ============================================================
// GET — buscarEmpresa
// ============================================================

function buscarEmpresa(idEmpresa) {
    const instrucaoSql = `
        SELECT
            e.nome          AS empresa,
            e.cnpj,
            e.email         AS emailCorporativo,
            e.telefone      AS telefoneCorporativo,
            end.cep,
            end.estado,
            end.cidade,
            end.bairro,
            end.logradouro,
            end.numero,
            end.complemento
        FROM empresa e
        INNER JOIN endereco end
            ON end.fk_empresa = e.id_empresa
        WHERE e.id_empresa = ?;
    `;

    return database.executar(instrucaoSql, [idEmpresa]);
}

// ============================================================
// PUT — editarFuncionario
// ============================================================

function editarFuncionario(idUsuario, nome, email, permissao) {
    const instrucaoSql = `
        UPDATE usuario
        SET
            nome               = ?,
            email              = ?,
            fk_nivel_permissao = ?
        WHERE id_usuario = ?;
    `;

    return database.executar(instrucaoSql, [nome, email, permissao, idUsuario]);
}

// ============================================================
// PUT — editarEmpresa
// ============================================================

function editarEmpresa(
    idEmpresa,
    empresa,
    cnpj,
    emailCorporativo,
    telefoneCorporativo,
    cep,
    estado,
    cidade,
    bairro,
    logradouro,
    numero,
    complemento
) {
    const instrucaoSqlEmpresa = `
        UPDATE empresa
        SET
            nome     = ?,
            cnpj     = ?,
            email    = ?,
            telefone = ?
        WHERE id_empresa = ?;
    `;

    const instrucaoSqlEndereco = `
        UPDATE endereco
        SET
            cep         = ?,
            estado      = ?,
            cidade      = ?,
            bairro      = ?,
            logradouro  = ?,
            numero      = ?,
            complemento = ?
        WHERE fk_empresa = ?;
    `;

    const instrucaoSqlPrimeiroAcesso = `
        UPDATE usuario
        SET primeiro_acesso = ?
        WHERE fk_empresa = ?;
    `;

    return database.executar(instrucaoSqlEmpresa, [
        empresa,
        cnpj,
        emailCorporativo,
        telefoneCorporativo,
        idEmpresa
    ])
    .then(() => database.executar(instrucaoSqlEndereco, [
        cep,
        estado,
        cidade,
        bairro,
        logradouro,
        numero,
        complemento,
        idEmpresa
    ]))
    .then(() => database.executar(instrucaoSqlPrimeiroAcesso, [0, idEmpresa]));
}

// ============================================================
// PUT — editarStatusUsuario
// ============================================================

function editarStatusUsuario(idUsuario, status) {
    const instrucaoSql = `
        UPDATE usuario
        SET fk_status = ?
        WHERE id_usuario = ?;
    `;

    return database.executar(instrucaoSql, [status, idUsuario]);
}

module.exports = {
    cadastrarFuncionario,
    listarUsuarios,
    listarUsuariosProcurados,
    buscarFuncionario,
    buscarEmpresa,
    editarFuncionario,
    editarEmpresa,
    editarStatusUsuario
};
