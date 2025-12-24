import React, { useState } from "react";
import MedicalHistoryButton from "./MedicalHistoryButton";
import VitalSignsButton from "./VitalSignsButton";
import SignPatientVisitFormModal from "../modals/SignPatientVisitFormModal";
import { route } from "ziggy-js";
import useVitals from "@/hooks/useVitals";
import { Loader2Icon } from "lucide-react";
import { CircleCheckIcon } from "lucide-react";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";

export default function PatientSummaryPanel({
    appointmentId,
    patientVisitRecord,
    patient,
    setPatient,
    medicalCertificate,
    labRequest,
    prescriptions,
    appointmentIsClosed,
    isSaved,
    medicalHistory: initialMedicalHistory,
    saving,
    handleSaveForm,
    closing,
    setClosing,
}) {
    const [medicalHistory, setMedicalHistory] = useState(initialMedicalHistory);
    const [currentTab, setCurrentTab] = useState("medicalHistory");
    const [signFormModalOpen, setSignFormModalOpen] = useState(false);
    const [reopening, setReopening] = useState(false);

    function handleReopenForm() {
        router.post(
            route("patientVisitRecords.reopen", { id: patientVisitRecord.id }),
            {},
            {
                onStart() {
                    setReopening(true);
                },
                onFinish() {
                    setReopening(false);
                },
                preserveScroll: true,
                preserveState: false,
                onError: (errors) => {
                    console.error(errors);
                    toast.error("Failed to Re-open Patient Visit Form");
                },
            },
        );
    }

    function handleCloseForm() {
        const payload = {
            chief_complaints: patientVisitRecord.chief_complaints,
            physical_exams: patientVisitRecord.physical_exams,
            plans: patientVisitRecord.plans,
            diagnoses: patientVisitRecord.diagnoses,
        };

        router.post(
            route("patientVisitRecords.close", { id: patientVisitRecord.id }),
            payload,
            {
                onStart() {
                    setClosing(true);
                },
                onFinish() {
                    setClosing(false);
                },
                preserveState: false,
                preserveScroll: true,
                onError: (errors) => {
                    console.error(errors);
                    toast.error("Failed to Close Patient Visit Form");
                },
            },
        );

        setSignFormModalOpen(false);
    }

    useVitals(({ vitals: updatedVitals }) => {
        if (String(updatedVitals.patient_id) === String(patient?.patient_id)) {
            setPatient((prev) => ({
                ...prev,
                vitals: updatedVitals,
            }));
        }
    });

    const patientFullName = `${patient.first_name} ${patient.middle_initial || ""} ${patient.last_name}`;

    const vitalSigns = [
        {
            id: "blood-pressure",
            label: "Blood Pressure",
            value:
                patient.vitals?.blood_systolic_pressure &&
                patient.vitals?.blood_diastolic_pressure
                    ? `${patient.vitals.blood_systolic_pressure}/${patient.vitals.blood_diastolic_pressure} mmHg`
                    : "",
        },
        {
            id: "temperature",
            label: "Temperature",
            value: patient.vitals?.temperature
                ? parseFloat(patient.vitals.temperature) + " °C"
                : "",
        },
        {
            id: "heart-rate",
            label: "Heart Rate",
            value: patient.vitals?.heart_rate
                ? parseInt(patient.vitals.heart_rate) + " bpm"
                : "",
        },
        {
            id: "height",
            label: "Height",
            value:
                patient.vitals?.height_ft && patient.vitals?.height_in
                    ? `${patient.vitals.height_ft} ft ${patient.vitals.height_in} in`
                    : "",
        },
        {
            id: "o2-saturation",
            label: "O2 Saturation",
            value: patient.vitals?.o2saturation
                ? patient.vitals?.o2saturation + " %"
                : "",
        },
        {
            id: "weight",
            label: "Weight",
            value: patient.vitals?.weight ? patient.vitals?.weight + " kg" : "",
        },
    ];

    return (
        <>
            <div className="grid gap-4 rounded-lg bg-[#FAFAFA] p-2 shadow sm:grid-cols-2 lg:flex">
                <div className="flex flex-1 flex-col divide-y-2 divide-accent-200 rounded-lg bg-white shadow-md sm:col-span-2">
                    <h2 className="px-4 py-2 text-center text-sm font-bold">
                        PATIENT PROFILE
                    </h2>
                    <div className="relative flex items-center gap-4 p-4">
                        <img
                            src="/images/patient.png"
                            alt="patient profile picture"
                            height={80}
                            width={80}
                        />
                        <div className="flex flex-col gap-1">
                            <h4 className="font-bold">{patientFullName}</h4>
                            <p className="text-sm">
                                {patient.age}, {patient.gender}
                            </p>
                        </div>
                        <div className="absolute left-1/2 top-full flex -translate-x-1/2 -translate-y-1/2 items-center rounded-lg bg-accent-200 p-1.5">
                            <button
                                onClick={() => setCurrentTab("medicalHistory")}
                                className={`rounded-md px-3 py-1.5 text-xs font-medium duration-100 ${currentTab === "medicalHistory" ? "bg-accent text-white" : ""}`}
                            >
                                MEDICAL
                            </button>
                            <button
                                onClick={() => setCurrentTab("info")}
                                className={`rounded-md px-3 py-1.5 text-xs font-medium duration-100 ${currentTab === "info" ? "bg-accent text-white" : ""}`}
                            >
                                INFO
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4">
                        <div className="rounded-full bg-accent-200 p-4">
                            <img
                                src="/assets/icons/medical-history-icon.svg"
                                alt="medical history icon"
                                height={24}
                                width={24}
                            />
                        </div>
                        <div className="text-sm">
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold">Medical History</h3>
                                <MedicalHistoryButton
                                    patientId={patient.patient_id}
                                    setMedicalHistory={setMedicalHistory}
                                    medicalHistory={medicalHistory || []}
                                />
                            </div>
                            <p>
                                {medicalHistory?.length > 0
                                    ? medicalHistory.join(", ")
                                    : "No Medical History"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col divide-y-2 divide-accent-200 rounded-lg bg-white text-sm shadow-md">
                    <h2 className="flex items-center justify-center gap-2 px-4 py-2 text-center text-sm font-bold">
                        VS & MEASUREMENTS
                        <VitalSignsButton
                            patient={patient}
                            setPatient={setPatient}
                        />
                    </h2>
                    <div className="grid flex-1 grid-cols-2 gap-4 gap-x-8 p-4">
                        {vitalSigns.map((info) => (
                            <div key={info.id} className="flex gap-3">
                                <div
                                    className={`border-r-4 ${info.value ? "border-accent" : "border-accent-200"}`}
                                />
                                <div className="">
                                    <h4 className="font-semibold">
                                        {info.label}
                                    </h4>
                                    <p className="text-[#666666]">
                                        {info.value || "-"}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col divide-y-2 divide-accent-200 rounded-lg bg-white text-sm shadow-md">
                    <h2 className="flex items-center justify-center gap-2 px-4 py-2 text-center text-sm font-bold">
                        ACTION BUTTONS
                    </h2>
                    <div className="flex flex-1 flex-col justify-center gap-2 p-4">
                        {appointmentIsClosed ? (
                            <button
                                onClick={handleReopenForm}
                                disabled={reopening}
                                className="mx-auto flex w-fit items-center justify-center gap-2 rounded-md bg-[#DEDEDE] px-3 py-2 text-xs font-medium text-accent duration-100 hover:bg-[#DEDEDE]/90 disabled:pointer-events-none disabled:opacity-50"
                            >
                                {reopening ? (
                                    <>
                                        <Loader2Icon
                                            size={14}
                                            className="animate-spin"
                                        />
                                        OPENING...
                                    </>
                                ) : (
                                    "MODIFY RECORD"
                                )}
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => setSignFormModalOpen(true)}
                                    disabled={saving || closing}
                                    className="flex items-center justify-center gap-2 rounded-md bg-accent px-3 py-2 text-xs font-medium text-white duration-100 hover:bg-accent/90 disabled:pointer-events-none disabled:opacity-50"
                                >
                                    {closing ? (
                                        <>
                                            <Loader2Icon
                                                size={14}
                                                className="animate-spin"
                                            />
                                            CLOSING...
                                        </>
                                    ) : (
                                        "SIGN AND CLOSE FORM"
                                    )}
                                </button>
                                <button
                                    onClick={handleSaveForm}
                                    disabled={saving || closing}
                                    className="flex items-center justify-center gap-2 rounded-md bg-[#DEDEDE] px-3 py-2 text-xs font-medium text-accent duration-100 hover:bg-[#DEDEDE]/90 disabled:pointer-events-none disabled:opacity-50"
                                >
                                    {isSaved ? (
                                        <>
                                            <CircleCheckIcon size={14} /> SAVED
                                        </>
                                    ) : saving ? (
                                        <>
                                            <Loader2Icon
                                                size={14}
                                                className="animate-spin"
                                            />
                                            SAVING...
                                        </>
                                    ) : (
                                        "SAVE AND FINISH LATER"
                                    )}
                                </button>
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-2 p-4">
                        <button
                            onClick={() =>
                                window.open(
                                    route("prescriptions.print", {
                                        id: patient.patient_id,
                                        app_id: appointmentId,
                                    }),
                                    "_blank",
                                )
                            }
                            disabled={!prescriptions.length}
                            className="flex flex-1 flex-col items-center gap-1.5 whitespace-nowrap rounded-md bg-accent p-2 duration-200 hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-accent"
                        >
                            <img
                                src="/assets/icons/prescription-icon.svg"
                                alt="prescription icon"
                                className="h-6 w-6 object-contain"
                                width={24}
                                height={24}
                            />
                            <p className="rounded-sm bg-white px-1.5 text-center text-[10px]">
                                PRESCR.
                            </p>
                        </button>
                        <button
                            onClick={() =>
                                window.open(
                                    route("laboratory.print", {
                                        id: patient.patient_id,
                                        app_id: appointmentId,
                                    }),
                                    "_blank",
                                )
                            }
                            disabled={!labRequest.length}
                            className="flex flex-1 flex-col items-center gap-1.5 whitespace-nowrap rounded-md bg-accent p-2 duration-200 hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-accent"
                        >
                            <img
                                src="/assets/icons/lab-icon.svg"
                                alt="lab icon"
                                className="h-6 w-6 object-contain"
                                width={24}
                                height={24}
                            />
                            <p className="rounded-sm bg-white px-1.5 text-center text-[10px]">
                                LAB REQ
                            </p>
                        </button>
                        <button
                            onClick={() =>
                                window.open(
                                    route("medical-certificate.show", {
                                        id: patient.patient_id,
                                        app_id: appointmentId,
                                    }),
                                    "_blank",
                                )
                            }
                            disabled={!medicalCertificate}
                            className="flex flex-1 flex-col items-center gap-1.5 whitespace-nowrap rounded-md bg-accent p-2 duration-200 hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-accent"
                        >
                            <img
                                src="/assets/icons/certificate-icon.svg"
                                alt="certificate icon"
                                className="h-6 w-6 object-contain"
                                width={24}
                                height={24}
                            />
                            <p className="rounded-sm bg-white px-1.5 text-center text-[10px]">
                                MED CERT
                            </p>
                        </button>
                    </div>
                </div>
            </div>

            <SignPatientVisitFormModal
                closeModal={() => setSignFormModalOpen(false)}
                open={signFormModalOpen}
                handleCloseForm={handleCloseForm}
                closing={closing}
            />
        </>
    );
}
