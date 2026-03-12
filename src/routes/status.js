const express = require("express");
const router  = express.Router();
const ctrl    = require("../controllers/statusController");

router.get("/", ctrl.getAll);

module.exports = router;
