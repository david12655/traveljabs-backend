const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/appointmentsController");
const validate = require("../middleware/validate");

const rules = [
  { field: "AppointmentDatetime",  required: true,  type: "datetime", label: "Appointment date/time" },
  { field: "AppointmentPatientID", required: true,  type: "number",   min: 1, label: "Patient ID" },
  { field: "AppointmentClinicID",  required: true,  type: "number",   min: 1, label: "Clinic ID" }
];

router.get("/",       ctrl.getAll);
router.get("/:id",    ctrl.getOne);
router.post("/",      validate(rules), ctrl.create);
router.put("/:id",    ctrl.update);
router.delete("/:id", ctrl.remove);

module.exports = router;
