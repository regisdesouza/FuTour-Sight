var usuarioAdminModel = require("../models/usuarioAdminModel");
var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function cadastrarFuncionario(req, res) {
    const {
        nomeServer,
        emailPessoalServer,
        senhaServer,
        permissaoServer,
        idEmpresaServer
    } = req.body;

    try {
        if (!nomeServer) {
            return res.status(400).json({
                mensagem: "Nome undefined."
            });
        }

        if (!emailPessoalServer) {
            return res.status(400).json({
                mensagem: "Email undefined."
            });
        }

        if (!senhaServer) {
            return res.status(400).json({
                mensagem: "Senha undefined."
            });
        }

        if (!permissaoServer) {
            return res.status(400).json({
                mensagem: "Permissão undefined."
            });
        }

        if (!idEmpresaServer) {
            return res.status(400).json({
                mensagem: "Empresa undefined."
            });
        }

        const resultado = await usuarioAdminModel.cadastrarFuncionario(
            nomeServer,
            emailPessoalServer,
            senhaServer,
            permissaoServer,
            idEmpresaServer
        );

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: emailPessoalServer,
            subject: "Suas credenciais de acesso",
            html: `
                <h2>Olá, ${nomeServer}!</h2>

                <p>
                    Seu cadastro foi realizado com sucesso.
                </p>

                <p>
                    <strong>Email:</strong> ${emailPessoalServer}
                </p>

                <p>
                    <strong>Senha:</strong> ${senhaServer}
                </p>

                <br>

                <p>
                    Recomendamos que você altere sua senha
                    após o primeiro acesso.
                </p>
            `
        });

        return res.status(200).json({
            mensagem: "Funcionário cadastrado com sucesso.",
            resultado
        });

    } catch (erro) {
        console.log(erro);

        return res.status(500).json({
            mensagem: erro.sqlMessage || erro.message
        });
    }
}

async function listarUsuarios(req, res) {
    const idEmpresa = req.query.idEmpresa;

    try {
        const resultado = await usuarioAdminModel.listarUsuarios(idEmpresa);

        return res.status(200).json(resultado);

    } catch (erro) {
        console.log(erro);

        return res.status(500).json({
            mensagem: erro.sqlMessage || erro.message
        });
    }
}

async function listarUsuariosProcurados(req, res) {
    const idEmpresa = req.query.idEmpresa;

    const nomeFuncionario =
        req.query.nomeFuncionarioServer;

    try {
        const resultado =
            await usuarioAdminModel.listarUsuariosProcurados(
                idEmpresa,
                nomeFuncionario
            );

        if (resultado.length === 0) {
            return res.status(204).json({
                mensagem: "Nenhum resultado encontrado."
            });
        }

        return res.status(200).json(resultado);

    } catch (erro) {
        console.log(erro);

        return res.status(500).json({
            mensagem: erro.sqlMessage || erro.message
        });
    }
}

async function buscarEmpresa(req, res) {
    const idEmpresa = req.params.idEmpresa;

    try {
        const resultado =
            await usuarioAdminModel.buscarEmpresa(idEmpresa);

        if (resultado.length === 0) {
            return res.status(404).json({
                mensagem: "Empresa não encontrada."
            });
        }

        return res.status(200).json(resultado[0]);

    } catch (erro) {
        console.log(erro);

        return res.status(500).json({
            mensagem: erro.sqlMessage || erro.message
        });
    }
}

async function buscarFuncionario(req, res) {
    const idUsuario = req.params.idUsuario;

    try {
        const resultado =
            await usuarioAdminModel.buscarFuncionario(idUsuario);

        if (resultado.length === 0) {
            return res.status(404).json({
                mensagem: "Funcionário não encontrado."
            });
        }

        return res.status(200).json(resultado[0]);

    } catch (erro) {
        console.log(erro);

        return res.status(500).json({
            mensagem: erro.sqlMessage || erro.message
        });
    }
}

async function editarFuncionario(req, res) {
    const idUsuario = req.params.idUsuario;

    const {
        nomeServer,
        emailServer,
        permissaoServer
    } = req.body;

    try {
        if (!nomeServer) {
            return res.status(400).json({
                mensagem: "Nome undefined."
            });
        }

        if (!emailServer) {
            return res.status(400).json({
                mensagem: "Email undefined."
            });
        }

        if (!permissaoServer) {
            return res.status(400).json({
                mensagem: "Permissão undefined."
            });
        }

        await usuarioAdminModel.editarFuncionario(
            idUsuario,
            nomeServer,
            emailServer,
            permissaoServer
        );

        return res.status(200).json({
            mensagem: "Funcionário atualizado com sucesso."
        });

    } catch (erro) {
        console.log(erro);

        return res.status(500).json({
            mensagem: erro.sqlMessage || erro.message
        });
    }
}

async function editarEmpresa(req, res) {
    const idEmpresa = req.params.idEmpresa;

    const {
        empresaServer,
        cnpjServer,
        emailCorporativoServer,
        telefoneCorporativoServer,
        cepServer,
        estadoServer,
        cidadeServer,
        bairroServer,
        logradouroServer,
        numeroServer,
        complementoServer
    } = req.body;

    try {
        await usuarioAdminModel.editarEmpresa(
            idEmpresa,
            empresaServer,
            cnpjServer,
            emailCorporativoServer,
            telefoneCorporativoServer,
            cepServer,
            estadoServer,
            cidadeServer,
            bairroServer,
            logradouroServer,
            numeroServer,
            complementoServer
        );

        return res.status(200).json({
            mensagem: "Empresa atualizada com sucesso."
        });

    } catch (erro) {
        console.log(erro);

        return res.status(500).json({
            mensagem: erro.sqlMessage || erro.message
        });
    }
}

async function editarStatusUsuario(req, res) {
    const idUsuario = req.params.idUsuario;

    const { status } = req.body;

    try {
        await usuarioAdminModel.editarStatusUsuario(
            idUsuario,
            status
        );

        return res.status(200).json({
            mensagem: "Status atualizado com sucesso."
        });

    } catch (erro) {
        console.log(erro);

        return res.status(500).json({
            mensagem: erro.sqlMessage || erro.message
        });
    }
}

module.exports = {
    cadastrarFuncionario,
    listarUsuarios,
    listarUsuariosProcurados,
    buscarEmpresa,
    buscarFuncionario,
    editarFuncionario,
    editarEmpresa,
    editarStatusUsuario
};