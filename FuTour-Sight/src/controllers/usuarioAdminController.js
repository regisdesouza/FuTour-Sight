var usuarioAdminModel = require("../models/usuarioAdminModel");

function cadastrarFuncionario(req, res) {
    var nomeCadastroFuncionario = req.body.nomeServer;
    var emailPessoalCadastroFuncionario = req.body.emailPessoalServer;
    var senhaCadastroFuncionario = req.body.senhaServer;
    var unidadeCadastroFuncionario = req.body.unidadeServer;
    var permissaoCadastroFuncionario = req.body.permissaoServer;

    if (nomeCadastroFuncionario == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (emailPessoalCadastroFuncionario == undefined) {
        res.status(400).send("Seu e-mail pessoal está undefined!");
    } else if (senhaCadastroFuncionario == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else if (unidadeCadastroFuncionario == undefined) {
        res.status(400).send("Sua unidade corporativo está undefined!");
    } else if (permissaoCadastroFuncionario == undefined) {
        res.status(400).send("Sua permissão está undefined!");
    } else {
        usuarioAdminModel.cadastrarFuncionario(
            nomeCadastroFuncionario,
            emailPessoalCadastroFuncionario,
            senhaCadastroFuncionario,
            unidadeCadastroFuncionario,
            permissaoCadastroFuncionario
        )
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro de funcionário! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

function editarEmpresa(req, res) {
    var idEmpresaEditarEmpresa = req.params.idEmpresa;
    var empresaEditarEmpresa = req.body.empresaServer;
    var cnpjEditarEmpresa = req.body.cnpjServer;
    var emailCorporativoEditarEmpresa = req.body.emailCorporativoServer;
    var telefoneCorporativoEditarEmpresa = req.body.telefoneCorporativoServer;
    var cepEditarEmpresa = req.body.cepServer;
    var estadoEditarEmpresa = req.body.estadoServer;
    var cidadeEditarEmpresa = req.body.cidadeServer;
    var bairroEditarEmpresa = req.body.bairroServer;
    var logradouroEditarEmpresa = req.body.logradouroServer;
    var numeroEditarEmpresa = req.body.numeroServer;
    var complementoEditarEmpresa = req.body.complementoServer;

    usuarioAdminModel.editarEmpresa(
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
    )
        .then(
            function (resultado) {
                res.json(resultado);
            }
        )
        .catch(
            function (erro) {
                console.log(erro);
                console.log("Houve um erro ao realizar a edição da empresa: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );

}

function listarUsuarios(req, res) {
    usuarioAdminModel.listarUsuarios().then((resultado) => {
        res.status(200).json(resultado);
    });
}

function listarUsuariosProcurados(req, res) {
    var idEmpresa = req.query.idEmpresa;
    var nomeFuncionario = req.query.nomeFuncionarioServer;

    usuarioAdminModel.listarEmpresasProcuradas(idEmpresa, nomeFuncionario)
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(204).send("Nenhum resultado encontrado!");
            }
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    cadastrarFuncionario,
    editarEmpresa,
    listarUsuarios,
    listarUsuariosProcurados
}

