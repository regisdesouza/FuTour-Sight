var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/usuarioController");

router.post("/enviarMensagem", function (req, res) {
    usuarioController.enviarMensagem(req, res);
});

router.post("/preCadastrar", function (req, res) {
    usuarioController.preCadastrar(req, res);
});

router.post("/autenticar", function (req, res) {
    usuarioController.autenticar(req, res);
});

router.post("/criarFiltro", function(req, res) {
    usuarioController.criarFiltro(req, res);
})

router.get("/listarFiltros", function(req, res) {
    usuarioController.listarFiltros(req, res);
})

router.get("/listarEstados", function(req, res) {
    usuarioController.listarEstados(req, res);
})

router.get("/listarPaises", function(req, res) {
    usuarioController.listarPaises(req, res);
})

router.get("/listarAnos", function(req, res) {
    usuarioController.listarAnos(req, res);
})

router.put("/atualizarFiltro/:idFiltro", function(req, res) {
    usuarioController.atualizarFiltro(req, res);
})

router.put("/editarPerfil/:idUsuario", function (req, res) {
    usuarioController.editarPerfil(req, res);
});

router.delete("/excluirFiltro/:idFiltro", function(req, res) {
    usuarioController.excluirFiltro(req, res);
})

module.exports = router;