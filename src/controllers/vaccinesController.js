const db = require("../db/connection");

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Vaccine ORDER BY VaccineName");
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getOne = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Vaccine WHERE VaccineID = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: "Vaccine not found" });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const { VaccineName, VaccineCost } = req.body;
    const [result] = await db.query("INSERT INTO Vaccine (VaccineName, VaccineCost) VALUES (?,?)", [VaccineName, VaccineCost]);
    const [rows] = await db.query("SELECT * FROM Vaccine WHERE VaccineID = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const fields = ["VaccineName","VaccineCost"];
    const updates = []; const params = [];
    fields.forEach(f => { if (req.body[f] !== undefined) { updates.push(`${f} = ?`); params.push(req.body[f]); } });
    if (!updates.length) return res.status(400).json({ error: "No fields to update" });
    params.push(req.params.id);
    const [result] = await db.query(`UPDATE Vaccine SET ${updates.join(", ")} WHERE VaccineID = ?`, params);
    if (!result.affectedRows) return res.status(404).json({ error: "Vaccine not found" });
    const [rows] = await db.query("SELECT * FROM Vaccine WHERE VaccineID = ?", [req.params.id]);
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.remove = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM Vaccine WHERE VaccineID = ?", [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: "Vaccine not found" });
    res.status(204).send();
  } catch (err) { res.status(500).json({ error: err.message }); }
};
