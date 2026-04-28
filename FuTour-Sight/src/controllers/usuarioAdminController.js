var usuarioAdminModel = require("../models/usuarioAdminModel");

function cadastrarFuncionario(req, res) {
    var {
        nomeServer,
        emailPessoalServer,
        senhaServer,
        enderecoServer,
        permissaoServer
    } = req.body;

    if (!nomeServer) return res.status(400).json({ mensagem: "Nome undefined!" });
    if (!emailPessoalServer) return res.status(400).json({ mensagem: "Email undefined!" });
    if (!senhaServer) return res.status(400).json({ mensagem: "Senha undefined!" });
    if (!enderecoServer) return res.status(400).json({ mensagem: "Endereço undefined!" });
    if (!permissaoServer) return res.status(400).json({ mensagem: "Permissão undefined!" });

    usuarioAdminModel.cadastrarFuncionario(
        nomeServer,
        emailPessoalServer,
        senhaServer,
        enderecoServer,
        permissaoServer
    )
        .then((resultado) => {
            res.status(200).json(resultado);
        })
        .catch((erro) => {
            console.log(erro);
            res.status(500).json({ mensagem: erro.sqlMessage });
        });
}

function editarEmpresa(req, res) {
    var idEmpresa = req.params.idEmpresa;
    var body = req.body;

    usuarioAdminModel.editarEmpresa(
        idEmpresa,
        body.empresaServer,
        body.cnpjServer,
        body.emailCorporativoServer,
        body.telefoneCorporativoServer,
        body.cepServer,
        body.estadoServer,
        body.cidadeServer,
        body.bairroServer,
        body.logradouroServer,
        body.numeroServer,
        body.complementoServer
    )
        .then((resultado) => {
            res.status(200).json(resultado);
        })
        .catch((erro) => {
            console.log(erro);
            res.status(500).json({ mensagem: erro.sqlMessage });
        });
}

function listarUsuarios(req, res) {
    var idEmpresa = req.query.idEmpresa

    usuarioAdminModel.listarUsuarios(idEmpresa)
        .then((resultado) => {
            res.status(200).json(resultado);
        })
        .catch((erro) => {
            console.log(erro);
            res.status(500).json({ mensagem: erro.sqlMessage });
        });
}

function listarUsuariosProcurados(req, res) {
    var idEmpresa = req.query.idEmpresa;
    var nomeFuncionario = req.query.nomeFuncionarioServer;

    usuarioAdminModel.listarUsuariosProcurados(idEmpresa, nomeFuncionario)
        .then((resultado) => {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(204).json({ mensagem: "Nenhum resultado encontrado!" });
            }
        })
        .catch((erro) => {
            console.log(erro);
            res.status(500).json({ mensagem: erro.sqlMessage });
        });
}

function editarStatusUsuario(req, res) {
    var idUsuario = req.params.idUsuario;
    var status = req.body.status;

    usuarioAdminModel.editarStatusUsuario(idUsuario, status)
        .then(() => {
            res.status(200).json({ mensagem: "Status atualizado com sucesso." });
        })
        .catch((erro) => {
            console.log(erro);
            res.status(500).json({ mensagem: erro.sqlMessage });
        });
}

function buscarEmpresa(req, res) {
    var idEmpresabuscarEmpresa = req.params.idEmpresa;

    usuarioAdminModel.buscarEmpresa(idEmpresabuscarEmpresa)
        .then((resultado) => {
            if (resultado.length == 0) return res.status(404).json({ mensagem: "Empresa não encontrada!" });
            res.status(200).json(resultado[0]);
        })
        .catch((erro) => {
            console.log(erro);
            res.status(500).json({ mensagem: erro.sqlMessage });
        });
}

module.exports = {
    cadastrarFuncionario,
    editarEmpresa,
    listarUsuarios,
    listarUsuariosProcurados,
    editarStatusUsuario,
    buscarEmpresa
};