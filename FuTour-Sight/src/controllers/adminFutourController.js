var adminFutourModel = require("../models/adminFutourModel");

function buscarLogs(req, res) {
    adminFutourModel.buscarLogs().then((resultado) => {
        res.status(200).json(resultado);
    });
}

function listarEmpresas(req, res) {
    adminFutourModel.listarEmpresas().then((resultado) => {
        res.status(200).json(resultado);
    });
}

function listarEmpresasProcuradas(req, res) {
    var nomeEmpresalistarEmpresasProcuradas = req.query.empresaServer;

    adminFutourModel.listarEmpresasProcuradas(nomeEmpresalistarEmpresasProcuradas)
        .then(
            function (resultado) {
                if (resultado.length > 0) {
                    res.status(200).json(resultado);
                } else {
                    res.status(204).send("Nenhum resultado encontrado!");
                }
            }
        )
        .catch(
            function (erro) {
                console.log(erro);
                console.log(
                    "Houve um erro ao buscar as empresas: ",
                    erro.sqlMessage
                );
                res.status(500).json(erro.sqlMessage);
            }
        );
}

module.exports = {
    buscarLogs,
    listarEmpresas,
    listarEmpresasProcuradas
}