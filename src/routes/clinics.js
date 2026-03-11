const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/clinicsController");
const validate = require("../middleware/validate");

const rules = [
  { field: "ClinicName", required: true, type: "string", label: "Clinic name" }
];

router.get("/",       ctrl.getAll);
router.get("/:id",    ctrl.getOne);
router.post("/",      validate(rules), ctrl.create);
router.put("/:id",    ctrl.update);
router.delete("/:id", ctrl.remove);

module.exports = router;
