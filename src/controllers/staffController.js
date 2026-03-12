const db = require("../db/connection");

const SELECT = `
  SELECT s.*, r.RoleName AS StaffRoleName, c.ClinicName AS StaffClinicName
  FROM Staff s
  LEFT JOIN Role r ON s.StaffRoleID = r.RoleID
  LEFT JOIN Clinic c ON s.StaffClinicID = c.ClinicID
`;

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query(SELECT + " ORDER BY s.StaffLastname");
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getOne = async (req, res) => {
  try {
    const [rows] = await db.query(SELECT + " WHERE s.StaffID = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: "Staff not found" });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const { StaffFirstname, StaffLastname, StaffRoleID, StaffClinicID } = req.body;
    const [result] = await db.query(
      "INSERT INTO Staff (StaffFirstname, StaffLastname, StaffRoleID, StaffClinicID) VALUES (?,?,?,?)",
      [StaffFirstname, StaffLastname, StaffRoleID, StaffClinicID]
    );
    const [rows] = await db.query(SELECT + " WHERE s.StaffID = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const fields = ["StaffFirstname","StaffLastname","StaffRoleID","StaffClinicID"];
    const updates = []; const params = [];
    fields.forEach(f => { if (req.body[f] !== undefined) { updates.push(`${f} = ?`); params.push(req.body[f]); } });
    if (!updates.length) return res.status(400).json({ error: "No fields to update" });
    params.push(req.params.id);
    const [result] = await db.query(`UPDATE Staff SET ${updates.join(", ")} WHERE StaffID = ?`, params);
    if (!result.affectedRows) return res.status(404).json({ error: "Staff not found" });
    const [rows] = await db.query(SELECT + " WHERE s.StaffID = ?", [req.params.id]);
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.remove = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM Staff WHERE StaffID = ?", [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: "Staff not found" });
    res.status(204).send();
  } catch (err) { res.status(500).json({ error: err.message }); }
};
