var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/usuarioController");

router.post("/mensagens", function (req, res) {
    usuarioController.enviarMensagem(req, res);
});

router.post("/usuarios/pre-cadastro", function (req, res) {
    usuarioController.preCadastrar(req, res);
});

router.post("/usuarios/autenticacao", function (req, res) {
    usuarioController.autenticar(req, res);
});

router.post("/filtros", function(req, res) {
    usuarioController.criarFiltro(req, res);
});

router.get("/filtros", function(req, res) {
    usuarioController.listarFiltros(req, res);
});

router.get("/filtros/:idFiltro", function(req, res) {
    usuarioController.buscarFiltro(req, res);
});

router.get("/estados", function(req, res) {
    usuarioController.listarEstados(req, res);
});

router.get("/paises", function(req, res) {
    usuarioController.listarPaises(req, res);
});

router.get("/anos", function(req, res) {
    usuarioController.listarAnos(req, res);
});

router.put("/filtros/:idFiltro", function(req, res) {
    usuarioController.atualizarFiltro(req, res);
});

router.put("/usuarios/:idUsuario/perfil", function (req, res) {
    usuarioController.editarPerfil(req, res);
});

router.delete("/filtros/:idFiltro", function(req, res) {
    usuarioController.excluirFiltro(req, res);
});

module.exports = router;