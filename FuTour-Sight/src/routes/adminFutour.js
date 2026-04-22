var express = require("express");
var router = express.Router();

var adminFutourController = require("../controllers/adminFutourController");

router.get("/buscarLogs", function (req, res) {
    adminFutourController.buscarLogs(req, res);
});

router.get("/listarEmpresas", function (req, res) {
    adminFutourController.listarEmpresas(req, res);
});

module.exports = router;
