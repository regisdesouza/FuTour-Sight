const nodemailer = require("nodemailer");
const crypto = require("crypto");

var adminFutourModel = require("../models/adminFutourModel");

// ============================================================
// POST — aprovarSolicitacao
// ============================================================

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
        const minusculas = "abcdefghijklmnopqrstuvwxyz";
        const especiais = "!@#$%&*";
        const numeros = "0123456789";

        const letraMaiuscula =
            maiusculas[Math.floor(Math.random() * maiusculas.length)];

        const letraMinuscula =
            minusculas[Math.floor(Math.random() * minusculas.length)];

        const caractereEspecial =
            especiais[Math.floor(Math.random() * especiais.length)];

        const numero =
            numeros[Math.floor(Math.random() * numeros.length)];

        const senhaTemp =
            letraMaiuscula +
            letraMinuscula +
            caractereEspecial +
            numero +
            crypto.randomBytes(3).toString("hex");

        const resultadoEmpresa = await adminFutourModel.criarEmpresa(
            dados.nome_empresa,
            dados.cnpj_empresa,
            dados.email_empresa,
            dados.telefone_empresa
        );

       await adminFutourModel.criarEndereco(idEmpresa);

        const resultadoUsuario = await adminFutourModel.criarUsuario( 
            dados.nome_responsavel,
            dados.email_responsavel,
            senhaTemp,
            idEmpresa
        );

        await adminFutourModel.criarFiltrosPadrao(resultadoUsuario.insertId); 

        await adminFutourModel.aprovarSolicitacao(idSolicitacao);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
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
            `
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

// ============================================================
// POST — cancelarSolicitacao
// ============================================================

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

// ============================================================
// GET — listarSolicitacoes
// ============================================================

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

// ============================================================
// GET — buscarLogs
// ============================================================

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

// ============================================================
// GET — listarConfiguracoes
// ============================================================

async function listarConfiguracoes(req, res) {
    try {
        const resultado = await adminFutourModel.listarConfiguracoesNotificacao();
        return res.status(200).json(resultado);
    } catch (erro) {
        console.log(erro);
        return res.status(500).json({
            mensagem: erro.sqlMessage || erro.message
        });
    }
}

// ============================================================
// GET — listarEmpresas
// ============================================================

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

// ============================================================
// GET — listarEmpresasProcuradas
// ============================================================

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

// ============================================================
// GET — buscarEmpresaPorId
// ============================================================

async function buscarEmpresaPorId(req, res) {
    const idEmpresa = req.params.idEmpresa;

    try {
        const resultado = await adminFutourModel.buscarEmpresaPorId(idEmpresa);

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

// ============================================================
// PUT — atualizarDestinatario
// ============================================================

async function atualizarDestinatario(req, res) {
    const { idUsuario, idConfiguracao, receber } = req.body;

    try {
        if (idUsuario === undefined || idConfiguracao === undefined || receber === undefined) {
            return res.status(400).json({
                mensagem: "idUsuario, idConfiguracao e receber são obrigatórios."
            });
        }

        await adminFutourModel.atualizarDestinatario(idUsuario, idConfiguracao, receber);

        return res.status(200).json({
            mensagem: "Destinatário atualizado com sucesso."
        });

    } catch (erro) {
        console.log(erro);
        return res.status(500).json({
            mensagem: erro.sqlMessage || erro.message
        });
    }
}

// ============================================================
// PUT — atualizarConfiguracao
// ============================================================

async function atualizarConfiguracao(req, res) {
    const id = req.params.id;
    const { ativo, intervalo } = req.body;

    try {
        if (ativo === undefined || !intervalo) {
            return res.status(400).json({
                mensagem: "ativo e intervalo são obrigatórios."
            });
        }

        await adminFutourModel.atualizarConfiguracao(id, ativo, intervalo);

        return res.status(200).json({
            mensagem: "Configuração atualizada com sucesso."
        });

    } catch (erro) {
        console.log(erro);
        return res.status(500).json({
            mensagem: erro.sqlMessage || erro.message
        });
    }
}

// ============================================================
// PUT — atualizarEmpresa
// ============================================================

async function atualizarEmpresa(req, res) {
    const idEmpresa = req.params.idEmpresa;
    const { nome, cnpj, email, telefone, nivel } = req.body;

    try {
        if (!nome || !cnpj || !email || !telefone) {
            return res.status(400).json({
                mensagem: "Preencha todos os campos obrigatórios."
            });
        }

        await adminFutourModel.atualizarEmpresa(idEmpresa, nome, cnpj, email, telefone, nivel);

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

// ============================================================
// PUT — editarStatusEmpresa
// ============================================================

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
    criarFiltrosPadrao,
    buscarLogs,
    listarConfiguracoes,
    listarEmpresas,
    listarEmpresasProcuradas,
    buscarEmpresaPorId,
    atualizarDestinatario,
    atualizarConfiguracao,
    atualizarEmpresa,
    editarStatusEmpresa
};
