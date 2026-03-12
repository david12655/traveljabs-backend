const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/staffController");
const validate = require("../middleware/validate");

const rules = [
  { field: "StaffFirstname", required: true, type: "string", label: "First name" },
  { field: "StaffLastname",  required: true, type: "string", label: "Last name" },
  { field: "StaffRoleID",    required: true, type: "number", min: 1, label: "Role ID" },
  { field: "StaffClinicID",  required: true, type: "number", min: 1, label: "Clinic ID" }
];

router.get("/",       ctrl.getAll);
router.get("/:id",    ctrl.getOne);
router.post("/",      validate(rules), ctrl.create);
router.put("/:id",    ctrl.update);
router.delete("/:id", ctrl.remove);

module.exports = router;
