const db = require("../db/connection");

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Clinic ORDER BY ClinicName");
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getOne = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Clinic WHERE ClinicID = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: "Clinic not found" });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const { ClinicName, ClinicAddress, ClinicPostcode, ClinicContact } = req.body;
    const [result] = await db.query("INSERT INTO Clinic (ClinicName, ClinicAddress, ClinicPostcode, ClinicContact) VALUES (?,?,?,?)", [ClinicName, ClinicAddress || "", ClinicPostcode || "", ClinicContact || ""]);
    const [rows] = await db.query("SELECT * FROM Clinic WHERE ClinicID = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const fields = ["ClinicName","ClinicAddress","ClinicPostcode","ClinicContact"];
    const updates = []; const params = [];
    fields.forEach(f => { if (req.body[f] !== undefined) { updates.push(`${f} = ?`); params.push(req.body[f]); } });
    if (!updates.length) return res.status(400).json({ error: "No fields to update" });
    params.push(req.params.id);
    const [result] = await db.query(`UPDATE Clinic SET ${updates.join(", ")} WHERE ClinicID = ?`, params);
    if (!result.affectedRows) return res.status(404).json({ error: "Clinic not found" });
    const [rows] = await db.query("SELECT * FROM Clinic WHERE ClinicID = ?", [req.params.id]);
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.remove = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM Clinic WHERE ClinicID = ?", [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: "Clinic not found" });
    res.status(204).send();
  } catch (err) { res.status(500).json({ error: err.message }); }
};
