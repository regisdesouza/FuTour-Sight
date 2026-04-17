var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/usuarioController");

router.post("/enviarMensagem", function (req, res) {
    usuarioController.enviarMensagem(req, res);
})

router.post("/preCadastrar", function (req, res) {
    usuarioController.preCadastrar(req, res);
});

router.post("/autenticar", function (req, res) {
    usuarioController.autenticar(req, res);
});

router.post("/cadastrarFuncionario", function (req, res) {
    usuarioController.cadastrarFuncionario(req, res);
});

router.put("/editarEmpresa/:idEmpresa", function (req, res) {
    usuarioController.editarEmpresa(req, res);
});

module.exports = router;


