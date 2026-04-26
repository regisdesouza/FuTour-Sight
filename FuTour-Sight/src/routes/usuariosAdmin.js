var express = require("express");
var router = express.Router();

var usuarioAdminController = require("../controllers/usuarioAdminController");

router.post("/cadastrarFuncionario", function (req, res) {
    usuarioAdminController.cadastrarFuncionario(req, res);
});

router.get("/listarUsuarios", function (req, res) {
    usuarioAdminController.listarUsuarios(req, res);
});

router.get("/listarUsuariosProcurados", function (req, res) {
    usuarioAdminController.listarUsuariosProcurados(req, res);
});

router.get("/buscarEmpresa/:idEmpresa", function (req, res) {
    usuarioAdminController.buscarEmpresa(req, res);
});

router.put("/editarEmpresa/:idEmpresa", function (req, res) {
    usuarioAdminController.editarEmpresa(req, res);
});

router.put("/editarStatus/:idUsuario", function (req, res) {
    usuarioAdminController.editarStatusUsuario(req, res);
});

module.exports = router;