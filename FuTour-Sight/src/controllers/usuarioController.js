var usuarioModel = require("../models/usuarioModel");

function enviarMensagem(req, res) {
    var nomeMensagem = req.body.nomeServer;
    var emailMensagem = req.body.emailServer;
    var telefoneMensagem = req.body.telefoneServer;
    var mensagemMensagem = req.body.mensagemServer;

    if (nomeMensagem == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (emailMensagem == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (telefoneMensagem == undefined) {
        res.status(400).send("Seu telefone está undefined!");
    } else if (mensagemMensagem == undefined) {
        res.status(400).send("Sua mensagem está undefined!");
    } else {
        usuarioModel.enviarMensagem(nomeMensagem, emailMensagem, telefoneMensagem, mensagemMensagem)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao enviar a mensagem! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

module.exports = {
    enviarMensagem
}