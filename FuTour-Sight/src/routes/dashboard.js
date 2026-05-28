var express = require("express");
var router  = express.Router();

var dashboardController = require("../controllers/dashboardController");

// ============================================================
// GET
// ============================================================

router.get("/:idFiltro", function (req, res) {
    dashboardController.getDashboard(req, res);
});

module.exports = router;
