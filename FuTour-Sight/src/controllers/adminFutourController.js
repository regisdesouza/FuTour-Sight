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

module.exports = {
    buscarLogs,
    listarEmpresas
}