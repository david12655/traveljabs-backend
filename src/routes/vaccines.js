const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/vaccinesController");
const validate = require("../middleware/validate");

const rules = [
  { field: "VaccineName", required: true, type: "string", label: "Vaccine name" },
  { field: "VaccineCost", required: true, type: "number", min: 0, label: "Vaccine cost" }
];

router.get("/",       ctrl.getAll);
router.get("/:id",    ctrl.getOne);
router.post("/",      validate(rules), ctrl.create);
router.put("/:id",    ctrl.update);
router.delete("/:id", ctrl.remove);

module.exports = router;
