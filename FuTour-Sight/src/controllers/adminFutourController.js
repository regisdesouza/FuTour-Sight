const nodemailer = require("nodemailer");
const crypto = require("crypto");
var adminFutourModel = require("../models/adminFutourModel");

function buscarLogs(req, res) {
    adminFutourModel.buscarLogs()
        .then((resultado) => {
            res.status(200).json(resultado);
        })
        .catch((erro) => {
            console.log(erro);
            res.status(500).json({ mensagem: erro.sqlMessage });
        });
}

function listarEmpresas(req, res) {
    adminFutourModel.listarEmpresas()
        .then((resultado) => {
            res.status(200).json(resultado);
        })
        .catch((erro) => {
            console.log(erro);
            res.status(500).json({ mensagem: erro.sqlMessage });
        });
}

function listarEmpresasProcuradas(req, res) {
    var nomeEmpresalistarEmpresasProcuradas = req.query.empresaServer;

    adminFutourModel.listarEmpresasProcuradas(nomeEmpresalistarEmpresasProcuradas)
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

function editarStatusEmpresa(req, res) {
    var idEmpresaeditarStatusEmpresa = req.params.idEmpresa;

    adminFutourModel.editarStatusEmpresa(idEmpresaeditarStatusEmpresa)
        .then(() => {
            res.status(200).json({ mensagem: "Status atualizado com sucesso." });
        })
        .catch((erro) => {
            console.log(erro);
            res.status(500).json({ mensagem: erro.sqlMessage });
        });
}

function listarSolicitacoes(req, res) {
    adminFutourModel.listarSolicitacoes()
        .then((resultado) => {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(204).json({ mensagem: "Nenhuma solicitação encontrada!" });
            }
        })
        .catch((erro) => {
            console.log(erro);
            res.status(500).json({ mensagem: erro.sqlMessage });
        });
}

async function aprovarSolicitacao(req, res) {
    var idaprovarSolicitacao = req.params.idSolicitacao;

    try {
        const solicitacao = await adminFutourModel.buscarSolicitacaoPorId(idaprovarSolicitacao);

        if (solicitacao.length === 0) {
            return res.status(404).json({ mensagem: "Solicitação não encontrada" });
        }

        const dados = solicitacao[0];

        const senhaTemp = crypto.randomBytes(4).toString("hex");

        const resultadoEmpresa = await adminFutourModel.criarEmpresa(
            dados.nome_empresa,
            dados.cnpj_empresa,
            dados.email_empresa,
            dados.telefone_empresa
        );
        const idEmpresa = resultadoEmpresa.insertId;

        await adminFutourModel.criarUnidade(idEmpresa);

        await adminFutourModel.criarUsuario(
            dados.nome_responsavel,
            dados.email_responsavel,
            idEmpresa
        );

        await adminFutourModel.aprovarSolicitacao(idaprovarSolicitacao);

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
                <p><strong>Email:</strong> ${dados.email_responsavel}</p>
                <p><strong>Senha temporária:</strong> ${senhaTemp}</p>
                <a href="http://localhost:3333/login.html">Acessar sistema</a>
                <p>No primeiro acesso você deverá alterar sua senha.</p>
            `,
        });

        return res.status(200).json({ mensagem: "Solicitação aprovada e email enviado!" });

    } catch (erro) {
        console.error("ERRO REAL:", erro);
        return res.status(500).json({ erro: erro.message });
    }
}

function cancelarSolicitacao(req, res) {
    var idcancelarSolicitacao = req.params.idSolicitacao;

    adminFutourModel.buscarPorId(idcancelarSolicitacao)
        .then((resultado) => {
            if (resultado.length == 0) {
                return res.status(404).json({ mensagem: "Solicitação não encontrada" });
            }

            var status = resultado[0].fk_status;

            if (status != 9) {
                return res.status(400).json({
                    mensagem: "Só é possível cancelar solicitações pendentes!"
                });
            }

            return adminFutourModel.cancelarSolicitacao(idcancelarSolicitacao);
        })
        .then(() => {
            res.status(200).json({ mensagem: "Solicitação cancelada!" });
        })
        .catch((erro) => {
            console.log(erro);
            res.status(500).json({ mensagem: erro.sqlMessage });
        });
}

module.exports = {
    buscarLogs,
    listarEmpresas,
    listarEmpresasProcuradas,
    editarStatusEmpresa,
    listarSolicitacoes,
    aprovarSolicitacao,
    cancelarSolicitacao
};