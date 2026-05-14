const database = require("../database/config.js");

function cadastrarFuncionario(
    nome,
    email,
    senha,
    permissao,
    idEmpresa
) {
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
        1
    ]);
}

function listarUsuarios(idEmpresa) {
    const instrucaoSql = `
        SELECT *
        FROM vw_usuarios
        WHERE status != 'PENDENTE'
        AND id_empresa = ?
        ORDER BY nome ASC;
    `;

    return database.executar(instrucaoSql, [idEmpresa]);
}

function listarUsuariosProcurados(idEmpresa, nomeFuncionario) {
    const instrucaoSql = `
        SELECT *
        FROM vw_usuarios
        WHERE status != 'PENDENTE'
        AND id_empresa = ?
        AND nome LIKE ?
        ORDER BY nome ASC;
    `;

    return database.executar(instrucaoSql, [
        idEmpresa,
        `%${nomeFuncionario}%`
    ]);
}

function buscarEmpresa(idEmpresa) {
    const instrucaoSql = `
        SELECT
            e.nome AS empresa,
            e.cnpj,
            e.email AS emailCorporativo,
            e.telefone AS telefoneCorporativo,
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

function editarFuncionario(
    idUsuario,
    nome,
    email,
    permissao
) {
    const instrucaoSql = `
        UPDATE usuario
        SET
            nome = ?,
            email = ?,
            fk_nivel_permissao = ?
        WHERE id_usuario = ?;
    `;

    return database.executar(instrucaoSql, [
        nome,
        email,
        permissao,
        idUsuario
    ]);
}

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
            nome = ?,
            cnpj = ?,
            email = ?,
            telefone = ?
        WHERE id_empresa = ?;
    `;

    const instrucaoSqlEndereco = `
        UPDATE endereco
        SET
            cidade = ?,
            estado = ?,
            cep = ?,
            logradouro = ?,
            numero = ?,
            bairro = ?,
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
    .then(() => {
        return database.executar(instrucaoSqlEndereco, [
            cidade,
            estado,
            cep,
            logradouro,
            numero,
            bairro,
            complemento,
            idEmpresa
        ]);
    })
    .then(() => {
        return database.executar(
            instrucaoSqlPrimeiroAcesso,
            [0, idEmpresa]
        );
    });
}

function editarStatusUsuario(idUsuario, status) {
    const instrucaoSql = `
        UPDATE usuario
        SET fk_status = ?
        WHERE id_usuario = ?;
    `;

    return database.executar(instrucaoSql, [
        status,
        idUsuario
    ]);
}

module.exports = {
    cadastrarFuncionario,
    listarUsuarios,
    listarUsuariosProcurados,
    buscarEmpresa,
    buscarFuncionario,
    editarFuncionario,
    editarEmpresa,
    editarStatusUsuario
};