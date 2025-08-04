const express = require("express");
const router = express.Router();
const {
  bookAppointment,
  getAppointments,
} = require("../controllers/appointmentController");

// 📌 POST /api/appointments
router.post("/create-appointment", bookAppointment);

// 📌 GET /api/appointments
router.get("/appointments", getAppointments);

module.exports = router;
