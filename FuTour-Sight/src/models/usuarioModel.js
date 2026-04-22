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

function buscarLogs() {
    var instrucaoSql = `
        SELECT
        id_log,
        tabela,
        registros_lidos,
        sucesso,
        mensagem,
        data_criacao
        FROM log
        ORDER BY data_criacao DESC;`;

    return database.executar(instrucaoSql);
}

module.exports = {
    enviarMensagem,
    preCadastrar,
    autenticar,
    cadastrarFuncionario,
    editarEmpresa,
    editarPerfil,
    buscarLogs
};