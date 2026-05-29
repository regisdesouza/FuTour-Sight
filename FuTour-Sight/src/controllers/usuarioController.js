var usuarioModel = require("../models/usuarioModel");

// ============================================================
// POST — enviarMensagem
// ============================================================

async function enviarMensagem(req, res) {
    const {
        nomeServer,
        emailServer,
        telefoneServer,
        mensagemServer
    } = req.body;

    try {
        if (!nomeServer) {
            return res.status(400).json({ mensagem: "Nome undefined." });
        }

        if (!emailServer) {
            return res.status(400).json({ mensagem: "Email undefined." });
        }

        if (!telefoneServer) {
            return res.status(400).json({ mensagem: "Telefone undefined." });
        }

        if (!mensagemServer) {
            return res.status(400).json({ mensagem: "Mensagem undefined." });
        }

        const resultado = await usuarioModel.enviarMensagem(
            nomeServer,
            emailServer,
            telefoneServer,
            mensagemServer
        );

        return res.status(200).json({
            mensagem: "Mensagem enviada com sucesso.",
            resultado
        });

    } catch (erro) {
        console.log(erro);
        return res.status(500).json({
            mensagem: erro.sqlMessage || erro.message
        });
    }
}

// ============================================================
// POST — preCadastrar
// ============================================================

async function preCadastrar(req, res) {
    const {
        nomeServer,
        emailPessoalServer,
        empresaServer,
        emailCorporativoServer,
        cnpjServer,
        telefoneCorporativoServer
    } = req.body;

    try {
        if (!nomeServer) {
            return res.status(400).json({ mensagem: "Nome undefined." });
        }

        if (!emailPessoalServer) {
            return res.status(400).json({ mensagem: "Email pessoal undefined." });
        }

        if (!empresaServer) {
            return res.status(400).json({ mensagem: "Empresa undefined." });
        }

        if (!emailCorporativoServer) {
            return res.status(400).json({ mensagem: "Email corporativo undefined." });
        }

        if (!cnpjServer) {
            return res.status(400).json({ mensagem: "CNPJ undefined." });
        }

        if (!telefoneCorporativoServer) {
            return res.status(400).json({ mensagem: "Telefone undefined." });
        }

        const existe = await usuarioModel.buscarPorCnpj(cnpjServer);

        if (existe.length > 0) {
            return res.status(400).json({
                mensagem: "Já existe uma solicitação com esse CNPJ."
            });
        }

        const resultado = await usuarioModel.preCadastrar(
            nomeServer,
            emailPessoalServer,
            empresaServer,
            emailCorporativoServer,
            cnpjServer,
            telefoneCorporativoServer
        );

        return res.status(200).json({
            mensagem: "Pré cadastro realizado com sucesso.",
            resultado
        });

    } catch (erro) {
        console.log(erro);
        return res.status(500).json({
            mensagem: erro.sqlMessage || erro.message
        });
    }
}

// ============================================================
// POST — autenticar
// ============================================================

async function autenticar(req, res) {
    const {
        emailServer,
        senhaServer
    } = req.body;

    try {
        if (!emailServer) {
            return res.status(400).json({ mensagem: "Email undefined." });
        }

        if (!senhaServer) {
            return res.status(400).json({ mensagem: "Senha undefined." });
        }

        const resultado = await usuarioModel.autenticar(emailServer, senhaServer);

        if (resultado.length === 1) {
            return res.status(200).json(resultado[0]);
        }

        if (resultado.length === 0) {
            return res.status(403).json({ mensagem: "Login inválido." });
        }

        return res.status(403).json({ mensagem: "Duplicidade de usuário." });

    } catch (erro) {
        console.log(erro);
        return res.status(500).json({
            mensagem: erro.sqlMessage || erro.message
        });
    }
}

// ============================================================
// POST — criarFiltro
// ============================================================

async function criarFiltro(req, res) {
    const {
        nomeFiltro,
        estado,
        continente,
        ano_inicio,
        ano_fim,
        fkUsuario
    } = req.body;

    try {
        if (!nomeFiltro) {
            return res.status(400).json({ mensagem: "Nome do filtro undefined." });
        }

        if (!estado) {
            return res.status(400).json({ mensagem: "Estado undefined." });
        }

        if (!continente) {
            return res.status(400).json({ mensagem: "Continente undefined." });
        }

        if (!ano_inicio) {
            return res.status(400).json({ mensagem: "Ano de início undefined." });
        }

        if (!ano_fim) {
            return res.status(400).json({ mensagem: "Ano fim undefined." });
        }

        if (!fkUsuario) {
            return res.status(400).json({ mensagem: "Usuário undefined." });
        }

        await usuarioModel.criarFiltro(
            nomeFiltro,
            estado,
            continente,
            ano_inicio,
            ano_fim,
            fkUsuario
        );

        return res.status(200).json({
            mensagem: "Filtro criado com sucesso."
        });

    } catch (erro) {
        console.log(erro);
        return res.status(500).json({
            mensagem: erro.sqlMessage || erro.message
        });
    }
}

