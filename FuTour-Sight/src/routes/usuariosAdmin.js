var express = require("express");
var router = express.Router();

var usuarioAdminController = require("../controllers/usuarioAdminController");

router.post("/funcionarios", function (req, res) {
    usuarioAdminController.cadastrarFuncionario(req, res);
});

router.get("/usuarios", function (req, res) {
    usuarioAdminController.listarUsuarios(req, res);
});

router.get("/usuarios/procurados", function (req, res) {
    usuarioAdminController.listarUsuariosProcurados(req, res);
});

router.get("/empresas/:idEmpresa", function (req, res) {
    usuarioAdminController.buscarEmpresa(req, res);
});

router.get("/funcionarios/:idUsuario", function (req, res) {
    usuarioAdminController.buscarFuncionario(req, res);
});

router.put("/funcionarios/:idUsuario", function (req, res) {
    usuarioAdminController.editarFuncionario(req, res);
});

router.put("/empresas/:idEmpresa", function (req, res) {
    usuarioAdminController.editarEmpresa(req, res);
});

router.put("/usuarios/:idUsuario/status", function (req, res) {
    usuarioAdminController.editarStatusUsuario(req, res);
});

module.exports = router;