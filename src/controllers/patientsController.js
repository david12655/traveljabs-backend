const db = require("../db/connection");

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Patient ORDER BY PatientLastname");
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getOne = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Patient WHERE PatientID = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: "Patient not found" });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const { PatientFirstname, PatientLastname, PatientAddress, PatientPostcode, Patientage } = req.body;
    const [result] = await db.query(
      "INSERT INTO Patient (PatientFirstname, PatientLastname, PatientAddress, PatientPostcode, Patientage) VALUES (?,?,?,?,?)",
      [PatientFirstname, PatientLastname, PatientAddress || "", PatientPostcode || "", Patientage || null]
    );
    const [rows] = await db.query("SELECT * FROM Patient WHERE PatientID = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const fields = ["PatientFirstname","PatientLastname","PatientAddress","PatientPostcode","Patientage"];
    const updates = [];
    const params = [];
    fields.forEach(f => { if (req.body[f] !== undefined) { updates.push(`${f} = ?`); params.push(req.body[f]); } });
    if (!updates.length) return res.status(400).json({ error: "No fields to update" });
    params.push(req.params.id);
    const [result] = await db.query(`UPDATE Patient SET ${updates.join(", ")} WHERE PatientID = ?`, params);
    if (!result.affectedRows) return res.status(404).json({ error: "Patient not found" });
    const [rows] = await db.query("SELECT * FROM Patient WHERE PatientID = ?", [req.params.id]);
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.remove = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM Patient WHERE PatientID = ?", [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: "Patient not found" });
    res.status(204).send();
  } catch (err) { res.status(500).json({ error: err.message }); }
};