// ============================================================
// GET — listarFiltros
// ============================================================

async function listarFiltros(req, res) {
    const idUsuario = req.query.idUsuario;

    try {
        if (!idUsuario) {
            return res.status(400).json({ mensagem: "idUsuario undefined." });
        }

        const resultado = await usuarioModel.listarFiltros(idUsuario);

        return res.status(200).json(resultado);

    } catch (erro) {
        console.log(erro);
        return res.status(500).json({
            mensagem: erro.sqlMessage || erro.message
        });
    }
}

// ============================================================
// GET — buscarFiltro
// ============================================================

async function buscarFiltro(req, res) {
    const idFiltro = req.params.idFiltro;

    try {
        const resultado = await usuarioModel.buscarFiltro(idFiltro);

        if (resultado.length === 0) {
            return res.status(404).json({ mensagem: "Filtro não encontrado." });
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
// GET — listarEstados
// ============================================================

async function listarEstados(req, res) {
    try {
        const resultado = await usuarioModel.listarEstados();

        return res.status(200).json(resultado);

    } catch (erro) {
        console.log(erro);
        return res.status(500).json({
            mensagem: erro.sqlMessage || erro.message
        });
    }
}

// ============================================================
// GET — listarContinentes
// ============================================================

async function listarContinentes(req, res) {
    try {
        const resultado = await usuarioModel.listarContinentes();

        return res.status(200).json(resultado);

    } catch (erro) {
        console.log(erro);
        return res.status(500).json({
            mensagem: erro.sqlMessage || erro.message
        });
    }
}

// ============================================================
// GET — listarAnos
// ============================================================

async function listarAnos(req, res) {
    try {
        const resultado = await usuarioModel.listarAnos();

        return res.status(200).json(resultado);

    } catch (erro) {
        console.log(erro);
        return res.status(500).json({
            mensagem: erro.sqlMessage || erro.message
        });
    }
}

// ============================================================
// PUT — atualizarFiltro
// ============================================================

async function atualizarFiltro(req, res) {
    const idFiltro = req.params.idFiltro;
    const {
        nomeFiltro,
        estado,
        continente,
        ano_inicio,
        ano_fim,
        fkUsuario
    } = req.body;

    try {
        if (!nomeFiltro || !estado || !continente || !ano_inicio || !ano_fim) {
            return res.status(400).json({
                mensagem: "Preencha todos os campos obrigatórios."
            });
        }

        await usuarioModel.atualizarFiltro(
            nomeFiltro,
            estado,
            continente,
            ano_inicio,
            ano_fim,
            idFiltro
        );

        return res.status(200).json({
            mensagem: "Filtro atualizado com sucesso."
        });

    } catch (erro) {
        console.log(erro);
        return res.status(500).json({
            mensagem: erro.sqlMessage || erro.message
        });
    }
}

// ============================================================
// PUT — editarPerfil
// ============================================================

async function editarPerfil(req, res) {
    const idUsuario = req.params.idUsuario;
    const {
        nomeServer,
        emailServer,
        senhaServer
    } = req.body;

    try {
        if (!nomeServer) {
            return res.status(400).json({ mensagem: "Nome undefined." });
        }

        if (!emailServer) {
            return res.status(400).json({ mensagem: "Email undefined." });
        }

        await usuarioModel.editarPerfil(
            idUsuario,
            nomeServer,
            emailServer,
            senhaServer
        );

        return res.status(200).json({
            mensagem: "Perfil atualizado com sucesso."
        });

    } catch (erro) {
        console.log(erro);
        return res.status(500).json({
            mensagem: erro.sqlMessage || erro.message
        });
    }
}

// ============================================================
// DELETE — excluirFiltro
// ============================================================

async function excluirFiltro(req, res) {
    const idFiltro = req.params.idFiltro;

    try {
        await usuarioModel.excluirFiltro(idFiltro);

        return res.status(200).json({
            mensagem: "Filtro excluído com sucesso."
        });

    } catch (erro) {
        console.log(erro);
        return res.status(500).json({
            mensagem: erro.sqlMessage || erro.message
        });
    }
}

module.exports = {
    enviarMensagem,
    preCadastrar,
    autenticar,
    criarFiltro,
    listarFiltros,
    buscarFiltro,
    listarEstados,
    listarContinentes,
    listarAnos,
    atualizarFiltro,
    editarPerfil,
    excluirFiltro
};
