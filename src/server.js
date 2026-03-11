const express = require("express");
const cors    = require("cors");
const app     = express();
const PORT    = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/appointments", require("./routes/appointments"));
app.use("/patients",     require("./routes/patients"));
app.use("/vaccines",     require("./routes/vaccines"));
app.use("/clinics",      require("./routes/clinics"));

app.get("/", (req, res) => {
  res.json({
    message: "Travel Jabs API is running",
    endpoints: [
      "GET/POST/PUT/DELETE /appointments",
      "GET/POST/PUT/DELETE /patients",
      "GET/POST/PUT/DELETE /vaccines",
      "GET/POST/PUT/DELETE /clinics"
    ]
  });
});

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

app.listen(PORT, () => {
  console.log(`Travel Jabs API running on http://localhost:${PORT}`);
});
