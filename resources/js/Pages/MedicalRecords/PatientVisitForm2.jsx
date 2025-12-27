import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";
import { useState, useRef } from "react";
import MedicalCertificateModal from "@/Components/MedicalCertificateModal";
import AddLaboratoryRequest from "@/Components/AddLaboratoryRequest";
import AddPrescriptionModal from "@/Components/AddPrescription";
import EditPrescriptionModal from "@/Components/EditPrescription";
import VitalSignsModal from "@/Components/VitalSignsModal";
import ChiefComplaintModal from "@/Components/ChiefComplaint";
import PhysicalExamModal from "@/Components/PhysicalExam";
import PatientNotesModal from "@/Components/PatientNotes";
import PatientPlansModal from "@/Components/PatientPlans";
import PatientDiagnosisModal from "@/Components/PatientDiagnosis";
import EditLabortaryValues from "@/Components/EditLabortaryValues";

import { useForm } from "@inertiajs/react";
import { useEffect } from "react";
import FlashMessage from "@/Components/FlashMessage";
import axios from "axios";
import PatientMedicalHistoryModal from "@/Components/PatientMedicalHistory";
import BillingModal from "@/Components/BillingModal";

export default function PatientVisitForm(props, appointment) {
    const { patient } = usePage().props;
    const this_appointment_id = props.appointment;

    const [patientprescription, setpatientprescription] = useState([]);
    const [isMedicalCertificateOpen, setIsMedicalCertificateOpen] =
        useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isVitalModalOpen, setIsVitalModalOpen] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalChiefVisible, setModalChiefVisible] = useState(false);
    const [modalPhysicalExam, setModalPhysicalVisible] = useState(false);
    const [modalPatientNotes, setModalPatientNotes] = useState(false);
    const [modalPatientPlans, setModalPatientPlans] = useState(false);
    const [patientdata, setPatient] = useState(null);
    const [ChiefComplaints, setChiefComplaint] = useState([]);
    const [PatientNotes, setPatientNotes] = useState([]);
    const [PhysicalExam, setPhysicalExam] = useState([]);
    const [diseases, setdiseases] = useState(null);
    const [addchiefcomplaint, setaddchiefcomplaint] = useState(null);
    const [addphysicalexam, setaddphysicalexam] = useState(null);
    const [addpatientnotes, setaddpatientnotes] = useState(null);
    const [plans, setplanlist] = useState(null);
    const [patientplans, setpatientplanlist] = useState(null);
    const [patientdiagnosislist, setpatientdiagnosislist] = useState(null);
    const [patientdiagnosis, setaddpatientdiagnosis] = useState(null);
    const [modalPatientDiagnosis, setModalPatientDiagnosis] = useState(false);
    const [isLabRequestOpen, setIsLabRequestOpen] = useState(false);
    const [isEditLabOpen, setisEditLabOpen] = useState(false);
    const [sololabvalues, setsololabvalues] = useState({});
    const [labRequests, setLabRequests] = useState([]);
    const [patientvisitform, setpateintvisitform] = useState(null);
    const [inputValue, setInputValue] = useState("");
    const [filteredPlans, setFilteredPlans] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const wrapperRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showList, setShowList] = useState(false);
    const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
    const [selectedAction, setSelectedAction] = useState(null);
    const [statusset, setstatusset] = useState(null);
    const [doctor_name, setdoctorname] = useState(null);
    const [modifyaskModalOpen, setmodifyaskModalOpen] = useState(false);
    const [getdisabled, setdisabled] = useState(false);
    const [medicalrecords, setmedicalrecords] = useState([]);
    const [setPatientCertificateAck, set_patient_certificate_ack] =
        useState(false);

    const openVitalForm = (patientdata) => {
        setPatient(patientdata);
        setIsVitalModalOpen(true);
    };

    useEffect(() => {}, [sololabvalues]);

    const openEditLabOpen = (test) => {
        setsololabvalues(test);
        setisEditLabOpen(true);
    };

    const openChiefComplaintModal = () => {
        setModalChiefVisible(true);
    };
    const OpenPatientModal = () => {
        setModalPatientNotes(true);
    };
    const OpenPatientPlanModal = () => {
        setModalPatientPlans(true);
    };
    const openPhysicalExamModal = () => {
        setModalPhysicalVisible(true);
    };

    const OpenPatientDiagnosisModal = () => {
        setModalPatientDiagnosis(true);
    };

    const setaddpatientplans = (addplan) => {
        const data = {
            patient_id: patient.patient_id,
            appointment_id: this_appointment_id,
            plan: addplan,
        };
        const data2 = {
            name: addplan,
        };

        try {
            axios.post("/patient/planlist", data); // Wait for POST to complete
            axios.post("/plan-list", data2);
            get_patient_plan_list(); // Now safe
            get_plan_list(); // Now safe
            setInputValue("");
        } catch (error) {
            console.error("Error saving plan:", error);
        }
        setInputValue("");
        get_patient_plan_list();
        get_plan_list();
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
                setShowList(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const filtered = plans?.filter((item) =>
            item.name.toLowerCase().includes(inputValue?.toLowerCase()),
        );
        setFilteredPlans(filtered);
    }, [inputValue, plans]);

    const handleSelect = (value) => {
        setInputValue(value);
        setaddpatientplans(value);
        setShowDropdown(false);
    };

    useEffect(() => {
        const filtered = plans?.filter((item) =>
            item.name.toLowerCase().includes(inputValue.toLowerCase()),
        );
        setFilteredPlans(filtered);
    }, [inputValue, plans]);

    // Check if input is not in filteredPlans to optionally add it as an option
    const inputNotInList =
        inputValue.trim() !== "" &&
        !plans.some(
            (item) => item.name.toLowerCase() === inputValue.toLowerCase(),
        );

    const AddChiefComplaint = async () => {
        if (!addchiefcomplaint) return;
        const data = {
            patient_id: patient.patient_id,
            chief_complaint: addchiefcomplaint,
            appointment_id: this_appointment_id,
        };
        try {
            await axios.post("/patient/chiefcomplaint/add", data); // Wait for successful post
            setaddchiefcomplaint(""); // Clear input
            get_chief_complaint(); // Run only after success
        } catch (error) {
            console.error("Error adding chief complaint:", error);
        }
    };

    const get_patient_certificate_ack = () => {
        axios
            .get(
                `/medical-certificate/patient/info/${patient.patient_id}/${this_appointment_id}`,
            )
            .then((response) => {
                if (response.data && response.data.id) {
                    set_patient_certificate_ack(true);
                } else {
                    set_patient_certificate_ack(false);
                }
            });
    };

    const get_patient_medical_record = () => {
        axios
            .get(
                `/patient/medical-records/${patient.patient_id}/${this_appointment_id}`,
            )
            .then((response) => {
                let data = response.data;
                setmedicalrecords(data);
            });
    };

    const setmodifydone = () => {
        setmodifyaskModalOpen(false);
        setdisabled(true);
        try {
            axios.put(
                `/patientvisitform/${patient.patient_id}/${this_appointment_id}`,
                {
                    status: "closed",
                },
            );
        } catch (error) {
            alert(`Error in modify status changing: ${error}`);
        }
        axios.post("/unfinished-docs", {
            patient_id: patient.patient_id,
            doctor_id: props.auth.user.id, // Assuming the logged-in user is the doctor
            appointment_date: new Date().toISOString().split("T")[0], // Current date
            appointment_id: this_appointment_id,
            status: 1, // 0 for unfinished
        });
        fetchpatientvisitformstatus();
    };
    const changepatientvisitformstatus = () => {
        setmodifyaskModalOpen(false);
        setdisabled(false);
        try {
            axios.put(
                `/patientvisitform/${patient.patient_id}/${this_appointment_id}`,
                {
                    status: "modify",
                },
            );
        } catch (error) {
            alert(`Error in modify status changing: ${error}`);
        }
        axios.post("/unfinished-docs", {
            patient_id: patient.patient_id,
            doctor_id: props.auth.user.id, // Assuming the logged-in user is the doctor
            appointment_date: new Date().toISOString().split("T")[0], // Current date
            appointment_id: this_appointment_id,
            status: 0, // 0 for unfinished
        });
        fetchpatientvisitformstatus();
    };
    const AddPhysicalExam = async () => {
        if (!addphysicalexam) return;

        const data = {
            patient_id: patient.patient_id,
            physical_exam: addphysicalexam,
            appointment_id: this_appointment_id,
        };
        try {
            await axios.post("/patient/physicalexam/add", data); // Step 1: API call
            setaddphysicalexam(""); // Step 2: Clear input
            get_physical_exam(); // Step 3: Refresh list
        } catch (error) {
            console.error("Error adding physical exam:", error);
        }
    };

    const AddPatientdiagnosis = async () => {
        if (!patientdiagnosis) return;
        const data = {
            patient_id: patient.patient_id,
            diagnosis: patientdiagnosis,
            appointment_id: this_appointment_id,
        };
        try {
            await axios.post("/patientdiagnosis", data); // Step 1: API call
            setaddpatientdiagnosis(""); // Step 2: Clear input
            get_patient_diagnosis(); // Step 3: Refresh diagnosis list
        } catch (error) {
            console.error("Error adding diagnosis:", error);
        }
    };

    const get_patient_diagnosis = () => {
        axios
            .get(
                `/patientdiagnosis/${patient.patient_id}/${this_appointment_id}`,
            )
            .then((response) => {
                if (response.data) {
                    const diagnosis = response.data;
                    setpatientdiagnosislist(diagnosis);
                } else {
                    console.error("Invalid response format", response.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching medications:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const AddPatientnotes = async () => {
        if (!addpatientnotes) return;
        const data = {
            patient_id: patient.patient_id,
            note: addpatientnotes,
            appointment_id: this_appointment_id,
        };
        try {
            await axios.post("/patient/notes/add", data); // Step 1: Submit the note
            setaddpatientnotes(""); // Step 2: Clear input on success
            get_patient_notes(); // Step 3: Refresh notes list
        } catch (error) {
            console.error("Error adding patient note:", error);
        }
    };

    const get_chief_complaint = () => {
        axios
            .get(
                `/patient/chiefcomplaint/get/${patient.patient_id}/${this_appointment_id}`,
            )
            .then((response) => {
                if (response.data) {
                    const complaints = response.data;
                    setChiefComplaint(complaints);
                } else {
                    console.error("Invalid response format", response.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching medications:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const get_patient_notes = () => {
        axios
            .get(
                `/patient/notes/get/${patient.patient_id}/${this_appointment_id}`,
            )
            .then((response) => {
                if (response.data) {
                    const notes = response.data;
                    setPatientNotes(notes);
                } else {
                    console.error("Invalid response format", response.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching medications:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const get_physical_exam = () => {
        axios
            .get(
                `/patient/physicalexam/get/${patient.patient_id}/${this_appointment_id}`,
            )
            .then((response) => {
                if (response.data) {
                    const physicalexam = response.data;
                    setPhysicalExam(physicalexam);
                } else {
                    console.error("Invalid response format", response.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching medications:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };
    // Add these state variables after the existing useState declarations
    const [labTests, setLabTests] = useState([]);
    const [testDates, setTestDates] = useState([]);
    const [testOptions, setTestOptions] = useState([]);
    const [selectedTest, setSelectedTest] = useState("");
    const [testResult, setTestResult] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //    useEffect(() => {
    // axios.get(`/patient/prescription/get/${patient.patient_id}`)
    //   .then((response) => {
    //     if (response.data && response.data.data) {
    //      const prescriptions = response.data.data;
    //       setpatientprescription(prescriptions);
    //     } else {
    //       console.error('Invalid response format', response.data);
    //     }
    //   })
    //   .catch((error) => {
    //     console.error('Error fetching medications:', error);
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //   });
    // }, []);

    const fetchPrescriptions_list = () => {
        axios
            .get(
                `/patient/prescription/get/${patient.patient_id}/${this_appointment_id}`,
            )
            .then((response) => {
                if (response.data && response.data.data) {
                    const prescriptions = response.data.data;
                    setpatientprescription(prescriptions);
                } else {
                    console.error("Invalid response format", response.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching medications:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const get_plan_list = () => {
        axios.get(`/planlist`).then((response) => {
            const data = response.data;
            setplanlist(data);
        });
    };

    const get_patient_plan_list = () => {
        axios
            .get(
                `/patient/planlist/${patient.patient_id}/${this_appointment_id}`,
            )
            .then((response) => {
                const data = response.data;
                setpatientplanlist(data);
            });
    };

    const fetchMedicalHistory = () => {
        axios.get(`/medicalhistory/${patient.patient_id}`).then((response) => {
            const data = response.data;
            setdiseases(data);
        });
    };

    const fetchpatientvisitformstatus = () => {
        axios
            .get(
                `/patientvisitform/${patient.patient_id}/${this_appointment_id}`,
            )
            .then((response) => {
                const data = response.data;
                setpateintvisitform(data.status);
                if (data.status == "closed") {
                    setdisabled(true);
                }
                setdoctorname(data.first_name);
                if (data.last_name) {
                    setdoctorname(data.first_name + " " + data.last_name);
                }
            });
    };
    // useEffect to call fetchPrescriptions on mount or when patient.patient_id changes
    useEffect(() => {
        fetchpatientvisitformstatus();
        fetchPrescriptions_list();
        fetchMedicalHistory();
        get_chief_complaint();
        get_physical_exam();
        get_patient_notes();
        get_plan_list();
        get_patient_plan_list();
        get_patient_diagnosis();
        get_patient_medical_record();
    }, [patient?.patient_id]);

    // Add this useEffect after the existing useEffect
    useEffect(() => {
        if (patient?.patient_id) {
            setLoading(true);
            setError(null);

            // Fetch test options

            fetchLabTestList();
            // Fetch patient's laboratory tests
            fetchLabTests();
        }
    }, [patient?.patient_id]);

    const fetchLabTestList = () => {
        axios
            .get(route("laboratory.options"))
            .then((response) => {
                setTestOptions(response.data.tests);
            })
            .catch((error) => {
                console.error("Error fetching test options:", error);
                setError("Failed to load test options");
            });
    };
    const fetchLabTests = () => {
        setLoading(true);
        setError(null);

        axios
            .get(
                route("laboratory.patient.tests", {
                    patientId: patient.patient_id,
                    app_id: this_appointment_id,
                }),
            )
            .then((response) => {
                setLabTests(response.data.tests);
                setTestDates(response.data.dates);
            })
            .catch((error) => {
                console.error("Error fetching laboratory tests:", error);
                setError("Failed to load laboratory tests");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleAddTest = () => {
        if (!testResult) {
            alert("Please select a test and enter a result");
            return;
        }

        setLoading(true);
        axios
            .post(route("laboratory.patient.store"), {
                patient_id: patient.patient_id,
                test_name: searchTerm,
                result_value: testResult,
                appointment_id: this_appointment_id,
            })
            .then(() => {
                setSelectedTest("");
                setTestResult("");
                setSearchTerm("");
                fetchLabTests(); // Refresh the table
                fetchLabTestList();
            })
            .catch((error) => {
                console.error("Error adding test:", error);
                alert("Error adding test result");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const openAddPrescription = () => {
        setIsModalOpen(true);
    };
    const openEditPrescription = () => {
        setIsEditModalOpen(true);
    };
    const handleEditModalClose = () => {
        setIsEditModalOpen(false);
        fetchPrescriptions_list(); // refetch if needed
    };

    const { data, setData, post, processing, errors } = useForm({
        patient_id: "",
        blood_diastolic_pressure: "",
        blood_systolic_pressure: "",
        heart_rate: "",
        o2saturation: "",
        temperature: "",
        height_ft: "",
        height_in: "",
        weight: "",
    });

    // const SearchableDropdown = ({ testOptions, loading }) => {

    const filteredOptions = testOptions.filter((test) =>
        test.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const handleSelectw = (value) => {
        setSelectedTest(value);
        setSearchTerm(value);
        setShowList(false);
    };

    // }
    const patient_vitals = async () => {
        try {
            const response = await fetch(
                `/vitalsignsmodal/${patient.patient_id}`,
            );
            const vitalData = await response.json();
            setData({
                patient_id: vitalData.patient_id || "",
                blood_diastolic_pressure:
                    vitalData.blood_diastolic_pressure || "",
                blood_systolic_pressure:
                    vitalData.blood_systolic_pressure || "",
                heart_rate: vitalData.heart_rate || "",
                o2saturation: vitalData.o2saturation || "",
                temperature: vitalData.temperature || "",
                height_ft: vitalData.height_ft || "",
                height_in: vitalData.height_in || "",
                weight: vitalData.weight || "",
            });
        } catch (error) {
            console.error("Error fetching vital signs:", error);
            setData("patient_id", patient.patient_id);
        }
    };

    useEffect(() => {
        if (patient?.patient_id) {
            patient_vitals();
        }
    }, [patient?.patient_id]);

    const fetchLabRequests = async () => {
        try {
            const response = await axios.get(
                `/laboratory-requests/${patient.patient_id}/${this_appointment_id}`,
            );

            // Map both test_name and others into a single array
            const tests = response.data
                .map((test) => {
                    return test.test_name ?? test.others; // prefer test_name, fallback to others
                })
                .filter(Boolean); // remove nulls if any

            setLabRequests(tests);
        } catch (error) {
            console.error("Error fetching lab requests:", error);
        }
    };

    // Add this to your existing useEffect
    useEffect(() => {
        if (patient?.patient_id) {
            fetchLabRequests();
        }
    }, [patient?.patient_id]);

    // Add this function to handle status update
    const updateAppointmentStatus = async (status) => {
        try {
            // console.log('qqqqqqqqqqqqqqqqqqqq',status)
            const id = patient.patient_id;
            await axios.put(route("appointments.update-status", id), {
                status: status,
            });
        } catch (error) {
            console.error("Error updating appointment status:", error);
        }
    };

    // Add these functions to handle button clicks
    const handleSaveAndFinishLater = async () => {
        try {
            // Check if user is a doctor
            // if (props.auth.user.role !== 'doctor') {
            //   alert('Only doctors can save unfinished documents');
            //   return;
            // }
            // Save to unfinished_docs with status 0 (unfinished)

            setstatusset("open");
            fetchpatientvisitformstatus();
            setSelectedAction("save_and_finish");
            updateAppointmentStatus("for_billing");
            setIsBillingModalOpen(true);
        } catch (error) {
            console.error("Error saving unfinished document:", error);
            alert(
                "Error: " +
                    (error.response?.data?.message ||
                        "Failed to save document"),
            );
        }
    };

    const handleSignOffAndClose = async () => {
        try {
            // Check if user is a doctor
            // if (props.auth.user.role !== 'doctor') {
            //   alert('Only doctors can sign off documents');
            //   return;
            // }

            // Save to unfinished_docs with status 1 (completed)

            setstatusset("closed");
            fetchpatientvisitformstatus();
            setSelectedAction("sign_off");
            updateAppointmentStatus("for_billing");
            setIsBillingModalOpen(true);
        } catch (error) {
            console.error("Error saving completed document:", error);
            alert(
                "Error: " +
                    (error.response?.data?.message ||
                        "Failed to complete document"),
            );
        }
    };

    // Add this function to handle billing modal close
    const handleBillingModalClose = async () => {
        await updateAppointmentStatus("for_billing");
        setIsBillingModalOpen(false);
        setSelectedAction(null);
        fetchpatientvisitformstatus();
    };

    const handleMedicalCertificate = async () => {
        try {
            const response = await fetch(
                `/medical-certificate/${patient.patient_id}/${this_appointment_id}`,
            );

            if (!response.ok) {
                // Certificate not found (likely 404)
                alert("No medical certificate found for this appointment.");
                return;
            }

            // Certificate found, open it
            window.open(
                `/medical-certificate/${patient.patient_id}/${this_appointment_id}`,
                "_blank",
            );
        } catch (error) {
            console.error("Error checking certificate:", error);
            alert("Something went wrong while checking the certificate.");
        }
    };

    return (
        <>
            {/* <AddPrescriptionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false);fetchPrescriptions_list()} patient={patient}/> */}
            <AddPrescriptionModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    fetchPrescriptions_list();
                }}
                onResetPrescription={fetchPrescriptions_list}
                patient={patient}
                appointment_id={this_appointment_id}
            />

            <EditLabortaryValues
                isOpen={isEditLabOpen}
                onClose={() => {
                    setisEditLabOpen(false);
                }}
                onUpdate={() => {
                    (setisEditLabOpen(false), fetchLabTests());
                }}
                patient={patient}
                labvalues={sololabvalues}
            />
            <EditPrescriptionModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    handleEditModalClose(); // or setPatientPrescription(null) or whatever reset you want
                }}
                patient={patient}
                appointment_id={this_appointment_id}
            />

            {/* <EditPrescriptionModal 
    isOpen={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    medications={medications}
    title={selectedTemplate?.name}
    templateId={selectedTemplate?.id}
  /> */}

            <AuthenticatedLayout
                auth={props.auth}
                errors={props.errors}
                header={
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Medical Records
                    </h2>
                }
            >
                <Head title="Dashboard" />
                <FlashMessage />
                <ChiefComplaintModal
                    isOpen={modalChiefVisible}
                    onClose={() => {
                        setModalChiefVisible(false);
                        get_chief_complaint();
                    }}
                    patient={patient}
                    appointment_id={this_appointment_id}
                />
                <PhysicalExamModal
                    isOpen={modalPhysicalExam}
                    onClose={() => {
                        setModalPhysicalVisible(false);
                        get_physical_exam();
                    }}
                    patient={patient}
                    appointment_id={this_appointment_id}
                />

                <PatientNotesModal
                    isOpen={modalPatientNotes}
                    onClose={() => {
                        setModalPatientNotes(false);
                        get_patient_notes();
                    }}
                    patient={patient}
                    appointment_id={this_appointment_id}
                />

                <PatientPlansModal
                    isOpen={modalPatientPlans}
                    onClose={() => {
                        setModalPatientPlans(false);
                        get_patient_plan_list();
                    }}
                    patient={patient}
                    appointment_id={this_appointment_id}
                />

                <PatientDiagnosisModal
                    isOpen={modalPatientDiagnosis}
                    onClose={() => {
                        setModalPatientDiagnosis(false);
                        get_patient_diagnosis();
                    }}
                    patient={patient}
                    appointment_id={this_appointment_id}
                />

                <VitalSignsModal
                    isOpen={isVitalModalOpen}
                    setIsOpen={setIsVitalModalOpen}
                    patient={patientdata}
                    onClose={() => {
                        setIsVitalModalOpen(false);
                        patient_vitals(); // 👈 call function when modal closes
                    }}
                />
                <PatientMedicalHistoryModal
                    isOpen={modalVisible}
                    onClose={() => {
                        setModalVisible(false);
                        fetchMedicalHistory(); // Call after close
                    }}
                    onUpdate={(updatedTags) => {
                        setModalVisible(false); // Close modal
                        fetchMedicalHistory(); // Call after update
                    }}
                    patient={patient}
                />

                <div className="py-3">
                    <div className="max-w-8xl mx-auto sm:px-6 lg:px-8">
                        <div className="mb-6 rounded-lg">
                            <div className="relative mb-4 flex items-center justify-center pb-0">
                                {/* <div class="ml-auto flex space-x-2">
          <button class="flex items-center px-4 py-2 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50">
            <svg width="17" height="21" viewBox="0 0 17 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M2.92999 0.84375C2.40608 0.84375 1.90363 1.04867 1.53317 1.41343C1.16271 1.77819 0.95459 2.27291 0.95459 2.78876V18.3489C0.95459 18.8647 1.16271 19.3594 1.53317 19.7242C1.90363 20.089 2.40608 20.2939 2.92999 20.2939H14.7824C15.3063 20.2939 15.8088 20.089 16.1792 19.7242C16.5497 19.3594 16.7578 18.8647 16.7578 18.3489V5.13639C16.7577 4.62059 16.5495 4.12595 16.179 3.76127L13.7947 1.41364C13.4243 1.04885 12.922 0.84386 12.3981 0.84375H2.92999ZM13.0421 9.395C13.1364 9.30529 13.2117 9.19798 13.2634 9.07933C13.3152 8.96068 13.3424 8.83307 13.3436 8.70394C13.3447 8.57481 13.3197 8.44675 13.2701 8.32723C13.2204 8.20772 13.1471 8.09913 13.0543 8.00782C12.9616 7.91651 12.8513 7.8443 12.7299 7.7954C12.6085 7.7465 12.4785 7.7219 12.3473 7.72302C12.2162 7.72414 12.0866 7.75097 11.9661 7.80194C11.8456 7.8529 11.7366 7.92699 11.6455 8.01988L7.45565 12.1462L6.05805 10.7701C5.87176 10.593 5.62227 10.495 5.3633 10.4972C5.10432 10.4994 4.8566 10.6017 4.67347 10.782C4.49034 10.9623 4.38646 11.2062 4.38421 11.4612C4.38196 11.7162 4.48152 11.9618 4.66144 12.1453L6.68623 14.1399C6.78712 14.2393 6.90692 14.3181 7.03876 14.3719C7.17062 14.4257 7.31194 14.4534 7.45466 14.4534C7.59738 14.4534 7.7387 14.4257 7.87055 14.3719C8.0024 14.3181 8.1222 14.2393 8.22309 14.1399L13.0421 9.395Z" fill="#CD4949"/>
</svg>
      &nbsp;      Finish Later and Checkout
          </button>
          <button class="flex items-center px-4 py-2 text-sm text-white bg-green-700 rounded hover:bg-green-600">
            <svg width="16" height="19" viewBox="0 0 16 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M2.34941 0.555908C1.8562 0.555908 1.38319 0.748823 1.03443 1.09221C0.685675 1.4356 0.489746 1.90134 0.489746 2.38697V17.0354C0.489746 17.5211 0.685675 17.9868 1.03443 18.3302C1.38319 18.6736 1.8562 18.8665 2.34941 18.8665H13.5074C14.0006 18.8665 14.4737 18.6736 14.8224 18.3302C15.1712 17.9868 15.3671 17.5211 15.3671 17.0354V4.59705C15.367 4.11147 15.171 3.64581 14.8222 3.3025L12.5776 1.09241C12.2289 0.748994 11.756 0.556012 11.2628 0.555908H2.34941ZM11.8691 8.60616C11.9579 8.5217 12.0287 8.42068 12.0774 8.30898C12.1262 8.19728 12.1518 8.07715 12.1529 7.95558C12.154 7.83402 12.1304 7.71346 12.0837 7.60095C12.0369 7.48843 11.9679 7.38621 11.8806 7.30025C11.7933 7.21429 11.6895 7.14631 11.5752 7.10027C11.4609 7.05424 11.3385 7.03108 11.215 7.03213C11.0915 7.03319 10.9695 7.05844 10.8561 7.10643C10.7426 7.15441 10.64 7.22415 10.5543 7.3116L6.60992 11.1962L5.2942 9.90071C5.11883 9.73394 4.88395 9.64166 4.64015 9.64375C4.39635 9.64583 4.16314 9.74212 3.99074 9.91187C3.81834 10.0816 3.72055 10.3112 3.71843 10.5513C3.71632 10.7913 3.81004 11.0226 3.97941 11.1953L5.88557 13.073C5.98056 13.1666 6.09333 13.2408 6.21746 13.2915C6.34158 13.3421 6.47463 13.3682 6.60899 13.3682C6.74334 13.3682 6.87639 13.3421 7.00051 13.2915C7.12464 13.2408 7.23741 13.1666 7.3324 13.073L11.8691 8.60616Z" fill="white"/>
</svg> 
       &nbsp;     Close and Checkout
          </button>
        </div> */}
                            </div>

                            <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
                                <div class="bg-white p-8 lg:col-span-10">
                                    <div
                                        className={`head-text absolute left-1/2 -translate-x-1/2 transform text-lg font-bold uppercase ${getdisabled ? "text-[#666666]" : "font-light-blue"}`}
                                    >
                                        <b> Patient Visit Form </b>
                                    </div>
                                    <span
                                        class={`font-700 mt-5 text-lg ${getdisabled ? "text-[#666666]" : "font-light-blue"}`}
                                    >
                                        {patient.first_name} {patient.last_name}{" "}
                                        <span class="font-light-grey text-sm font-medium">
                                            {patient.age}, {patient.gender}
                                        </span>
                                    </span>
                                    <div>
                                        <div class="border-box ml-1 mt-2 grid grid-cols-1 gap-2 text-sm text-gray-600 md:grid-cols-2 lg:grid-cols-5">
                                            <div class="font-light-grey">
                                                <span
                                                    class={`font-semibold ${getdisabled ? "text-[#666666]" : "font-light-blue"}`}
                                                >
                                                    Patient ID:
                                                </span>{" "}
                                                <br /> {patient.patient_id}
                                            </div>
                                            <div class="font-light-grey border-box">
                                                <span
                                                    class={`font-semibold ${getdisabled ? "text-[#666666]" : "font-light-blue"}`}
                                                >
                                                    Date of Birth:
                                                </span>{" "}
                                                <br />{" "}
                                                {new Date(
                                                    patient.dob,
                                                ).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </div>
                                            <div class="font-light-grey border-box">
                                                <span
                                                    class={`font-semibold ${getdisabled ? "text-[#666666]" : "font-light-blue"}`}
                                                >
                                                    Mobile Number:
                                                </span>{" "}
                                                <br /> {patient.phone}
                                            </div>
                                            <div class="font-light-grey border-box">
                                                <span
                                                    class={`font-semibold ${getdisabled ? "text-[#666666]" : "font-light-blue"}`}
                                                >
                                                    Home Address:
                                                </span>{" "}
                                                <br /> {patient.address}
                                            </div>
                                        </div>
                                        <div class="border-box ml-1 mt-10 flex flex-col items-start">
                                            <span class="flex items-center gap-1">
                                                <p
                                                    class={`text-sm font-semibold text-[#429ABF] ${getdisabled ? "text-[#666666]" : "text-[#429ABF]"}`}
                                                >
                                                    Medical History
                                                </p>
                                                <button
                                                    onClick={() =>
                                                        setModalVisible(true)
                                                    }
                                                    disabled={getdisabled}
                                                    className={` ${getdisabled ? "text-[#666666]" : "text-[#429ABF]"} `}
                                                >
                                                    <svg
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 16 16"
                                                        fill="currentColor"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path d="M8 15C4.14 15 1 11.86 1 8C1 4.14 4.14 1 8 1C11.86 1 15 4.14 15 8C15 11.86 11.86 15 8 15ZM8 2C4.69 2 2 4.69 2 8C2 11.31 4.69 14 8 14C11.31 14 14 11.31 14 8C14 4.69 11.31 2 8 2Z" />
                                                        <path d="M8 11.5C7.72 11.5 7.5 11.28 7.5 11V5C7.5 4.72 7.72 4.5 8 4.5C8.28 4.5 8.5 4.72 8.5 5V11C8.5 11.28 8.28 11.5 8 11.5Z" />
                                                        <path d="M11 8.5H5C4.72 8.5 4.5 8.28 4.5 8C4.5 7.72 4.72 7.5 5 7.5H11C11.28 7.5 11.5 7.72 11.5 8C11.5 8.28 11.28 8.5 11 8.5Z" />
                                                    </svg>
                                                </button>
                                            </span>

                                            <span>
                                                <p className="text-sm font-extrabold text-[#696969]">
                                                    {Array.isArray(diseases)
                                                        ? diseases.join(", ")
                                                        : diseases}
                                                </p>
                                            </span>
                                        </div>

                                        {/* <div class="mt-4  flex flex-col items-start ml-1">
         <span class="flex items-center gap-1">
        <p class="text-sm font-semibold text-gray-800 font-light-blue">Vital Signs and Measurements</p><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8 15C4.14 15 1 11.86 1 8C1 4.14 4.14 1 8 1C11.86 1 15 4.14 15 8C15 11.86 11.86 15 8 15ZM8 2C4.69 2 2 4.69 2 8C2 11.31 4.69 14 8 14C11.31 14 14 11.31 14 8C14 4.69 11.31 2 8 2Z" fill="#429ABF"/>
<path d="M8 11.5C7.72 11.5 7.5 11.28 7.5 11V5C7.5 4.72 7.72 4.5 8 4.5C8.28 4.5 8.5 4.72 8.5 5V11C8.5 11.28 8.28 11.5 8 11.5Z" fill="#429ABF"/>
<path d="M11 8.5H5C4.72 8.5 4.5 8.28 4.5 8C4.5 7.72 4.72 7.5 5 7.5H11C11.28 7.5 11.5 7.72 11.5 8C11.5 8.28 11.28 8.5 11 8.5Z" fill="#429ABF"/>
</svg>
</span>
<span>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-sm text-gray-600 mt-1 font-light-grey">
          <div><span class="font-semibold ">Blood Pressure:</span> <br /> 110/70</div>
          <div><span class="font-semibold ">Heart Rate:</span> <br /> 108</div>
          <div><span class="font-semibold ">O2 Saturation:</span> <br /> 98%</div>
          <div><span class="font-semibold ">Temperature:</span> <br /> 38°C</div>
          <div><span class="font-semibold ">Height:</span> <br /> 5'11"</div>
          <div><span class="font-semibold ">Weight:</span> <br /> 68 kg</div>
        </div>
        </span>
      </div> */}
                                    </div>
                                </div>
                                <div class="flex flex-col gap-2 bg-white p-3 text-center lg:col-span-2">
                                    <p class="text-[12px] text-xs font-black text-green-700">
                                        SAVE BUTTONS
                                    </p>

                                    {patientvisitform === "open" && (
                                        <div className="mt-4 flex flex-col gap-2">
                                            <button
                                                className="mx-auto flex w-[10rem] flex-row rounded bg-green-700 p-1 text-left text-sm text-white hover:bg-green-800"
                                                onClick={() => {
                                                    setSelectedAction(
                                                        "sign_off",
                                                    );
                                                    handleSignOffAndClose();
                                                    setIsBillingModalOpen(true);
                                                }}
                                            >
                                                <svg
                                                    width="16"
                                                    height="19"
                                                    className="mt-1"
                                                    viewBox="0 0 16 26"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M2.38654 0.270809C1.8972 0.270809 1.42791 0.462205 1.0819 0.802893C0.735891 1.14358 0.541504 1.60565 0.541504 2.08746V16.6206C0.541504 17.1024 0.735891 17.5645 1.0819 17.9052C1.42791 18.2459 1.8972 18.4373 2.38654 18.4373H13.4567C13.9461 18.4373 14.4153 18.2459 14.7614 17.9052C15.1074 17.5645 15.3018 17.1024 15.3018 16.6206V4.28015C15.3017 3.79838 15.1072 3.33639 14.7612 2.99578L12.5342 0.803087C12.1883 0.462376 11.7191 0.270912 11.2298 0.270809H2.38654Z"
                                                        fill="white"
                                                    />
                                                </svg>
                                                &nbsp;
                                                <span className="text-[0.7rem]">
                                                    Sign Off & Close Form
                                                </span>
                                            </button>

                                            <button
                                                className="mx-auto flex w-[10rem] flex-row rounded border-2 border-green-700 bg-white p-1 text-left text-sm text-green-700 hover:bg-[#FFF9E6]"
                                                onClick={() => {
                                                    setSelectedAction(
                                                        "save_and_finish",
                                                    );
                                                    handleSaveAndFinishLater();
                                                    setIsBillingModalOpen(true);
                                                }}
                                            >
                                                <svg
                                                    width="16"
                                                    height="19"
                                                    viewBox="0 0 18 18"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M9 0C4.05 0 0 4.05 0 9C0 13.95 4.05 18 9 18C13.95 18 18 13.95 18 9C18 4.05 13.95 0 9 0ZM12.78 12.78L8.1 9.9V4.5H9.45V9.18L13.5 11.61L12.78 12.78Z"
                                                        fill="#1B7E45"
                                                    />
                                                </svg>
                                                &nbsp;
                                                <span className="text-[0.7rem]">
                                                    Save & Finish Later
                                                </span>
                                            </button>
                                        </div>
                                    )}

                                    {patientvisitform === "closed" && (
                                        <div className="mt-4 flex flex-col gap-2">
                                            <button
                                                className="mx-auto flex w-[10rem] flex-row rounded bg-green-700 p-1 text-left text-sm text-white"
                                                onClick={() => {
                                                    setmodifyaskModalOpen(true);
                                                }}
                                            >
                                                <svg
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M13 3C13.2549 3.00028 13.5 3.09788 13.6854 3.27285C13.8707 3.44782 13.9822 3.68695 13.9972 3.94139C14.0121 4.19584 13.9293 4.44638 13.7657 4.64183C13.6021 4.83729 13.3701 4.9629 13.117 4.993L13 5H5V19H19V11C19.0003 10.7451 19.0979 10.5 19.2728 10.3146C19.4478 10.1293 19.687 10.0178 19.9414 10.0028C20.1958 9.98789 20.4464 10.0707 20.6418 10.2343C20.8373 10.3979 20.9629 10.6299 20.993 10.883L21 11V19C21.0002 19.5046 20.8096 19.9906 20.4665 20.3605C20.1234 20.7305 19.6532 20.9572 19.15 20.995L19 21H5C4.49542 21.0002 4.00943 20.8096 3.63945 20.4665C3.26947 20.1234 3.04284 19.6532 3.005 19.15L3 19V5C2.99984 4.49542 3.19041 4.00943 3.5335 3.63945C3.87659 3.26947 4.34684 3.04284 4.85 3.005L5 3H13ZM19.243 3.343C19.423 3.16365 19.6644 3.05953 19.9184 3.05177C20.1723 3.04402 20.4197 3.13322 20.6103 3.30125C20.8008 3.46928 20.9203 3.70355 20.9444 3.95647C20.9685 4.2094 20.8954 4.46201 20.74 4.663L20.657 4.758L10.757 14.657C10.577 14.8363 10.3356 14.9405 10.0816 14.9482C9.82767 14.956 9.58029 14.8668 9.38972 14.6988C9.19916 14.5307 9.07969 14.2964 9.0556 14.0435C9.03151 13.7906 9.10459 13.538 9.26 13.337L9.343 13.243L19.243 3.343Z"
                                                        fill="white"
                                                    />
                                                </svg>
                                                &nbsp;
                                                <span className="text-[0.7rem]">
                                                    Modify Record
                                                </span>
                                            </button>
                                        </div>
                                    )}

                                    {patientvisitform === "modify" && (
                                        <div className="mt-4 flex flex-col gap-2">
                                            <button
                                                className="mx-auto flex w-[10rem] flex-row rounded bg-green-700 p-1 text-left text-sm text-white hover:bg-green-800"
                                                onClick={() => {
                                                    setmodifydone();
                                                }}
                                            >
                                                <svg
                                                    width="16"
                                                    height="26"
                                                    viewBox="0 0 16 26"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        fill-rule="evenodd"
                                                        clip-rule="evenodd"
                                                        d="M2.3499 0.555912C1.85669 0.555912 1.38367 0.748826 1.03492 1.09222C0.686163 1.43561 0.490234 1.90134 0.490234 2.38697V17.0354C0.490234 17.5211 0.686163 17.9868 1.03492 18.3302C1.38367 18.6736 1.85669 18.8665 2.3499 18.8665H13.5079C14.0011 18.8665 14.4741 18.6736 14.8229 18.3302C15.1717 17.9868 15.3676 17.5211 15.3676 17.0354V4.59706C15.3675 4.11147 15.1715 3.64581 14.8227 3.3025L12.5781 1.09241C12.2294 0.748998 11.7565 0.556016 11.2633 0.555912H2.3499ZM11.8695 8.60616C11.9584 8.52171 12.0292 8.42068 12.0779 8.30898C12.1267 8.19729 12.1523 8.07715 12.1534 7.95559C12.1545 7.83402 12.1309 7.71347 12.0842 7.60095C12.0374 7.48844 11.9684 7.38621 11.8811 7.30025C11.7938 7.21429 11.6899 7.14631 11.5757 7.10028C11.4614 7.05424 11.339 7.03108 11.2155 7.03214C11.092 7.03319 10.97 7.05845 10.8566 7.10643C10.7431 7.15441 10.6405 7.22416 10.5548 7.3116L6.6104 11.1962L5.29469 9.90072C5.11932 9.73395 4.88444 9.64167 4.64064 9.64375C4.39684 9.64584 4.16363 9.74212 3.99123 9.91187C3.81883 10.0816 3.72104 10.3112 3.71892 10.5513C3.7168 10.7913 3.81053 11.0226 3.9799 11.1953L5.88606 13.073C5.98105 13.1666 6.09382 13.2408 6.21795 13.2915C6.34207 13.3421 6.47512 13.3682 6.60947 13.3682C6.74383 13.3682 6.87688 13.3421 7.001 13.2915C7.12513 13.2408 7.2379 13.1666 7.33289 13.073L11.8695 8.60616Z"
                                                        fill="white"
                                                    />
                                                </svg>
                                                &nbsp;
                                                <span className="text-[0.7rem]">
                                                    Save Modification
                                                </span>
                                            </button>
                                        </div>
                                    )}

                                    <hr />
                                    <h3 class="font-full-blue text-[12px] text-xs font-extrabold">
                                        PRINT BUTTONS
                                    </h3>
                                    <a
                                        href={route("prescriptions.print", {
                                            id: patient?.patient_id,
                                            app_id: this_appointment_id,
                                        })}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="print-buttons mx-auto flex w-[10rem] flex-row rounded p-1 px-2 text-left text-sm text-white"
                                    >
                                        <svg
                                            width="20"
                                            className="mr-2"
                                            height="18"
                                            viewBox="0 0 20 18"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M15.5002 4.18498H4.50016V0.518311H15.5002V4.18498ZM15.5002 9.22664C15.7599 9.22664 15.9777 9.13864 16.1537 8.96264C16.3297 8.78664 16.4174 8.56909 16.4168 8.30998C16.4162 8.05087 16.3282 7.83331 16.1528 7.65731C15.9774 7.48131 15.7599 7.39331 15.5002 7.39331C15.2404 7.39331 15.0229 7.48131 14.8475 7.65731C14.6721 7.83331 14.5841 8.05087 14.5835 8.30998C14.5829 8.56909 14.6709 8.78695 14.8475 8.96356C15.0241 9.14017 15.2417 9.22787 15.5002 9.22664ZM13.6668 15.185V11.5183H6.3335V15.185H13.6668ZM15.5002 17.0183H4.50016V13.3516H0.833496V7.85164C0.833496 7.07248 1.10086 6.41951 1.63558 5.89273C2.1703 5.36595 2.81961 5.10225 3.5835 5.10164H16.4168C17.196 5.10164 17.8493 5.36534 18.3767 5.89273C18.9041 6.42012 19.1674 7.07309 19.1668 7.85164V13.3516H15.5002V17.0183Z"
                                                fill="white"
                                            />
                                        </svg>
                                        <span className="text-[0.7rem]">
                                            Prescription
                                        </span>
                                    </a>

                                    <a
                                        href={route("laboratory.print", {
                                            id: patient?.patient_id,
                                            app_id: this_appointment_id,
                                        })}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="print-buttons mx-auto flex w-[10rem] flex-row rounded p-1 px-2 text-left text-sm text-white"
                                    >
                                        <svg
                                            width="20"
                                            className="mr-2"
                                            height="18"
                                            viewBox="0 0 20 18"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M15.5002 4.18498H4.50016V0.518311H15.5002V4.18498ZM15.5002 9.22664C15.7599 9.22664 15.9777 9.13864 16.1537 8.96264C16.3297 8.78664 16.4174 8.56909 16.4168 8.30998C16.4162 8.05087 16.3282 7.83331 16.1528 7.65731C15.9774 7.48131 15.7599 7.39331 15.5002 7.39331C15.2404 7.39331 15.0229 7.48131 14.8475 7.65731C14.6721 7.83331 14.5841 8.05087 14.5835 8.30998C14.5829 8.56909 14.6709 8.78695 14.8475 8.96356C15.0241 9.14017 15.2417 9.22787 15.5002 9.22664ZM13.6668 15.185V11.5183H6.3335V15.185H13.6668ZM15.5002 17.0183H4.50016V13.3516H0.833496V7.85164C0.833496 7.07248 1.10086 6.41951 1.63558 5.89273C2.1703 5.36595 2.81961 5.10225 3.5835 5.10164H16.4168C17.196 5.10164 17.8493 5.36534 18.3767 5.89273C18.9041 6.42012 19.1674 7.07309 19.1668 7.85164V13.3516H15.5002V17.0183Z"
                                                fill="white"
                                            />
                                        </svg>
                                        <span className="text-[0.7rem]">
                                            Laboratory Request
                                        </span>
                                    </a>

                                    <button
                                        class="print-buttons mx-auto flex w-[10rem] flex-row rounded p-1 px-2 text-sm text-white"
                                        onClick={handleMedicalCertificate}
                                    >
                                        <svg
                                            width="20"
                                            class="mr-2"
                                            height="18"
                                            viewBox="0 0 20 18"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M15.5002 4.18498H4.50016V0.518311H15.5002V4.18498ZM15.5002 9.22664C15.7599 9.22664 15.9777 9.13864 16.1537 8.96264C16.3297 8.78664 16.4174 8.56909 16.4168 8.30998C16.4162 8.05087 16.3282 7.83331 16.1528 7.65731C15.9774 7.48131 15.7599 7.39331 15.5002 7.39331C15.2404 7.39331 15.0229 7.48131 14.8475 7.65731C14.6721 7.83331 14.5841 8.05087 14.5835 8.30998C14.5829 8.56909 14.6709 8.78695 14.8475 8.96356C15.0241 9.14017 15.2417 9.22787 15.5002 9.22664ZM13.6668 15.185V11.5183H6.3335V15.185H13.6668ZM15.5002 17.0183H4.50016V13.3516H0.833496V7.85164C0.833496 7.07248 1.10086 6.41951 1.63558 5.89273C2.1703 5.36595 2.81961 5.10225 3.5835 5.10164H16.4168C17.196 5.10164 17.8493 5.36534 18.3767 5.89273C18.9041 6.42012 19.1674 7.07309 19.1668 7.85164V13.3516H15.5002V17.0183Z"
                                                fill="white"
                                            />
                                        </svg>
                                        &nbsp;
                                        <span class="text-[0.7rem]">
                                            Medical Certificate
                                        </span>
                                    </button>
                                </div>
                            </div>

                            <div
                                style={{ backgroundColor: "#F1F2F5" }}
                                class="my-10 rounded p-10"
                            >
                                <div className="mb-5 bg-white p-5 shadow-[0px_4px_4px_0px_#00000040]">
                                    <div
                                        className={`flex justify-between py-1 text-sm ${getdisabled ? "text-[#666666]" : "text-[#FF8000]"}`}
                                    >
                                        -{" "}
                                        {new Date(
                                            patient.updated_at,
                                        ).toLocaleString("en-US", {
                                            month: "long",
                                            day: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: true,
                                        })}
                                        <span
                                            className={`${getdisabled ? "text-[#666666]" : "text-[#FF8000]"}`}
                                        >
                                            Visit Form ID #{this_appointment_id}
                                        </span>
                                    </div>
                                    <hr />
                                    <div class="ml-1 mt-4 flex flex-col items-start">
                                        <span class="flex items-center gap-1">
                                            <p
                                                class={`text-sm font-semibold ${getdisabled ? "text-[#666666]" : "font-light-blue"}`}
                                            >
                                                Vital Signs and Measurements
                                            </p>
                                            <button
                                                onClick={() =>
                                                    openVitalForm(patient)
                                                }
                                                disabled={getdisabled}
                                                className={` ${getdisabled ? "text-[#666666]" : "text-[#429ABF]"} `}
                                            >
                                                <svg
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 16 16"
                                                    fill="currentColor"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path d="M8 15C4.14 15 1 11.86 1 8C1 4.14 4.14 1 8 1C11.86 1 15 4.14 15 8C15 11.86 11.86 15 8 15ZM8 2C4.69 2 2 4.69 2 8C2 11.31 4.69 14 8 14C11.31 14 14 11.31 14 8C14 4.69 11.31 2 8 2Z" />
                                                    <path d="M8 11.5C7.72 11.5 7.5 11.28 7.5 11V5C7.5 4.72 7.72 4.5 8 4.5C8.28 4.5 8.5 4.72 8.5 5V11C8.5 11.28 8.28 11.5 8 11.5Z" />
                                                    <path d="M11 8.5H5C4.72 8.5 4.5 8.28 4.5 8C4.5 7.72 4.72 7.5 5 7.5H11C11.28 7.5 11.5 7.72 11.5 8C11.5 8.28 11.28 8.5 11 8.5Z" />
                                                </svg>
                                            </button>
                                        </span>
                                        {/* <span> */}
                                        {/* <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-sm mt-1 font-light-grey w-full px-3" style={{color: '#696969'}}>
  <div><span class="font-semibold">Blood Pressure</span><br /><p>110/70</p></div>
  <div><span class="font-semibold">Heart Rate</span><br />108</div>
  <div><span class="font-semibold">O2 Saturation</span><br />98%</div>
  <div><span class="font-semibold">Temperature</span><br />38°C</div>
  <div><span class="font-semibold">Height</span><br />5'11"</div>
  <div><span class="font-semibold">Weight</span><br />68 kg</div>
</div> */}

                                        <table className="m-3 mt-1 w-[90%] table-fixed text-sm text-gray-600">
                                            <thead>
                                                <tr>
                                                    <th className="w-1/6 text-left font-semibold">
                                                        Blood Pressure
                                                    </th>
                                                    <th className="w-1/6 text-left font-semibold">
                                                        Heart Rate
                                                    </th>
                                                    <th className="w-1/6 text-left font-semibold">
                                                        O2 Saturation
                                                    </th>
                                                    <th className="w-1/6 text-left font-semibold">
                                                        Temperature
                                                    </th>
                                                    <th className="w-1/6 text-left font-semibold">
                                                        Height
                                                    </th>
                                                    <th className="w-1/6 text-left font-semibold">
                                                        Weight
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="w-1/6">
                                                        {
                                                            data.blood_systolic_pressure
                                                        }
                                                        /
                                                        {
                                                            data.blood_diastolic_pressure
                                                        }
                                                    </td>
                                                    <td className="w-1/6">
                                                        {" "}
                                                        {data?.heart_rate}
                                                    </td>
                                                    <td className="w-1/6">
                                                        {data?.o2saturation}%
                                                    </td>
                                                    <td className="w-1/6">
                                                        {data?.temperature}°C
                                                    </td>
                                                    <td className="w-1/6">
                                                        {data?.height_ft}'
                                                        {data.height_in}"
                                                    </td>
                                                    <td className="w-1/6">
                                                        {data?.weight} kg
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        {/* </span> */}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
                                    {/* Left Side: Chief Complaint & Physical Exam in 2-column subgrid */}
                                    <div className="flex flex-col gap-5 md:col-span-3">
                                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                            {/* Chief Complaint */}
                                            <div className="rounded bg-white p-2 shadow-[0px_4px_4px_0px_#00000040]">
                                                <div class="flex justify-between">
                                                    <h2
                                                        className={`m-2 text-[14px] font-semibold uppercase ${getdisabled ? "text-[#666666]" : "font-light-blue"}`}
                                                    >
                                                        Chief Complaint
                                                    </h2>
                                                    <button
                                                        className="p-1"
                                                        onClick={
                                                            openChiefComplaintModal
                                                        }
                                                        disabled={getdisabled}
                                                    >
                                                        <svg
                                                            width="25"
                                                            height="25"
                                                            viewBox="0 0 25 25"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M11.8143 3.63428C12.0267 3.63451 12.231 3.71422 12.3854 3.85713C12.5399 4.00004 12.6328 4.19535 12.6453 4.40317C12.6577 4.61099 12.5887 4.81562 12.4524 4.97526C12.3161 5.13489 12.1227 5.23749 11.9118 5.26208L11.8143 5.26779H5.14762V16.7024H16.8143V10.1683C16.8145 9.96017 16.8959 9.75994 17.0417 9.60856C17.1875 9.45719 17.3868 9.36609 17.5988 9.35389C17.8108 9.34169 18.0196 9.40931 18.1825 9.54292C18.3454 9.67653 18.45 9.86606 18.4751 10.0728L18.481 10.1683V16.7024C18.4811 17.1145 18.3223 17.5115 18.0364 17.8136C17.7505 18.1158 17.3586 18.3009 16.9393 18.3318L16.8143 18.3359H5.14762C4.72714 18.3361 4.32215 18.1804 4.01383 17.9002C3.70552 17.62 3.51666 17.2359 3.48512 16.8249L3.48096 16.7024V5.26779C3.48082 4.85568 3.63963 4.45874 3.92554 4.15655C4.21145 3.85437 4.60333 3.66927 5.02262 3.63836L5.14762 3.63428H11.8143ZM17.0168 3.91443C17.1668 3.76794 17.368 3.6829 17.5796 3.67656C17.7912 3.67023 17.9974 3.74308 18.1562 3.88032C18.315 4.01757 18.4145 4.20891 18.4346 4.41549C18.4547 4.62206 18.3938 4.82838 18.2643 4.99255L18.1951 5.07014L9.94512 13.1552C9.79516 13.3017 9.59393 13.3868 9.3823 13.3931C9.17068 13.3994 8.96453 13.3266 8.80573 13.1893C8.64692 13.0521 8.54737 12.8607 8.52729 12.6542C8.50721 12.4476 8.56811 12.2413 8.69762 12.0771L8.76679 12.0003L17.0168 3.91443Z"
                                                                fill="#666666"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                                <hr />
                                                <div className="mb-0 flex items-center justify-end"></div>
                                                <div className="p-4">
                                                    <div className="card-screen">
                                                        <ul>
                                                            {ChiefComplaints.map(
                                                                (
                                                                    item,
                                                                    index,
                                                                ) => (
                                                                    <li
                                                                        key={
                                                                            index
                                                                        }
                                                                    >
                                                                        {" "}
                                                                        &gt;
                                                                        {
                                                                            item.chief_complaint
                                                                        }
                                                                    </li>
                                                                ),
                                                            )}
                                                        </ul>
                                                    </div>
                                                    <textarea
                                                        className={`mt-2 w-full resize-none rounded p-2 ${getdisabled ? "border-black bg-[#CDCDCD] text-white" : "border border-[#429ABF] focus:border-[#A7D3E8] focus:outline-none focus:ring-0"}`}
                                                        rows="2"
                                                        onChange={(e) =>
                                                            setaddchiefcomplaint(
                                                                e.target.value,
                                                            )
                                                        }
                                                        value={
                                                            addchiefcomplaint
                                                        }
                                                        disabled={getdisabled}
                                                        onKeyDown={(e) => {
                                                            if (
                                                                e.key ===
                                                                    "Enter" &&
                                                                !e.shiftKey &&
                                                                !getdisabled
                                                            ) {
                                                                e.preventDefault(); // Prevents newline from being added
                                                                AddChiefComplaint();
                                                            }
                                                        }}
                                                    />

                                                    <button
                                                        className={`mt-2 w-full rounded px-3 py-1 text-sm text-white ${getdisabled ? "border border-black bg-[#666666] text-white" : "print-buttons save-button"}`}
                                                        onClick={
                                                            AddChiefComplaint
                                                        }
                                                    >
                                                        + Add Note
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Physical Exam */}
                                            <div className="rounded bg-white p-2 shadow-[0px_4px_4px_0px_#00000040]">
                                                <div class="flex justify-between">
                                                    <span
                                                        className={`font-600 m-2 text-[14px] font-semibold uppercase ${getdisabled ? "text-[#666666]" : "font-light-blue"}`}
                                                    >
                                                        Physical Exam
                                                    </span>
                                                    <button
                                                        className="p-1"
                                                        onClick={
                                                            openPhysicalExamModal
                                                        }
                                                        disabled={getdisabled}
                                                    >
                                                        <svg
                                                            width="25"
                                                            height="25"
                                                            viewBox="0 0 25 25"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M11.8143 3.63428C12.0267 3.63451 12.231 3.71422 12.3854 3.85713C12.5399 4.00004 12.6328 4.19535 12.6453 4.40317C12.6577 4.61099 12.5887 4.81562 12.4524 4.97526C12.3161 5.13489 12.1227 5.23749 11.9118 5.26208L11.8143 5.26779H5.14762V16.7024H16.8143V10.1683C16.8145 9.96017 16.8959 9.75994 17.0417 9.60856C17.1875 9.45719 17.3868 9.36609 17.5988 9.35389C17.8108 9.34169 18.0196 9.40931 18.1825 9.54292C18.3454 9.67653 18.45 9.86606 18.4751 10.0728L18.481 10.1683V16.7024C18.4811 17.1145 18.3223 17.5115 18.0364 17.8136C17.7505 18.1158 17.3586 18.3009 16.9393 18.3318L16.8143 18.3359H5.14762C4.72714 18.3361 4.32215 18.1804 4.01383 17.9002C3.70552 17.62 3.51666 17.2359 3.48512 16.8249L3.48096 16.7024V5.26779C3.48082 4.85568 3.63963 4.45874 3.92554 4.15655C4.21145 3.85437 4.60333 3.66927 5.02262 3.63836L5.14762 3.63428H11.8143ZM17.0168 3.91443C17.1668 3.76794 17.368 3.6829 17.5796 3.67656C17.7912 3.67023 17.9974 3.74308 18.1562 3.88032C18.315 4.01757 18.4145 4.20891 18.4346 4.41549C18.4547 4.62206 18.3938 4.82838 18.2643 4.99255L18.1951 5.07014L9.94512 13.1552C9.79516 13.3017 9.59393 13.3868 9.3823 13.3931C9.17068 13.3994 8.96453 13.3266 8.80573 13.1893C8.64692 13.0521 8.54737 12.8607 8.52729 12.6542C8.50721 12.4476 8.56811 12.2413 8.69762 12.0771L8.76679 12.0003L17.0168 3.91443Z"
                                                                fill="#666666"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                                <hr />
                                                <div className="flex items-center justify-end"></div>
                                                <div className="p-4">
                                                    <div className="card-screen">
                                                        <ul>
                                                            {PhysicalExam.map(
                                                                (
                                                                    item,
                                                                    index,
                                                                ) => (
                                                                    <li
                                                                        key={
                                                                            index
                                                                        }
                                                                    >
                                                                        {" "}
                                                                        &gt;
                                                                        {
                                                                            item.physical_exam
                                                                        }
                                                                    </li>
                                                                ),
                                                            )}
                                                        </ul>
                                                    </div>
                                                    <textarea
                                                        className={`mt-2 w-full resize-none rounded p-2 ${getdisabled ? "border border-black bg-[#CDCDCD] text-white" : "border border-[#429ABF] focus:border-[#A7D3E8] focus:outline-none focus:ring-0"}`}
                                                        rows="2"
                                                        value={addphysicalexam}
                                                        onChange={(e) =>
                                                            setaddphysicalexam(
                                                                e.target.value,
                                                            )
                                                        }
                                                        disabled={getdisabled}
                                                        onKeyDown={(e) => {
                                                            if (
                                                                e.key ===
                                                                    "Enter" &&
                                                                !e.shiftKey &&
                                                                !getdisabled
                                                            ) {
                                                                e.preventDefault(); // Prevents newline from being added
                                                                AddPhysicalExam();
                                                            }
                                                        }}
                                                    />
                                                    <button
                                                        className={`mt-2 w-full rounded px-3 py-1 text-sm text-white ${getdisabled ? "border border-black bg-[#666666] text-white" : "print-buttons save-button"}`}
                                                        onClick={
                                                            AddPhysicalExam
                                                        }
                                                    >
                                                        + Add Note
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom Row: Plan, Diagnosis, Notes (below both Chief + Physical) */}
                                        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
                                            {/* Plan */}
                                            <div className="flex min-h-[300px] flex-col justify-between rounded bg-white p-4 shadow-[0px_4px_4px_0px_#00000040]">
                                                <div class="mb-10">
                                                    {" "}
                                                    {/* Content block */}
                                                    <div className="flex justify-between">
                                                        <h2
                                                            className={`mb-2 font-semibold ${getdisabled ? "text-[#666666]" : "font-light-blue"}`}
                                                        >
                                                            PLAN
                                                        </h2>
                                                        <div class="flex justify-between">
                                                            <button
                                                                className={`plan-buttons-1 mx-2 rounded text-center text-white md:text-[12px] lg:w-[129px] lg:text-[12px] ${getdisabled ? "border border-black bg-[#666666] text-white" : "bg-[#FF8000] hover:bg-[#E67300]"}`}
                                                                style={{
                                                                    Width: "79px",
                                                                    height: "1.5rem",
                                                                }}
                                                                onClick={() =>
                                                                    setIsMedicalCertificateOpen(
                                                                        true,
                                                                    )
                                                                }
                                                                disabled={
                                                                    getdisabled
                                                                }
                                                            >
                                                                Medical
                                                                Certificate
                                                            </button>
                                                            <button
                                                                className={`plan-buttons-2 rounded px-2 text-center text-white lg:w-[90px] lg:text-[12px] ${getdisabled ? "bg-[#666666]" : "bg-[#FF8000] hover:bg-[#E67300]"}`}
                                                                disabled={
                                                                    getdisabled
                                                                }
                                                                style={{
                                                                    height: "1.5rem",
                                                                }}
                                                                onClick={() =>
                                                                    setIsLabRequestOpen(
                                                                        true,
                                                                    )
                                                                }
                                                            >
                                                                Lab Request
                                                            </button>

                                                            <button
                                                                class=""
                                                                onClick={
                                                                    OpenPatientPlanModal
                                                                }
                                                                disabled={
                                                                    getdisabled
                                                                }
                                                            >
                                                                <svg
                                                                    width="25"
                                                                    height="19"
                                                                    viewBox="0 0 25 25"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <path
                                                                        d="M11.8143 3.63428C12.0267 3.63451 12.231 3.71422 12.3854 3.85713C12.5399 4.00004 12.6328 4.19535 12.6453 4.40317C12.6577 4.61099 12.5887 4.81562 12.4524 4.97526C12.3161 5.13489 12.1227 5.23749 11.9118 5.26208L11.8143 5.26779H5.14762V16.7024H16.8143V10.1683C16.8145 9.96017 16.8959 9.75994 17.0417 9.60856C17.1875 9.45719 17.3868 9.36609 17.5988 9.35389C17.8108 9.34169 18.0196 9.40931 18.1825 9.54292C18.3454 9.67653 18.45 9.86606 18.4751 10.0728L18.481 10.1683V16.7024C18.4811 17.1145 18.3223 17.5115 18.0364 17.8136C17.7505 18.1158 17.3586 18.3009 16.9393 18.3318L16.8143 18.3359H5.14762C4.72714 18.3361 4.32215 18.1804 4.01383 17.9002C3.70552 17.62 3.51666 17.2359 3.48512 16.8249L3.48096 16.7024V5.26779C3.48082 4.85568 3.63963 4.45874 3.92554 4.15655C4.21145 3.85437 4.60333 3.66927 5.02262 3.63836L5.14762 3.63428H11.8143ZM17.0168 3.91443C17.1668 3.76794 17.368 3.6829 17.5796 3.67656C17.7912 3.67023 17.9974 3.74308 18.1562 3.88032C18.315 4.01757 18.4145 4.20891 18.4346 4.41549C18.4547 4.62206 18.3938 4.82838 18.2643 4.99255L18.1951 5.07014L9.94512 13.1552C9.79516 13.3017 9.59393 13.3868 9.3823 13.3931C9.17068 13.3994 8.96453 13.3266 8.80573 13.1893C8.64692 13.0521 8.54737 12.8607 8.52729 12.6542C8.50721 12.4476 8.56811 12.2413 8.69762 12.0771L8.76679 12.0003L17.0168 3.91443Z"
                                                                        fill="#666666"
                                                                    />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <hr />
                                                    <div className="mb-2 flex items-center justify-end"></div>
                                                    <div className="card-screen text-sm">
                                                        <ul className="font-poopins text-[14px] font-normal text-[black]">
                                                            {patientplans?.map(
                                                                (
                                                                    item,
                                                                    index,
                                                                ) => (
                                                                    <li
                                                                        key={
                                                                            index
                                                                        }
                                                                    >
                                                                        &gt;{" "}
                                                                        {
                                                                            item.plan
                                                                        }
                                                                    </li>
                                                                ),
                                                            )}
                                                        </ul>
                                                        {labRequests.length >
                                                            0 && (
                                                            <div className="font-poopins mt-2 text-[14px] font-normal text-[#429ABF]">
                                                                <span
                                                                    className={`${getdisabled ? "text-black" : ""}`}
                                                                >
                                                                    For:
                                                                </span>
                                                                <div
                                                                    className={`block ${getdisabled ? "text-black" : ""}`}
                                                                >
                                                                    &gt;{" "}
                                                                    {labRequests.join(
                                                                        ", ",
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                        {setPatientCertificateAck && (
                                                            <div
                                                                className={`font-poopins mt-2 text-[14px] font-normal ${getdisabled ? "text-black" : "text-[#429ABF]"}`}
                                                            >
                                                                Issued Medical
                                                                Certificate
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Select at bottom */}

                                                <hr />
                                                <div className="relative w-full">
                                                    <input
                                                        type="text"
                                                        value={inputValue}
                                                        onChange={(e) => {
                                                            setInputValue(
                                                                e.target.value,
                                                            );
                                                            setShowDropdown(
                                                                true,
                                                            );
                                                        }}
                                                        onClick={(e) => {
                                                            setInputValue(
                                                                e.target.value,
                                                            );
                                                            setShowDropdown(
                                                                true,
                                                            );
                                                        }}
                                                        disabled={getdisabled}
                                                        onFocus={() =>
                                                            setShowDropdown(
                                                                true,
                                                            )
                                                        }
                                                        className="w-full rounded border border-[#666666] bg-white px-3 py-2 pr-8 text-sm focus:outline-none"
                                                        placeholder="Enter or select a plan"
                                                    />
                                                    <div className="pointer-events-none absolute right-2 top-2.5 text-gray-500">
                                                        ▼
                                                    </div>

                                                    {showDropdown && (
                                                        <ul
                                                            ref={wrapperRef}
                                                            className="pointer-events-auto absolute z-[999999] mt-1 max-h-[130px] w-full overflow-auto rounded border bg-white text-sm shadow-md"
                                                        >
                                                            {filteredPlans.map(
                                                                (
                                                                    item,
                                                                    index,
                                                                ) => (
                                                                    <li
                                                                        key={
                                                                            index
                                                                        }
                                                                        onClick={() => {
                                                                            handleSelect(
                                                                                item.name,
                                                                            );
                                                                        }}
                                                                        className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                                                                    >
                                                                        {
                                                                            item.name
                                                                        }
                                                                    </li>
                                                                ),
                                                            )}

                                                            {inputNotInList && (
                                                                <li
                                                                    onClick={() => {
                                                                        console.log(
                                                                            "Clicked:",
                                                                            inputValue,
                                                                        );
                                                                        handleSelect(
                                                                            inputValue,
                                                                        );
                                                                    }}
                                                                    className="cursor-pointer px-3 py-2 text-blue-600 hover:bg-gray-100"
                                                                >
                                                                    {inputValue}
                                                                </li>
                                                            )}
                                                        </ul>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Diagnosis */}
                                            <div className="rounded bg-white p-4 shadow-[0px_4px_4px_0px_#00000040]">
                                                <div class="flex justify-between">
                                                    <h2
                                                        className={`mb-2 font-semibold uppercase ${getdisabled ? "text-[#666666]" : "font-light-blue"}`}
                                                    >
                                                        DIAGNOSIS
                                                    </h2>
                                                    <button
                                                        className=""
                                                        onClick={
                                                            OpenPatientDiagnosisModal
                                                        }
                                                        disabled={getdisabled}
                                                    >
                                                        <svg
                                                            width="25"
                                                            height="19"
                                                            viewBox="0 0 25 25"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M11.8143 3.63428C12.0267 3.63451 12.231 3.71422 12.3854 3.85713C12.5399 4.00004 12.6328 4.19535 12.6453 4.40317C12.6577 4.61099 12.5887 4.81562 12.4524 4.97526C12.3161 5.13489 12.1227 5.23749 11.9118 5.26208L11.8143 5.26779H5.14762V16.7024H16.8143V10.1683C16.8145 9.96017 16.8959 9.75994 17.0417 9.60856C17.1875 9.45719 17.3868 9.36609 17.5988 9.35389C17.8108 9.34169 18.0196 9.40931 18.1825 9.54292C18.3454 9.67653 18.45 9.86606 18.4751 10.0728L18.481 10.1683V16.7024C18.4811 17.1145 18.3223 17.5115 18.0364 17.8136C17.7505 18.1158 17.3586 18.3009 16.9393 18.3318L16.8143 18.3359H5.14762C4.72714 18.3361 4.32215 18.1804 4.01383 17.9002C3.70552 17.62 3.51666 17.2359 3.48512 16.8249L3.48096 16.7024V5.26779C3.48082 4.85568 3.63963 4.45874 3.92554 4.15655C4.21145 3.85437 4.60333 3.66927 5.02262 3.63836L5.14762 3.63428H11.8143ZM17.0168 3.91443C17.1668 3.76794 17.368 3.6829 17.5796 3.67656C17.7912 3.67023 17.9974 3.74308 18.1562 3.88032C18.315 4.01757 18.4145 4.20891 18.4346 4.41549C18.4547 4.62206 18.3938 4.82838 18.2643 4.99255L18.1951 5.07014L9.94512 13.1552C9.79516 13.3017 9.59393 13.3868 9.3823 13.3931C9.17068 13.3994 8.96453 13.3266 8.80573 13.1893C8.64692 13.0521 8.54737 12.8607 8.52729 12.6542C8.50721 12.4476 8.56811 12.2413 8.69762 12.0771L8.76679 12.0003L17.0168 3.91443Z"
                                                                fill="#666666"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                                <hr />
                                                <div className="mb-2 flex items-center justify-end"></div>
                                                <div class="card-screen">
                                                    <ul>
                                                        {patientdiagnosislist?.map(
                                                            (item, index) => (
                                                                <li key={index}>
                                                                    {" "}
                                                                    &gt;
                                                                    {
                                                                        item.diagnosis
                                                                    }
                                                                </li>
                                                            ),
                                                        )}
                                                    </ul>
                                                </div>
                                                <textarea
                                                    className={`w-full resize-none rounded border p-2 ${getdisabled ? "border border-black bg-[#CDCDCD] text-white" : "border border-[#429ABF] focus:border-[#A7D3E8] focus:outline-none focus:ring-0"}`}
                                                    defaultValue=""
                                                    value={patientdiagnosis}
                                                    onChange={(e) =>
                                                        setaddpatientdiagnosis(
                                                            e.target.value,
                                                        )
                                                    }
                                                    disabled={getdisabled}
                                                    onKeyDown={(e) => {
                                                        if (
                                                            e.key === "Enter" &&
                                                            !e.shiftKey &&
                                                            !getdisabled
                                                        ) {
                                                            e.preventDefault(); // Prevents newline from being added
                                                            AddPatientdiagnosis();
                                                        }
                                                    }}
                                                />
                                                <button
                                                    className={`mt-2 w-full rounded px-3 py-1 text-sm text-white ${getdisabled ? "border border-black bg-[#666666] text-white" : "print-buttons save-button"}`}
                                                    onClick={
                                                        AddPatientdiagnosis
                                                    }
                                                >
                                                    + Add Note
                                                </button>
                                            </div>

                                            {/* Notes */}
                                            <div className="rounded bg-white p-4 shadow-[0px_4px_4px_0px_#00000040]">
                                                <div class="flex justify-between">
                                                    <h2
                                                        className={`mb-2 font-semibold uppercase ${getdisabled ? "text-[#666666]" : "font-light-blue"}`}
                                                    >
                                                        NOTES
                                                    </h2>
                                                    <button
                                                        className=""
                                                        onClick={
                                                            OpenPatientModal
                                                        }
                                                        disabled={getdisabled}
                                                    >
                                                        <svg
                                                            width="25"
                                                            height="19"
                                                            viewBox="0 0 25 25"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M11.8143 3.63428C12.0267 3.63451 12.231 3.71422 12.3854 3.85713C12.5399 4.00004 12.6328 4.19535 12.6453 4.40317C12.6577 4.61099 12.5887 4.81562 12.4524 4.97526C12.3161 5.13489 12.1227 5.23749 11.9118 5.26208L11.8143 5.26779H5.14762V16.7024H16.8143V10.1683C16.8145 9.96017 16.8959 9.75994 17.0417 9.60856C17.1875 9.45719 17.3868 9.36609 17.5988 9.35389C17.8108 9.34169 18.0196 9.40931 18.1825 9.54292C18.3454 9.67653 18.45 9.86606 18.4751 10.0728L18.481 10.1683V16.7024C18.4811 17.1145 18.3223 17.5115 18.0364 17.8136C17.7505 18.1158 17.3586 18.3009 16.9393 18.3318L16.8143 18.3359H5.14762C4.72714 18.3361 4.32215 18.1804 4.01383 17.9002C3.70552 17.62 3.51666 17.2359 3.48512 16.8249L3.48096 16.7024V5.26779C3.48082 4.85568 3.63963 4.45874 3.92554 4.15655C4.21145 3.85437 4.60333 3.66927 5.02262 3.63836L5.14762 3.63428H11.8143ZM17.0168 3.91443C17.1668 3.76794 17.368 3.6829 17.5796 3.67656C17.7912 3.67023 17.9974 3.74308 18.1562 3.88032C18.315 4.01757 18.4145 4.20891 18.4346 4.41549C18.4547 4.62206 18.3938 4.82838 18.2643 4.99255L18.1951 5.07014L9.94512 13.1552C9.79516 13.3017 9.59393 13.3868 9.3823 13.3931C9.17068 13.3994 8.96453 13.3266 8.80573 13.1893C8.64692 13.0521 8.54737 12.8607 8.52729 12.6542C8.50721 12.4476 8.56811 12.2413 8.69762 12.0771L8.76679 12.0003L17.0168 3.91443Z"
                                                                fill="#666666"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                                <hr />
                                                <div className="mb-2 flex items-center justify-end"></div>
                                                <div class="card-screen">
                                                    <ul>
                                                        {PatientNotes.map(
                                                            (item, index) => (
                                                                <li key={index}>
                                                                    {" "}
                                                                    &gt;
                                                                    {item.note}
                                                                </li>
                                                            ),
                                                        )}
                                                    </ul>
                                                </div>
                                                <textarea
                                                    className={`w-full resize-none rounded border p-2 ${getdisabled ? "border border-black bg-[#CDCDCD] text-white" : "border border-[#429ABF] focus:border-[#A7D3E8] focus:outline-none focus:ring-0"}`}
                                                    defaultValue=""
                                                    value={addpatientnotes}
                                                    onChange={(e) =>
                                                        setaddpatientnotes(
                                                            e.target.value,
                                                        )
                                                    }
                                                    disabled={getdisabled}
                                                    onKeyDown={(e) => {
                                                        if (
                                                            e.key === "Enter" &&
                                                            !e.shiftKey &&
                                                            !getdisabled
                                                        ) {
                                                            e.preventDefault(); // Prevents newline from being added
                                                            AddPatientnotes();
                                                        }
                                                    }}
                                                />
                                                <button
                                                    className={`mt-2 w-full rounded px-3 py-1 text-sm text-white ${getdisabled ? "border border-black bg-[#666666] text-white" : "print-buttons save-button"}`}
                                                    onClick={AddPatientnotes}
                                                >
                                                    + Add Note
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Side: Prescription (Full Height) */}
                                    <div className="rounded bg-white p-2 shadow-[0px_4px_4px_0px_#00000040]">
                                        <div className="flex justify-between">
                                            <h2
                                                className={`m-2 text-[14px] font-semibold uppercase ${getdisabled ? "text-[#666666]" : "font-light-blue"}`}
                                            >
                                                Prescription
                                            </h2>
                                            <div className="flex flex-row">
                                                <div className="flex justify-between">
                                                    <button
                                                        className={`m-auto h-[26px] w-[7.5rem] rounded text-center text-white ${getdisabled ? "bg-[#666666]" : "bg-[#FF8000] hover:bg-[#E67300]"}`}
                                                        disabled={getdisabled}
                                                        onClick={
                                                            openAddPrescription
                                                        }
                                                        style={{
                                                            backgroundColor: "",
                                                        }}
                                                    >
                                                        <span className="text-[0.8rem]">
                                                            Add Prescription
                                                        </span>
                                                    </button>
                                                    <button
                                                        className="p-1"
                                                        onClick={
                                                            openEditPrescription
                                                        }
                                                        disabled={getdisabled}
                                                    >
                                                        <svg
                                                            width="25"
                                                            height="25"
                                                            viewBox="0 0 25 25"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M11.8143 3.63428C12.0267 3.63451 12.231 3.71422 12.3854 3.85713C12.5399 4.00004 12.6328 4.19535 12.6453 4.40317C12.6577 4.61099 12.5887 4.81562 12.4524 4.97526C12.3161 5.13489 12.1227 5.23749 11.9118 5.26208L11.8143 5.26779H5.14762V16.7024H16.8143V10.1683C16.8145 9.96017 16.8959 9.75994 17.0417 9.60856C17.1875 9.45719 17.3868 9.36609 17.5988 9.35389C17.8108 9.34169 18.0196 9.40931 18.1825 9.54292C18.3454 9.67653 18.45 9.86606 18.4751 10.0728L18.481 10.1683V16.7024C18.4811 17.1145 18.3223 17.5115 18.0364 17.8136C17.7505 18.1158 17.3586 18.3009 16.9393 18.3318L16.8143 18.3359H5.14762C4.72714 18.3361 4.32215 18.1804 4.01383 17.9002C3.70552 17.62 3.51666 17.2359 3.48512 16.8249L3.48096 16.7024V5.26779C3.48082 4.85568 3.63963 4.45874 3.92554 4.15655C4.21145 3.85437 4.60333 3.66927 5.02262 3.63836L5.14762 3.63428H11.8143ZM17.0168 3.91443C17.1668 3.76794 17.368 3.6829 17.5796 3.67656C17.7912 3.67023 17.9974 3.74308 18.1562 3.88032C18.315 4.01757 18.4145 4.20891 18.4346 4.41549C18.4547 4.62206 18.3938 4.82838 18.2643 4.99255L18.1951 5.07014L9.94512 13.1552C9.79516 13.3017 9.59393 13.3868 9.3823 13.3931C9.17068 13.3994 8.96453 13.3266 8.80573 13.1893C8.64692 13.0521 8.54737 12.8607 8.52729 12.6542C8.50721 12.4476 8.56811 12.2413 8.69762 12.0771L8.76679 12.0003L17.0168 3.91443Z"
                                                                fill="#666666"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <hr />

                                        {/* 👇 Constrain scrollable area height here */}
                                        <div className="mt-5 max-h-[700px] overflow-auto pr-2">
                                            <ul
                                                className={`list-decimal space-y-1 pl-6 text-sm text-gray-700 ${getdisabled ? "text-[#666666]" : "font-light-blue"}`}
                                            >
                                                {patientprescription.map(
                                                    (item) => (
                                                        <li key={item.id}>
                                                            <div className="mt-5 flex w-full justify-between">
                                                                <span>
                                                                    {
                                                                        item.medication
                                                                    }
                                                                </span>
                                                                <span
                                                                    className={` ${getdisabled ? "text-[#666666]" : "text-[#FF8000]"}`}
                                                                >
                                                                    #{" "}
                                                                    {
                                                                        item.amount
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div className="mt-1">
                                                                <span className="text-gray-500">
                                                                    {
                                                                        item.dosage
                                                                    }
                                                                    &nbsp;
                                                                    {
                                                                        item.frequency
                                                                    }
                                                                    &nbsp;
                                                                    {item.days}
                                                                    {item.duration && (
                                                                        <span>
                                                                            for{" "}
                                                                            {
                                                                                item.duration
                                                                            }{" "}
                                                                            days
                                                                        </span>
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Laboratory Section (Takes remaining space) */}
                                    <div className="mt-5 gap-2 rounded bg-white p-4 shadow shadow-[0px_4px_4px_0px_#00000040] md:col-span-3">
                                        <h2
                                            className={`font-semibold ${getdisabled ? "text-[#666666]" : "font-light-blue"}`}
                                        >
                                            Laboratory Values
                                        </h2>

                                        {error && (
                                            <div className="mb-4 text-red-500">
                                                {error}
                                            </div>
                                        )}

                                        <div className="mb-4 flex gap-2">
                                            <div className="relative w-[272px]">
                                                <input
                                                    className="textboxs w-full rounded border p-2 font-poppins text-[14px] font-normal text-[#999999]"
                                                    type="text"
                                                    value={searchTerm}
                                                    onChange={(e) => {
                                                        setSearchTerm(
                                                            e.target.value,
                                                        );
                                                        setShowList(true);
                                                    }}
                                                    onClick={(e) => {
                                                        setSearchTerm(
                                                            e.target.value,
                                                        );
                                                        setShowList(true);
                                                    }}
                                                    onFocus={() =>
                                                        setShowList(true)
                                                    }
                                                    placeholder="Select or type test"
                                                    disabled={getdisabled}
                                                />
                                                <div className="pointer-events-none absolute right-2 top-2.5 text-gray-500">
                                                    ▼
                                                </div>
                                                {showList && (
                                                    <ul
                                                        ref={wrapperRef}
                                                        className="absolute z-[9999] mt-1 max-h-48 w-full overflow-y-auto rounded border bg-white shadow"
                                                    >
                                                        {filteredOptions?.length >
                                                        0 ? (
                                                            filteredOptions.map(
                                                                (
                                                                    test,
                                                                    index,
                                                                ) => (
                                                                    <li
                                                                        key={
                                                                            index
                                                                        }
                                                                        onClick={() =>
                                                                            handleSelectw(
                                                                                test,
                                                                            )
                                                                        }
                                                                        className="cursor-pointer p-2 font-poppins text-[14px] font-normal text-[#999999] hover:bg-gray-200"
                                                                    >
                                                                        {test}
                                                                    </li>
                                                                ),
                                                            )
                                                        ) : (
                                                            <li
                                                                onClick={() =>
                                                                    handleSelectw(
                                                                        searchTerm,
                                                                    )
                                                                }
                                                                className="cursor-pointer p-2 text-blue-600 hover:bg-gray-200"
                                                            >
                                                                {searchTerm}
                                                            </li>
                                                        )}
                                                    </ul>
                                                )}
                                            </div>
                                            <div className="relative w-[403px]">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="Enter Result Here"
                                                    className="textboxs w-full rounded pr-24"
                                                    value={testResult}
                                                    onChange={(e) =>
                                                        setTestResult(
                                                            e.target.value,
                                                        )
                                                    }
                                                    disabled={getdisabled}
                                                />
                                                <button
                                                    className={`absolute bottom-0 right-0 top-0 rounded-r px-3 px-8 font-poppins text-[14px] font-normal text-white ${getdisabled ? "bg-[#666666]" : "print-buttons save-button"}`}
                                                    onClick={handleAddTest}
                                                    disabled={getdisabled}
                                                >
                                                    {loading
                                                        ? "Loading..."
                                                        : "Submit"}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="relative max-h-[300px] overflow-hidden rounded border">
                                            <div className="overflow-x-auto">
                                                <div className="max-h-[300px] overflow-y-auto">
                                                    <table className="w-full table-auto text-sm">
                                                        <thead className="sticky top-0 z-10 w-full bg-[#E9F9FF] text-[#666666]">
                                                            <tr>
                                                                {" "}
                                                                <th className="sticky left-0 z-20 whitespace-nowrap bg-[#E9F9FF] p-2 text-left font-poppins text-[14px] font-normal text-[#666666]">
                                                                    Test Name
                                                                </th>
                                                                {testDates.map(
                                                                    (
                                                                        date,
                                                                        index,
                                                                    ) => (
                                                                        <th
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="whitespace-nowrap p-2 text-center font-poppins text-[14px] font-normal text-[#666666]"
                                                                            style={{
                                                                                minWidth:
                                                                                    "120px",
                                                                            }}
                                                                        >
                                                                            {index ===
                                                                            0
                                                                                ? "TODAY"
                                                                                : date}
                                                                        </th>
                                                                    ),
                                                                )}
                                                                <th></th>
                                                                {/* <th className="p-2 whitespace-nowrap sticky right-0 bg-[#E9F9FF] z-20 text-center">ACTIONS</th> */}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {loading ? (
                                                                <tr>
                                                                    <td
                                                                        colSpan={
                                                                            testDates.length +
                                                                            2
                                                                        }
                                                                        className="p-4 text-center font-poppins text-[14px] font-normal text-[#666666]"
                                                                    >
                                                                        Loading...
                                                                    </td>
                                                                </tr>
                                                            ) : labTests.length ===
                                                              0 ? (
                                                                <tr>
                                                                    <td
                                                                        colSpan={
                                                                            testDates.length +
                                                                            2
                                                                        }
                                                                        className="p-4 text-center font-poppins text-[14px] font-normal text-[#666666]"
                                                                    >
                                                                        No
                                                                        laboratory
                                                                        tests
                                                                        found
                                                                    </td>
                                                                </tr>
                                                            ) : (
                                                                labTests.map(
                                                                    (
                                                                        test,
                                                                        index,
                                                                    ) => (
                                                                        <tr
                                                                            key={
                                                                                index
                                                                            }
                                                                            className={
                                                                                index %
                                                                                    2 ===
                                                                                0
                                                                                    ? "bg-white"
                                                                                    : "bg-[#F1F2F5]"
                                                                            }
                                                                        >
                                                                            <td className="sticky left-0 whitespace-nowrap bg-inherit p-2 text-left font-poppins text-[14px] font-normal text-[#666666]">
                                                                                {
                                                                                    test.test_name
                                                                                }
                                                                            </td>
                                                                            {testDates.map(
                                                                                (
                                                                                    date,
                                                                                    dateIndex,
                                                                                ) => (
                                                                                    <td
                                                                                        key={
                                                                                            dateIndex
                                                                                        }
                                                                                        className="whitespace-nowrap p-2 text-center font-poppins text-[14px] font-normal text-[#666666]"
                                                                                        style={{
                                                                                            minWidth:
                                                                                                "120px",
                                                                                        }}
                                                                                    >
                                                                                        {test
                                                                                            .values[
                                                                                            date
                                                                                        ] ||
                                                                                            "-"}
                                                                                    </td>
                                                                                ),
                                                                            )}
                                                                            <td className="sticky right-0 whitespace-nowrap bg-inherit p-2 text-center">
                                                                                <button
                                                                                    onClick={() =>
                                                                                        openEditLabOpen(
                                                                                            test,
                                                                                        )
                                                                                    }
                                                                                    disabled={
                                                                                        getdisabled
                                                                                    }
                                                                                >
                                                                                    <svg
                                                                                        width="25"
                                                                                        height="25"
                                                                                        className="m-auto cursor-pointer"
                                                                                        viewBox="0 0 25 25"
                                                                                        fill="none"
                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                    >
                                                                                        <path
                                                                                            d="M11.8143 3.63428C12.0267 3.63451 12.231 3.71422 12.3854 3.85713C12.5399 4.00004 12.6328 4.19535 12.6453 4.40317C12.6577 4.61099 12.5887 4.81562 12.4524 4.97526C12.3161 5.13489 12.1227 5.23749 11.9118 5.26208L11.8143 5.26779H5.14762V16.7024H16.8143V10.1683C16.8145 9.96017 16.8959 9.75994 17.0417 9.60856C17.1875 9.45719 17.3868 9.36609 17.5988 9.35389C17.8108 9.34169 18.0196 9.40931 18.1825 9.54292C18.3454 9.67653 18.45 9.86606 18.4751 10.0728L18.481 10.1683V16.7024C18.4811 17.1145 18.3223 17.5115 18.0364 17.8136C17.7505 18.1158 17.3586 18.3009 16.9393 18.3318L16.8143 18.3359H5.14762C4.72714 18.3361 4.32215 18.1804 4.01383 17.9002C3.70552 17.62 3.51666 17.2359 3.48512 16.8249L3.48096 16.7024V5.26779C3.48082 4.85568 3.63963 4.45874 3.92554 4.15655C4.21145 3.85437 4.60333 3.66927 5.02262 3.63836L5.14762 3.63428H11.8143ZM17.0168 3.91443C17.1668 3.76794 17.368 3.6829 17.5796 3.67656C17.7912 3.67023 17.9974 3.74308 18.1562 3.88032C18.315 4.01757 18.4145 4.20891 18.4346 4.41549C18.4547 4.62206 18.3938 4.82838 18.2643 4.99255L18.1951 5.07014L9.94512 13.1552C9.79516 13.3017 9.59393 13.3868 9.3823 13.3931C9.17068 13.3994 8.96453 13.3266 8.80573 13.1893C8.64692 13.0521 8.54737 12.8607 8.52729 12.6542C8.50721 12.4476 8.56811 12.2413 8.69762 12.0771L8.76679 12.0003L17.0168 3.91443Z"
                                                                                            fill="#666666"
                                                                                        />
                                                                                    </svg>
                                                                                </button>
                                                                            </td>
                                                                        </tr>
                                                                    ),
                                                                )
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Previous Records Section (Same width as prescription) */}
                                    <div className="mt-5 overflow-y-auto rounded bg-white p-4 shadow shadow-[0_4px_4px_0_#00000040]">
                                        <h2 className="mb-4 font-semibold text-gray-700">
                                            Previous Records
                                        </h2>

                                        <div className="relative pl-10">
                                            {/* Vertical center line */}
                                            <div className="absolute bottom-0 left-[28px] top-0 z-0 w-[2px] bg-gray-300"></div>

                                            {/* Entry 1 - May 9, 2025 */}
                                            {medicalrecords.map(
                                                (record, index) => (
                                                    <div
                                                        key={index}
                                                        className="relative z-10 mb-6 flex items-start"
                                                    >
                                                        <div className="absolute left-[-28px] top-0 flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                                                            <svg
                                                                width="24"
                                                                height="24"
                                                                viewBox="0 0 32 32"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <rect
                                                                    width="32"
                                                                    height="32"
                                                                    rx="16"
                                                                    fill="#EAECF0"
                                                                />
                                                                <g clipPath="url(#clip0_1040_900)">
                                                                    <path
                                                                        d="M17.7267 9.72671C17.4734 9.47337 17.1334 9.33337 16.7801 9.33337H12.0001C11.2667 9.33337 10.6667 9.93337 10.6667 10.6667V21.3334C10.6667 22.0667 11.2601 22.6667 11.9934 22.6667H20.0001C20.7334 22.6667 21.3334 22.0667 21.3334 21.3334V13.8867C21.3334 13.5334 21.1934 13.1934 20.9401 12.9467L17.7267 9.72671ZM18.0001 20H14.0001C13.6334 20 13.3334 19.7 13.3334 19.3334C13.3334 18.9667 13.6334 18.6667 14.0001 18.6667H18.0001C18.3667 18.6667 18.6667 18.9667 18.6667 19.3334C18.6667 19.7 18.3667 20 18.0001 20ZM18.0001 17.3334H14.0001C13.6334 17.3334 13.3334 17.0334 13.3334 16.6667C13.3334 16.3 13.6334 16 14.0001 16H18.0001C18.3667 16 18.6667 16.3 18.6667 16.6667C18.6667 17.0334 18.3667 17.3334 18.0001 17.3334ZM16.6667 13.3334V10.3334L20.3334 14H17.3334C16.9667 14 16.6667 13.7 16.6667 13.3334Z"
                                                                        fill={`${getdisabled ? "#666666" : "#429ABF"}`}
                                                                    />
                                                                </g>
                                                            </svg>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-light-grey ml-10 text-sm">
                                                                {new Date(
                                                                    record.date,
                                                                ).toLocaleDateString(
                                                                    "en-US",
                                                                    {
                                                                        month: "long",
                                                                        day: "2-digit",
                                                                        year: "numeric",
                                                                    },
                                                                )}
                                                            </span>
                                                            <span
                                                                className={`ml-10 text-sm ${getdisabled ? "text-[#666666]" : "font-light-blue"}`}
                                                            >
                                                                {
                                                                    record.diagnosis
                                                                }
                                                            </span>
                                                            <span
                                                                className={`ml-10 text-sm ${getdisabled ? "text-[#666666]" : "text-[#FF8000]"}`}
                                                            >
                                                                {
                                                                    record.doctor_first_name
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {modifyaskModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="relative w-[90%] max-w-md rounded-lg bg-white p-6 shadow-lg">
                            <button
                                className="absolute right-3 top-2 text-xl font-bold text-gray-500 hover:text-red-500"
                                onClick={() => setmodifyaskModalOpen(false)}
                            >
                                ×
                            </button>

                            <h3 className="mb-2 text-center text-lg font-semibold text-gray-800">
                                Modify Record?
                            </h3>
                            <hr className="mb-4" />

                            <p className="mb-6 text-sm text-gray-700">
                                This record has already been closed by{" "}
                                <strong>Dr. {doctor_name}</strong>. Are you sure
                                you want to modify it?
                            </p>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    className="cancel-button rounded bg-gray-300 px-4 py-2 text-gray-800"
                                    onClick={() => setmodifyaskModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="save-button rounded bg-[#429ABF] px-4 py-2 text-white disabled:opacity-50"
                                    disabled={processing}
                                    onClick={() =>
                                        changepatientvisitformstatus()
                                    }
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </AuthenticatedLayout>
            <MedicalCertificateModal
                isOpen={isMedicalCertificateOpen}
                onClose={() => {
                    setIsMedicalCertificateOpen(false);
                    get_patient_certificate_ack();
                }}
                patientInfo={patient}
                diagnosis={patientdiagnosislist}
                appointment_id={this_appointment_id}
            />
            <AddLaboratoryRequest
                isOpen={isLabRequestOpen}
                onClose={() => setIsLabRequestOpen(false)}
                patient={patient}
                onLabRequestsUpdate={fetchLabRequests}
                appointment_id={this_appointment_id}
            />

            {/* Add the Billing Modal */}
            <BillingModal
                isOpen={isBillingModalOpen}
                setIsOpen={setIsBillingModalOpen}
                patient={props.patient}
                isCompleted={true}
                appointmentId={this_appointment_id}
                onClose={handleBillingModalClose}
                ForBillingStatus={handleSaveAndFinishLater}
                statuss={statusset}
            />
        </>
    );
}
