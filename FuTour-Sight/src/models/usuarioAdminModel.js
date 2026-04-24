var database = require("../database/config.js")

function cadastrarFuncionario(
    nomeCadastroFuncionario,
    emailPessoalCadastroFuncionario,
    senhaCadastroFuncionario,
    unidadeCadastroFuncionario,
    permissaoCadastroFuncionario
) {
    console.log("function cadastrarFuncionario():",
        nomeCadastroFuncionario,
        emailPessoalCadastroFuncionario,
        senhaCadastroFuncionario,
        unidadeCadastroFuncionario,
        permissaoCadastroFuncionario
    );

    var instrucaoSql = `
        INSERT INTO usuario 
        (nome, email, senha, fk_nivel_permissao, fk_empresa) 
        VALUES (?, ?, ?, ?, ?);
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [
        nomeCadastroFuncionario,
        emailPessoalCadastroFuncionario,
        senhaCadastroFuncionario,
        permissaoCadastroFuncionario,
        unidadeCadastroFuncionario
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
        UPDATE unidade 
        SET cidade = ?, estado = ?, cep = ?, logradouro = ?, numero = ?, complemento = ? 
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
            complementoEditarEmpresa,
            idEmpresaEditarEmpresa
        ]);
    });

}

function listarUsuarios() {
    var instrucaoSql = `
        SELECT * FROM vw_usuarios
        WHERE status != 'PENDENTE'
        ORDER BY nome ASC;`;

    return database.executar(instrucaoSql);
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
            u.cep,
            u.estado,
            u.cidade,
            u.bairro,
            u.logradouro,
            u.numero,
            u.complemento
        FROM empresa e
        INNER JOIN unidade u ON u.fk_empresa = e.id_empresa
        WHERE e.id_empresa = ?;
    `;

    return database.executar(instrucaoSql, [idEmpresaBuscarEmpresa]);
}

module.exports = {
    cadastrarFuncionario,
    editarEmpresa,
    listarUsuarios,
    listarUsuariosProcurados,
    editarStatusUsuario,
    buscarEmpresa
};