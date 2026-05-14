const nodemailer = require("nodemailer");
const crypto = require("crypto");

var adminFutourModel = require("../models/adminFutourModel");

async function aprovarSolicitacao(req, res) {
    const idSolicitacao = req.params.idSolicitacao;

    try {
        const solicitacao = await adminFutourModel.buscarSolicitacaoPorId(idSolicitacao);

        if (solicitacao.length === 0) {
            return res.status(404).json({
                mensagem: "Solicitação não encontrada."
            });
        }

        const dados = solicitacao[0];

        const maiusculas = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const especiais = "!@#$%&*";

        const letraMaiuscula = maiusculas[Math.floor(Math.random() * maiusculas.length)];
        const caractereEspecial = especiais[Math.floor(Math.random() * especiais.length)];

        const senhaTemp =
            letraMaiuscula +
            caractereEspecial +
            crypto.randomBytes(3).toString("hex");

        const resultadoEmpresa = await adminFutourModel.criarEmpresa(
            dados.nome_empresa,
            dados.cnpj_empresa,
            dados.email_empresa,
            dados.telefone_empresa
        );

        const idEmpresa = resultadoEmpresa.insertId;

        await adminFutourModel.criarEndereco(idEmpresa);

        await adminFutourModel.criarUsuario(
            dados.nome_responsavel,
            dados.email_responsavel,
            senhaTemp,
            idEmpresa
        );

        await adminFutourModel.aprovarSolicitacao(idSolicitacao);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: `"FuTour Sight" <${process.env.EMAIL_USER}>`,
            to: dados.email_responsavel,
            subject: "Sua solicitação foi aprovada!",
            html: `
                <h2>Bem-vindo ao FuTour Sight!</h2>

                <p>Sua solicitação foi aprovada 🎉</p>

                <p>
                    <strong>Email:</strong> ${dados.email_responsavel}
                </p>

                <p>
                    <strong>Senha temporária:</strong> ${senhaTemp}
                </p>

                <a href="http://localhost:3333/login.html">
                    Acessar sistema
                </a>

                <p>
                    No primeiro acesso você deverá alterar sua senha.
                </p>
            `,
        });

        return res.status(200).json({
            mensagem: "Solicitação aprovada e email enviado com sucesso."
        });

    } catch (erro) {
        console.log(erro);

        return res.status(500).json({
            mensagem: erro.sqlMessage || erro.message
        });
    }
}

async function cancelarSolicitacao(req, res) {
    const idSolicitacao = req.params.idSolicitacao;

    try {
        const solicitacao = await adminFutourModel.buscarSolicitacaoPorId(idSolicitacao);

        if (solicitacao.length === 0) {
            return res.status(404).json({
                mensagem: "Solicitação não encontrada."
            });
        }

        const statusSolicitacao = solicitacao[0].fk_status;

        if (statusSolicitacao != 9) {
            return res.status(400).json({
                mensagem: "Só é possível cancelar solicitações pendentes."
            });
        }

        await adminFutourModel.cancelarSolicitacao(idSolicitacao);

        return res.status(200).json({
            mensagem: "Solicitação cancelada com sucesso."
        });

    } catch (erro) {
        console.log(erro);

        return res.status(500).json({
            mensagem: erro.sqlMessage || erro.message
        });
    }
}

async function listarSolicitacoes(req, res) {
    try {
        const resultado = await adminFutourModel.listarSolicitacoes();

        if (resultado.length === 0) {
            return res.status(204).json({
                mensagem: "Nenhuma solicitação encontrada."
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

async function buscarLogs(req, res) {
    try {
        const resultado = await adminFutourModel.buscarLogs();

        return res.status(200).json(resultado);

    } catch (erro) {
        console.log(erro);

        return res.status(500).json({
            mensagem: erro.sqlMessage || erro.message
        });
    }
}

async function listarEmpresas(req, res) {
    try {
        const resultado = await adminFutourModel.listarEmpresas();

        return res.status(200).json(resultado);

    } catch (erro) {
        console.log(erro);

        return res.status(500).json({
            mensagem: erro.sqlMessage || erro.message
        });
    }
}

async function listarEmpresasProcuradas(req, res) {
    const empresa = req.query.empresaServer;

    try {
        const resultado = await adminFutourModel.listarEmpresasProcuradas(empresa);

        if (resultado.length === 0) {
            return res.status(204).json({
                mensagem: "Nenhuma empresa encontrada."
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

async function editarStatusEmpresa(req, res) {
    const idEmpresa = req.params.idEmpresa;

    try {
        await adminFutourModel.editarStatusEmpresa(idEmpresa);

        return res.status(200).json({
            mensagem: "Status da empresa atualizado com sucesso."
        });

    } catch (erro) {
        console.log(erro);

        return res.status(500).json({
            mensagem: erro.sqlMessage || erro.message
        });
    }
}

module.exports = {
    aprovarSolicitacao,
    cancelarSolicitacao,
    listarSolicitacoes,
    buscarLogs,
    listarEmpresas,
    listarEmpresasProcuradas,
    editarStatusEmpresa
};