var database = require("../database/config.js")

function cadastrarFuncionario(
    nomeCadastroFuncionario,
    emailPessoalCadastroFuncionario,
    senhaCadastroFuncionario,
    permissaoCadastroFuncionario,
    idEmpresaCadastroFuncionario
) {
    var instrucaoSql = `
        INSERT INTO usuario 
        (nome, email, senha, fk_nivel_permissao, fk_empresa, fk_status) 
        VALUES (?, ?, ?, ?, ?, 1);
    `;

    return database.executar(instrucaoSql, [
        nomeCadastroFuncionario,
        emailPessoalCadastroFuncionario,
        senhaCadastroFuncionario,
        permissaoCadastroFuncionario,
        idEmpresaCadastroFuncionario
    ]);
}

function editarEmpresa(
    idEmpresaEditarEmpresa,
    empresaEditarEmpresa,
    cnpjEditarEmpresa,
    emailCorporativoEditarEmpresa,
    telefoneCorporativoEditarEmpresa,
    cepEditarEmpresa,
    estadoEditarEmpresa,
    cidadeEditarEmpresa,
    bairroEditarEmpresa,
    logradouroEditarEmpresa,
    numeroEditarEmpresa,
    complementoEditarEmpresa
) {

    var instrucaoSqlUpdateEmpresa = `
        UPDATE empresa 
        SET nome = ?, cnpj = ?, email = ?, telefone = ? 
        WHERE id_empresa = ?;
    `;

    var instrucaoSqlUpdateEndereco = `
        UPDATE endereco 
        SET cidade = ?, estado = ?, cep = ?, logradouro = ?, numero = ?, bairro = ?, complemento = ? 
        WHERE fk_empresa = ?;
    `;

    var instrucaoSqlUpdatePrimeiroAcesso = `
        UPDATE usuario
        SET primeiro_acesso = 0
        WHERE fk_empresa = ?;
    `;

    return database.executar(instrucaoSqlUpdateEmpresa, [
        empresaEditarEmpresa,
        cnpjEditarEmpresa,
        emailCorporativoEditarEmpresa,
        telefoneCorporativoEditarEmpresa,
        idEmpresaEditarEmpresa
    ]).then(() => {
        return database.executar(instrucaoSqlUpdateEndereco, [
            cidadeEditarEmpresa,
            estadoEditarEmpresa,
            cepEditarEmpresa,
            logradouroEditarEmpresa,
            numeroEditarEmpresa,
            bairroEditarEmpresa,
            complementoEditarEmpresa,
            idEmpresaEditarEmpresa
        ]);
    }).then(() => {
        return database.executar(instrucaoSqlUpdatePrimeiroAcesso, [
            idEmpresaEditarEmpresa
        ]);
    });

}

function listarUsuarios(idEmpresa) {
    var instrucaoSql = `
        SELECT * FROM vw_usuarios
        WHERE status != 'PENDENTE'
        AND id_empresa = ?
        ORDER BY nome ASC;`;

    return database.executar(instrucaoSql, [idEmpresa]);
}

function listarUsuariosProcurados(idEmpresa, nomeFuncionariolistarUsuariosProcurados) {
    var instrucaoSql = `
        SELECT * FROM vw_usuarios
        WHERE status != 'PENDENTE'
        AND id_empresa = ?
        AND nome LIKE ?
        ORDER BY nome ASC;
    `;

    console.log("Executando SQL:", instrucaoSql);

    return database.executar(instrucaoSql, [
        idEmpresa,
        `%${nomeFuncionariolistarUsuariosProcurados}%`
    ]);
}

function editarStatusUsuario(idEditarStatusUsuario, statusEditarStatusUsuario) {
    var instrucaoSql = `
        UPDATE usuario
        SET fk_status = ?
        WHERE id_usuario = ?;`;

    return database.executar(instrucaoSql, [5, idEditarStatusUsuario]);
}

function buscarEmpresa(idEmpresaBuscarEmpresa) {
    var instrucaoSql = `
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
        INNER JOIN endereco end ON end.fk_empresa = e.id_empresa
        WHERE e.id_empresa = ?;
    `;

    return database.executar(instrucaoSql, [idEmpresaBuscarEmpresa]);
}

function buscarFuncionario(idUsuario) {
    var instrucaoSql = `
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

function editarFuncionario(idUsuario, nome, email, permissao) {
    var instrucaoSql = `
        UPDATE usuario
        SET nome = ?, email = ?, fk_nivel_permissao = ?
        WHERE id_usuario = ?;
    `;

    return database.executar(instrucaoSql, [nome, email, permissao, idUsuario]);
}

module.exports = {
    cadastrarFuncionario,
    editarEmpresa,
    listarUsuarios,
    listarUsuariosProcurados,
    editarStatusUsuario,
    buscarEmpresa,
    buscarFuncionario,
    editarFuncionario
};