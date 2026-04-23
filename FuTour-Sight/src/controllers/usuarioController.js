var usuarioModel = require("../models/usuarioModel");

function enviarMensagem(req, res) {
    var { nomeServer, emailServer, telefoneServer, mensagemServer } = req.body;

    if (!nomeServer) {
        return res.status(400).json({ mensagem: "Nome undefined!" });
    }
    if (!emailServer) {
        return res.status(400).json({ mensagem: "Email undefined!" });
    }
    if (!telefoneServer) {
        return res.status(400).json({ mensagem: "Telefone undefined!" });
    }
    if (!mensagemServer) {
        return res.status(400).json({ mensagem: "Mensagem undefined!" });
    }

    usuarioModel.enviarMensagem(nomeServer, emailServer, telefoneServer, mensagemServer)
        .then((resultado) => {
            res.status(200).json(resultado);
        })
        .catch((erro) => {
            console.log(erro);
            res.status(500).json({ mensagem: erro.sqlMessage });
        });
}

function preCadastrar(req, res) {
    var {
        nomeServer,
        emailPessoalServer,
        empresaServer,
        emailCorporativoServer,
        cnpjServer,
        telefoneCorporativoServer
    } = req.body;

    if (!nomeServer) return res.status(400).json({ mensagem: "Nome undefined!" });
    if (!emailPessoalServer) return res.status(400).json({ mensagem: "Email pessoal undefined!" });
    if (!empresaServer) return res.status(400).json({ mensagem: "Empresa undefined!" });
    if (!emailCorporativoServer) return res.status(400).json({ mensagem: "Email corporativo undefined!" });
    if (!cnpjServer) return res.status(400).json({ mensagem: "CNPJ undefined!" });
    if (!telefoneCorporativoServer) return res.status(400).json({ mensagem: "Telefone undefined!" });

    usuarioModel.preCadastrar(
        nomeServer,
        emailPessoalServer,
        empresaServer,
        emailCorporativoServer,
        cnpjServer,
        telefoneCorporativoServer
    )
        .then((resultado) => {
            res.status(200).json(resultado);
        })
        .catch((erro) => {
            console.log(erro);
            res.status(500).json({ mensagem: erro.sqlMessage });
        });
}

function autenticar(req, res) {
    var { emailServer, senhaServer } = req.body;

    if (!emailServer) return res.status(400).json({ mensagem: "Email undefined!" });
    if (!senhaServer) return res.status(400).json({ mensagem: "Senha undefined!" });

    usuarioModel.autenticar(emailServer, senhaServer)
        .then((resultado) => {
            if (resultado.length == 1) {
                res.status(200).json(resultado[0]);
            } else if (resultado.length == 0) {
                res.status(403).json({ mensagem: "Login inválido" });
            } else {
                res.status(403).json({ mensagem: "Duplicidade de usuário" });
            }
        })
        .catch((erro) => {
            console.log(erro);
            res.status(500).json({ mensagem: erro.sqlMessage });
        });
}

function editarPerfil(req, res) {
    var idUsuario = req.params.idUsuario;
    var { nomeServer, emailServer, senhaServer } = req.body;

    usuarioModel.editarPerfil(idUsuario, nomeServer, emailServer, senhaServer)
        .then((resultado) => {
            res.status(200).json(resultado);
        })
        .catch((erro) => {
            console.log(erro);
            res.status(500).json({ mensagem: erro.sqlMessage });
        });
}

module.exports = {
    enviarMensagem,
    preCadastrar,
    autenticar,
    editarPerfil
};