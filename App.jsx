import { useState, useEffect } from "react";
import VaccineList from "./components/VaccineList";
import VaccineForm from "./components/VaccineForm";
import PatientList from "./components/PatientList";
import PatientForm from "./components/PatientForm";
import AppointmentList from "./components/AppointmentList";
import AppointmentForm from "./components/AppointmentForm";
import ClinicList from "./components/ClinicList";
import StaffList from "./components/StaffList";
import StaffForm from "./components/StaffForm";

const API = "http://localhost:3000";

function App() {
  const [tab, setTab] = useState("appointments");

  const [vaccines, setVaccines]                       = useState([]);
  const [vaccineMode, setVaccineMode]                 = useState("add");
  const [selectedVaccine, setSelectedVaccine]         = useState(null);

  const [patients, setPatients]                       = useState([]);
  const [patientMode, setPatientMode]                 = useState("add");
  const [selectedPatient, setSelectedPatient]         = useState(null);

  const [appointments, setAppointments]               = useState([]);
  const [appointmentMode, setAppointmentMode]         = useState("add");
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [clinics, setClinics]                         = useState([]);
  const [staff, setStaff]                             = useState([]);
  const [staffMode, setStaffMode]                     = useState("add");
  const [selectedStaff, setSelectedStaff]             = useState(null);
  const [statuses, setStatuses]                       = useState([]);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = () => {
    fetch(