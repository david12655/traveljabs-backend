const db = require("../db/connection");

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM AppointmentStatus");
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};
