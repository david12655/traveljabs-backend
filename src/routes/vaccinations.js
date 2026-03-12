const express = require("express");
const router  = express.Router();
const ctrl    = require("../controllers/vaccinationsController");

router.get("/",                          ctrl.getAll);
router.get("/appointments/:appointmentId", ctrl.getByAppointment);
router.post("/",                         ctrl.create);
router.delete("/:id",                    ctrl.remove);

module.exports = router;
