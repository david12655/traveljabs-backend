const db = require("../db/connection");

const SELECT = `
  SELECT v.*, vc.VaccineName AS VaccinationVaccineName, vc.VaccineCost AS VaccinationVaccineCost
  FROM Vaccination v
  LEFT JOIN Vaccine vc ON v.VaccinationVaccineID = vc.VaccineID
`;

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query(SELECT + " ORDER BY v.VaccinationID");
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getByAppointment = async (req, res) => {
  try {
    const [rows] = await db.query(SELECT + " WHERE v.VaccinationAppointmentID = ?", [req.params.appointmentId]);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const { VaccinationAppointmentID, VaccinationVaccineID, VaccinationOutcomeNotes } = req.body;
    const [result] = await db.query(
      "INSERT INTO Vaccination (VaccinationAppointmentID, VaccinationVaccineID, VaccinationOutcomeNotes) VALUES (?,?,?)",
      [VaccinationAppointmentID, VaccinationVaccineID, VaccinationOutcomeNotes || ""]
    );
    const [rows] = await db.query(SELECT + " WHERE v.VaccinationID = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.remove = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM Vaccination WHERE VaccinationID = ?", [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: "Vaccination not found" });
    res.status(204).send();
  } catch (err) { res.status(500).json({ error: err.message }); }
};
