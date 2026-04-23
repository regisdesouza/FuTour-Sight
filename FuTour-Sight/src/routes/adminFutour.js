var express = require("express");
var router = express.Router();

var adminFutourController = require("../controllers/adminFutourController");

router.post("/solicitacoesAprovar/:idSolicitacao", function (req, res) {
    adminFutourController.aprovarSolicitacao(req, res);
});

router.post("/solicitacoesCancelar/:idSolicitacao", function (req, res) {
    adminFutourController.cancelarSolicitacao(req, res);
});

router.get("/buscarSolicitacoes", function (req, res) {
    adminFutourController.listarSolicitacoes(req, res);
});

router.get("/buscarLogs", function (req, res) {
    adminFutourController.buscarLogs(req, res);
});

router.get("/listarEmpresas", function (req, res) {
    adminFutourController.listarEmpresas(req, res);
});

router.get("/listarEmpresasProcuradas", function (req, res) {
    adminFutourController.listarEmpresasProcuradas(req, res);
});

router.put("/editarStatusEmpresa/:idEmpresa", function (req, res) {
    adminFutourController.editarStatusEmpresa(req, res);
});

module.exports = router;
