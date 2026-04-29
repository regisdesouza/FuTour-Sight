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

router.put("/editarPerfil/:idUsuario", function (req, res) {
    usuarioController.editarPerfil(req, res);
});

module.exports = router;