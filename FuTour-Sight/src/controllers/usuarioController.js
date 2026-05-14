var usuarioModel = require("../models/usuarioModel");

async function enviarMensagem(req, res) {
    const {
        nomeServer,
        emailServer,
        telefoneServer,
        mensagemServer
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

        if (!telefoneServer) {
            return res.status(400).json({
                mensagem: "Telefone undefined."
            });
        }

        if (!mensagemServer) {
            return res.status(400).json({
                mensagem: "Mensagem undefined."
            });
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
            return res.status(400).json({
                mensagem: "Nome undefined."
            });
        }

        if (!emailPessoalServer) {
            return res.status(400).json({
                mensagem: "Email pessoal undefined."
            });
        }

        if (!empresaServer) {
            return res.status(400).json({
                mensagem: "Empresa undefined."
            });
        }

        if (!emailCorporativoServer) {
            return res.status(400).json({
                mensagem: "Email corporativo undefined."
            });
        }

        if (!cnpjServer) {
            return res.status(400).json({
                mensagem: "CNPJ undefined."
            });
        }

        if (!telefoneCorporativoServer) {
            return res.status(400).json({
                mensagem: "Telefone undefined."
            });
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

async function autenticar(req, res) {
    const {
        emailServer,
        senhaServer
    } = req.body;

    try {
        if (!emailServer) {
            return res.status(400).json({
                mensagem: "Email undefined."
            });
        }

        if (!senhaServer) {
            return res.status(400).json({
                mensagem: "Senha undefined."
            });
        }

        const resultado = await usuarioModel.autenticar(
            emailServer,
            senhaServer
        );

        if (resultado.length === 1) {
            return res.status(200).json(resultado[0]);
        }

        if (resultado.length === 0) {
            return res.status(403).json({
                mensagem: "Login inválido."
            });
        }

        return res.status(403).json({
            mensagem: "Duplicidade de usuário."
        });

    } catch (erro) {
        console.log(erro);

        return res.status(500).json({
            mensagem: erro.sqlMessage || erro.message
        });
    }
}

async function criarFiltro(req, res) {
    const {
        nomeFiltro,
        estados,
        paises,
        mes_inicio,
        mes_fim,
        ano,
        fkUsuario
    } = req.body;

    try {
        const filtro = await usuarioModel.criarFiltro(
            nomeFiltro,
            mes_inicio,
            mes_fim,
            ano,
            fkUsuario
        );

        const idFiltro = filtro.insertId;

        for (const estado of estados) {
            await usuarioModel.criarFiltroItem(
                idFiltro,
                "ESTADO",
                estado
            );
        }

        for (const pais of paises) {
            await usuarioModel.criarFiltroItem(
                idFiltro,
                "PAIS",
                pais
            );
        }

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

async function listarFiltros(req, res) {
    const idUsuario = req.query.idUsuario;

    try {
        const resultados = await usuarioModel.listarFiltros(idUsuario);

        const listaFiltros = resultados.map((filtro) => ({
            id: filtro.id_filtro,
            nome: filtro.nome,
            estados: filtro.estados
                ? filtro.estados.split(",")
                : [],
            paises: filtro.paises
                ? filtro.paises.split(",")
                : [],
            mes_inicio: filtro.mes_inicio,
            mes_fim: filtro.mes_fim,
            ano: filtro.ano_referencia
        }));

        return res.status(200).json(listaFiltros);

    } catch (erro) {
        console.log(erro);

        return res.status(500).json({
            mensagem: erro.sqlMessage || erro.message
        });
    }
}

async function buscarFiltro(req, res) {
    const idFiltro = req.params.idFiltro;

    try {
        const resultado = await usuarioModel.buscarFiltro(idFiltro);

        if (resultado.length === 0) {
            return res.status(404).json({
                mensagem: "Filtro não encontrado."
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

async function listarPaises(req, res) {
    try {
        const resultado = await usuarioModel.listarPaises();

        return res.status(200).json(resultado);

    } catch (erro) {
        console.log(erro);

        return res.status(500).json({
            mensagem: erro.sqlMessage || erro.message
        });
    }
}

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

async function atualizarFiltro(req, res) {
    const idFiltro = req.params.idFiltro;

    const {
        nomeFiltro,
        estados,
        paises,
        mes_inicio,
        mes_fim,
        ano
    } = req.body;

    try {
        await usuarioModel.atualizarFiltro(
            nomeFiltro,
            mes_inicio,
            mes_fim,
            ano,
            idFiltro
        );

        await usuarioModel.deletarFiltrosItens(idFiltro);

        for (const estado of estados) {
            await usuarioModel.criarFiltroItem(
                idFiltro,
                "ESTADO",
                estado
            );
        }

        for (const pais of paises) {
            await usuarioModel.criarFiltroItem(
                idFiltro,
                "PAIS",
                pais
            );
        }

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

async function editarPerfil(req, res) {
    const idUsuario = req.params.idUsuario;

    const {
        nomeServer,
        emailServer,
        senhaServer
    } = req.body;

    try {
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

async function excluirFiltro(req, res) {
    const idFiltro = req.params.idFiltro;

    try {
        await usuarioModel.deletarFiltrosItens(idFiltro);

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
    listarPaises,
    listarAnos,
    atualizarFiltro,
    editarPerfil,
    excluirFiltro
};