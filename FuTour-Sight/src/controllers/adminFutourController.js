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
    var nomeEmpresa = req.query.empresaServer;

    adminFutourModel.listarEmpresasProcuradas(nomeEmpresa)
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
    var idEmpresa = req.params.idEmpresa;

    adminFutourModel.editarStatusEmpresa(idEmpresa)
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

function aprovarSolicitacao(req, res) {
    var id = req.params.idSolicitacao;

    adminFutourModel.buscarPorId(id)
        .then((resultado) => {

            if (resultado.length == 0) {
                return res.status(404).json({ mensagem: "Solicitação não encontrada" });
            }

            var dados = resultado[0];

            return adminFutourModel.buscarEmpresaPorCnpj(dados.cnpj_empresa)
                .then((empresaExistente) => {

                    if (empresaExistente.length > 0) {
                        return empresaExistente[0].id_empresa;
                    } else {
                        return adminFutourModel.criarEmpresa(
                            dados.nome_empresa,
                            dados.cnpj_empresa,
                            dados.email_empresa,
                            dados.telefone_empresa
                        ).then(res => res.insertId);
                    }

                })
                .then((idEmpresa) => {

                    return adminFutourModel.criarUsuario(
                        dados.nome_responsavel,
                        dados.email_responsavel,
                        idEmpresa
                    );

                });

        })
        .then(() => {
            return adminFutourModel.aprovarSolicitacao(id);
        })
        .then(() => {
            res.status(200).json({ mensagem: "Solicitação aprovada!" });
        })
        .catch((erro) => {
            console.log("ERRO GERAL:", erro);
            res.status(500).json({ mensagem: erro.sqlMessage });
        });
}

function cancelarSolicitacao(req, res) {
    var id = req.params.idSolicitacao;

    adminFutourModel.buscarPorId(id)
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

            return adminFutourModel.cancelarSolicitacao(id);
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