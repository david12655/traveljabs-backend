const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/patientsController");
const validate = require("../middleware/validate");

const rules = [
  { field: "PatientFirstname", required: true,  type: "string", label: "First name" },
  { field: "PatientLastname",  required: true,  type: "string", label: "Last name" },
  { field: "Patientage",       required: false, type: "number", min: 0, max: 120, label: "Age" }
];

router.get("/",       ctrl.getAll);
router.get("/:id",    ctrl.getOne);
router.post("/",      validate(rules), ctrl.create);
router.put("/:id",    ctrl.update);
router.delete("/:id", ctrl.remove);

module.exports = router;
