var express = require("express");
var router = express.Router();

var adminFutourController = require("../controllers/adminFutourController");

router.post("/solicitacoes/:idSolicitacao/aprovar", function (req, res) {
    adminFutourController.aprovarSolicitacao(req, res);
});

router.post("/solicitacoes/:idSolicitacao/cancelar", function (req, res) {
    adminFutourController.cancelarSolicitacao(req, res);
});

router.get("/solicitacoes", function (req, res) {
    adminFutourController.listarSolicitacoes(req, res);
});

router.get("/logs", function (req, res) {
    adminFutourController.buscarLogs(req, res);
});

router.get("/empresas", function (req, res) {
    adminFutourController.listarEmpresas(req, res);
});

router.get("/empresas/procuradas", function (req, res) {
    adminFutourController.listarEmpresasProcuradas(req, res);
});

router.put("/empresas/:idEmpresa/status", function (req, res) {
    adminFutourController.editarStatusEmpresa(req, res);
});

module.exports = router;