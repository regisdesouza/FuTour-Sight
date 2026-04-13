var database = require("../database/config.js")

function enviarMensagem(nomeMensagem, emailMensagem, telefoneMensagem, mensagemMensagem) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function enviarMensagem():", nomeMensagem, emailMensagem, telefoneMensagem, mensagemMensagem);
    
    var instrucaoSql = `
        INSERT INTO contato (nome, email, telefone, mensagem) VALUES ('${nomeMensagem}', '${emailMensagem}', '${telefoneMensagem}', '${mensagemMensagem}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    enviarMensagem
};