const db = require("../db/connection");

const SELECT = `
  SELECT a.*,
    p.PatientFirstname AS AppointmentPatientFirstname,
    p.PatientLastname  AS AppointmentPatientLastname,
    c.ClinicName       AS AppointmentClinicName,
    s.StaffFirstname   AS AppointmentStaffFirstname,
    s.StaffLastname    AS AppointmentStaffLastname,
    st.StatusName      AS AppointmentStatusName
  FROM Appointment a
  LEFT JOIN Patient           p  ON a.AppointmentPatientID = p.PatientID
  LEFT JOIN Clinic            c  ON a.AppointmentClinicID  = c.ClinicID
  LEFT JOIN Staff             s  ON a.AppointmentStaffID   = s.StaffID
  LEFT JOIN AppointmentStatus st ON a.AppointmentStatusID  = st.StatusID
`;

exports.getAll = async (req, res) => {
  try {
    let query = SELECT;
    const params = [];
    const conditions = [];
    if (req.query.staffId)   { conditions.push("a.AppointmentStaffID = ?");   params.push(req.query.staffId); }
    if (req.query.clinicId)  { conditions.push("a.AppointmentClinicID = ?");  params.push(req.query.clinicId); }
    if (req.query.patientId) { conditions.push("a.AppointmentPatientID = ?"); params.push(req.query.patientId); }
    if (conditions.length)   query += " WHERE " + conditions.join(" AND ");
    query += " ORDER BY a.AppointmentDatetime";
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getOne = async (req, res) => {
  try {
    const [rows] = await db.query(SELECT + " WHERE a.AppointmentID = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: "Appointment not found" });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const { AppointmentDatetime, AppointmentPatientID, AppointmentClinicID, AppointmentStaffID, AppointmentNotes } = req.body;
    const [result] = await db.query(
      "INSERT INTO Appointment (AppointmentDatetime, AppointmentPatientID, AppointmentClinicID, AppointmentStaffID, AppointmentStatusID, AppointmentNotes) VALUES (?,?,?,?,1,?)",
      [AppointmentDatetime, AppointmentPatientID, AppointmentClinicID, AppointmentStaffID || null, AppointmentNotes || ""]
    );
    const [rows] = await db.query(SELECT + " WHERE a.AppointmentID = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const fields = ["AppointmentDatetime","AppointmentPatientID","AppointmentClinicID","AppointmentStaffID","AppointmentStatusID","AppointmentNotes"];
    const updates = [];
    const params = [];
    fields.forEach(f => { if (req.body[f] !== undefined) { updates.push(`${f} = ?`); params.push(req.body[f]); } });
    if (!updates.length) return res.status(400).json({ error: "No fields to update" });
    params.push(req.params.id);
    await db.query(`UPDATE Appointment SET ${updates.join(", ")} WHERE AppointmentID = ?`, params);
    const [rows] = await db.query(SELECT + " WHERE a.AppointmentID = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: "Appointment not found" });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.remove = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM Appointment WHERE AppointmentID = ?", [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: "Appointment not found" });
    res.status(204).send();
  } catch (err) { res.status(500).json({ error: err.message }); }
};
