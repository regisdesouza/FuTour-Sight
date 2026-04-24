var usuarioModel = require("../models/usuarioModel");

function enviarMensagem(req, res) {
    var nomeMensagem = req.body.nomeServer;
    var emailMensagem = req.body.emailServer;
    var telefoneMensagem = req.body.telefoneServer;
    var mensagemMensagem = req.body.mensagemServer;

    if (nomeMensagem == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (emailMensagem == undefined) {
        res.status(400).send("Seu e-mail está undefined!");
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

function preCadastrar(req, res) {
    var nomePreCadastro = req.body.nomeServer;
    var emailPessoalPreCadastro = req.body.emailPessoalServer;
    var empresaPreCadastro = req.body.empresaServer;
    var emailCorporativoPreCadastro = req.body.emailCorporativoServer;
    var cnpjPreCadastro = req.body.cnpjServer;
    var telefoneCorporativoPreCadastro = req.body.telefoneCorporativoServer;

    if (nomePreCadastro == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (emailPessoalPreCadastro == undefined) {
        res.status(400).send("Seu e-mail pessoal está undefined!");
    } else if (empresaPreCadastro == undefined) {
        res.status(400).send("Sua empresa está undefined!");
    } else if (emailCorporativoPreCadastro == undefined) {
        res.status(400).send("Seu e-mail corporativo está undefined!");
    } else if (cnpjPreCadastro == undefined) {
        res.status(400).send("Seu cnpj está undefined!");
    } else if (telefoneCorporativoPreCadastro == undefined) {
        res.status(400).send("Seu telefone corporativo está undefined!");
    } else {
        usuarioModel.preCadastrar(nomePreCadastro, emailPessoalPreCadastro, empresaPreCadastro, emailCorporativoPreCadastro, cnpjPreCadastro, telefoneCorporativoPreCadastro)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o pré cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

function autenticar(req, res) {
    var emailLogin = req.body.emailServer;
    var senhaLogin = req.body.senhaServer;

    if (emailLogin == undefined) {
        res.status(400).send("Seu e-mail está undefined!");
    } else if (senhaLogin == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {

        usuarioModel.autenticar(emailLogin, senhaLogin)
            .then(
                function (resultadoAutenticar) {
                    console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`);

                    if (resultadoAutenticar.length == 1) {
                        res.json(resultadoAutenticar[0]);
                    } else if (resultadoAutenticar.length == 0) {
                        res.status(403).send("E-mail e/ou senha inválido(s)");
                    } else {
                        res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

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
        usuarioModel.cadastrarFuncionario(nomeCadastroFuncionario, emailPessoalCadastroFuncionario, senhaCadastroFuncionario, unidadeCadastroFuncionario, permissaoCadastroFuncionario)
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

    usuarioModel.editarEmpresa(
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
                console.log("Houve um erro ao realizar o put: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );

}

function editarPerfil(req, res) {
    var idUsuarioEditarPerfil = req.params.idUsuario;
    var nomeEditarPerfil = req.body.nomeServer;
    var emailEditarPerfil = req.body.emailServer;
    var senhaEditarPerfil = req.body.senhaServer;


    usuarioModel.editarPerfil(idUsuarioEditarPerfil, nomeEditarPerfil, emailEditarPerfil, senhaEditarPerfil)
        .then(
            function (resultado) {
                res.json(resultado);
            }
        )
        .catch(
            function (erro) {
                console.log(erro);
                console.log("Houve um erro ao realizar o put: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );

}

module.exports = {
    enviarMensagem,
    preCadastrar,
    autenticar,
    cadastrarFuncionario,
    editarEmpresa,
    editarPerfil
}