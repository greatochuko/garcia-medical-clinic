import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import MedicalHistoryModal from "@/Components/modals/MedicalHistoryModal";
import VitalsModal from "@/Components/modals/VitalsModal";

export default function PatientVisitForm({
    patient: initialPatient,
    ...props
}) {
    const [currentTab, setCurrentTab] = useState("medicalHistory");
    const [patient, setPatient] = useState(initialPatient);
    const patientFullName = `${patient.first_name} ${patient.middle_initial} ${patient.last_name}`;

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
                ? parseInt(patient.vitals.temperature) + " °C"
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
        <AuthenticatedLayout pageTitle={"Patient Visit Form"}>
            <div className="mx-auto mt-6 flex w-[90%] max-w-screen-2xl flex-col gap-6">
                <div className="flex rounded-lg bg-[#FAFAFA] p-2 shadow">
                    <div className="flex flex-1 flex-col divide-y-2 divide-accent-200 rounded-lg bg-white shadow-md">
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
                                    onClick={() =>
                                        setCurrentTab("medicalHistory")
                                    }
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
                                    <h3 className="font-bold">
                                        Medical History
                                    </h3>
                                    <MedicalHistoryButton
                                        patientId={patient.patient_id}
                                        setPatient={setPatient}
                                        medicalHistory={
                                            patient.medicalHistory || []
                                        }
                                    />
                                </div>
                                <p>
                                    {patient.medicalHistory?.length > 0
                                        ? patient.medicalHistory.join(", ")
                                        : "No Medical History"}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col divide-y-2 divide-accent-200 rounded-lg bg-white text-sm shadow-md">
                        <h2 className="flex items-center gap-2 px-4 py-2 text-center text-sm font-bold">
                            VS & MEASUREMENTS
                            <VitalSignsButton
                                patient={patient}
                                setPatient={setPatient}
                            />
                        </h2>
                        <div className="grid grid-cols-2 gap-4 gap-x-8 p-4">
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function VitalSignsButton({ patient, setPatient }) {
    const [modalOpen, setModalOpen] = useState(false);

    function updateVitals(newVitals) {
        setPatient((prev) => ({ ...prev, vitals: newVitals }));
    }

    return (
        <>
            <button
                onClick={() => setModalOpen(true)}
                className="p-1 duration-100 active:scale-90"
            >
                <img
                    src="/assets/icons/add-one-icon.svg"
                    alt="add one icon "
                    width={18}
                    height={18}
                />
            </button>

            <VitalsModal
                open={modalOpen}
                closeModal={() => setModalOpen(false)}
                patient={patient}
                updateVitals={updateVitals}
            />
        </>
    );
}

function MedicalHistoryButton({ patientId, setPatient, medicalHistory }) {
    const [modalOpen, setModalOpen] = useState(false);

    function updateMedicalHistory(newMedicalHistory) {
        setPatient((prev) => ({ ...prev, medicalHistory: newMedicalHistory }));
    }

    return (
        <>
            <button
                onClick={() => setModalOpen(true)}
                className="p-1 duration-100 active:scale-90"
            >
                <img
                    src="/assets/icons/add-one-icon.svg"
                    alt="add one icon "
                    width={18}
                    height={18}
                />
            </button>

            <MedicalHistoryModal
                open={modalOpen}
                closeModal={() => setModalOpen(false)}
                patientId={patientId}
                updateMedicalHistory={updateMedicalHistory}
                medicalHistory={medicalHistory}
            />
        </>
    );
}
