var express = require("express");
var router  = express.Router();

var usuarioController = require("../controllers/usuarioController");

// ============================================================
// POST
// ============================================================

router.post("/mensagens", function (req, res) {
    usuarioController.enviarMensagem(req, res);
});

router.post("/usuarios/pre-cadastro", function (req, res) {
    usuarioController.preCadastrar(req, res);
});

router.post("/usuarios/autenticacao", function (req, res) {
    usuarioController.autenticar(req, res);
});

router.post("/filtros", function (req, res) {
    usuarioController.criarFiltro(req, res);
});

// ============================================================
// GET
// ============================================================

router.get("/filtros", function (req, res) {
    usuarioController.listarFiltros(req, res);
});

router.get("/filtros/:idFiltro", function (req, res) {
    usuarioController.buscarFiltro(req, res);
});

router.get("/estados", function (req, res) {
    usuarioController.listarEstados(req, res);
});

router.get("/continentes", function (req, res) {
    usuarioController.listarContinentes(req, res);
});

router.get("/anos", function (req, res) {
    usuarioController.listarAnos(req, res);
});

// ============================================================
// PUT
// ============================================================

router.put("/filtros/:idFiltro", function (req, res) {
    usuarioController.atualizarFiltro(req, res);
});

router.put("/usuarios/:idUsuario/perfil", function (req, res) {
    usuarioController.editarPerfil(req, res);
});

// ============================================================
// DELETE
// ============================================================

router.delete("/filtros/:idFiltro", function (req, res) {
    usuarioController.excluirFiltro(req, res);
});

module.exports = router;
