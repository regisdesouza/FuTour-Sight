var database = require("../database/config.js")

function enviarMensagem(nomeMensagem, emailMensagem, telefoneMensagem, mensagemMensagem) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function enviarMensagem():", nomeMensagem, emailMensagem, telefoneMensagem, mensagemMensagem);

    var instrucaoSql = `
        INSERT INTO contato (nome, email, telefone, mensagem) VALUES ('${nomeMensagem}', '${emailMensagem}', '${telefoneMensagem}', '${mensagemMensagem}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


function preCadastrar(nomePreCadastro, emailPessoalPreCadastro, empresaPreCadastro, emailCorporativoPreCadastro, cnpjPreCadastro, telefoneCorporativoPreCadastro) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function preCadastrar():", nomePreCadastro, emailPessoalPreCadastro, empresaPreCadastro, emailCorporativoPreCadastro, cnpjPreCadastro, telefoneCorporativoPreCadastro);

    var instrucaoSql = `
        INSERT INTO solicitacao_cadastro (nome_responsavel, email_responsavel, nome_empresa, cnpj_empresa, email_empresa, telefone_empresa) VALUES ('${nomePreCadastro}', '${emailPessoalPreCadastro}', '${empresaPreCadastro}', '${cnpjPreCadastro}', '${emailCorporativoPreCadastro}', '${telefoneCorporativoPreCadastro}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function autenticar(emailLogin, senhaLogin) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function autenticar(): ", emailLogin, senhaLogin)
    var instrucaoSql = `
        SELECT id_usuario, nome, email, fk_nivel_permissao as nivel_permissao, fk_empresa as empresa, primeiro_acesso FROM usuario WHERE email = '${emailLogin}' AND senha = '${senhaLogin}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
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
    console.log("ACESSEI O AVISO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function editar(): ",
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
        complementoEditarEmpresa);

    var instrucaoSqlUpdateEmpresa = `
        UPDATE empresa SET nome = ?, cnpj = ?, email = ?, telefone = ? WHERE id_empresa = ?;
    `;

    var instrucaoSqlUpdateEndereco = `
        UPDATE unidade SET cidade = ?, estado = ?, cep = ?, logradouro = ?, numero = ?, complemento = ? WHERE fk_empresa = ?;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSqlUpdateEmpresa);
    return database.executar(instrucaoSqlUpdateEmpresa, [
        empresaEditarEmpresa,
        cnpjEditarEmpresa,
        emailCorporativoEditarEmpresa,
        telefoneCorporativoEditarEmpresa,
        idEmpresaEditarEmpresa
    ]).then(() => {
        console.log("Executando a instrução SQL: \n" + instrucaoSqlUpdateEndereco);
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
    enviarMensagem,
    preCadastrar,
    autenticar,
    editarEmpresa
};