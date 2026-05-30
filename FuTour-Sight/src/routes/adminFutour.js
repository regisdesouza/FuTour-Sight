var express = require("express");
var router  = express.Router();

var adminFutourController = require("../controllers/adminFutourController");

// ============================================================
// POST
// ============================================================

router.post("/solicitacoes/:idSolicitacao/aprovar", function (req, res) {
    adminFutourController.aprovarSolicitacao(req, res);
});

router.post("/solicitacoes/:idSolicitacao/cancelar", function (req, res) {
    adminFutourController.cancelarSolicitacao(req, res);
});

// ============================================================
// GET
// ============================================================

router.get("/solicitacoes", function (req, res) {
    adminFutourController.listarSolicitacoes(req, res);
});

router.get("/logs", function (req, res) {
    adminFutourController.buscarLogs(req, res);
});

router.get("/notificacoes", function (req, res) {
    adminFutourController.listarConfiguracoes(req, res);
});

router.get("/empresas", function (req, res) {
    adminFutourController.listarEmpresas(req, res);
});

router.get("/empresas/procuradas", function (req, res) {
    adminFutourController.listarEmpresasProcuradas(req, res);
});

router.get("/empresas/:idEmpresa", function (req, res) {
    adminFutourController.buscarEmpresaPorId(req, res);
});

// ============================================================
// PUT
// ============================================================

router.put("/notificacoes/destinatario", function (req, res) {
    adminFutourController.atualizarDestinatario(req, res);
});

router.put("/notificacoes/:id", function (req, res) {
    adminFutourController.atualizarConfiguracao(req, res);
});

router.put("/empresas/:idEmpresa", function (req, res) {
    adminFutourController.atualizarEmpresa(req, res);
});

router.put("/empresas/:idEmpresa/status", function (req, res) {
    adminFutourController.editarStatusEmpresa(req, res);
});

module.exports = router;
