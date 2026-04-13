var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/usuarioController");

router.post("/enviarMensagem", function (req, res) {
    usuarioController.enviarMensagem(req, res);
})


module.exports = router;