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

module.exports = {
    cadastrarFuncionario,
    editarEmpresa
};