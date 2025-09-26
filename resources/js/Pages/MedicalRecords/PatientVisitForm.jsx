import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PatientSummaryPanel from "@/Components/patient-visit-form/PatientSummaryPanel";

import PrescriptionSection from "@/Components/patient-visit-form/PrescriptionSection";

import PatientEntryCard from "@/Components/patient-visit-form/PatientEntryCard";
import DiagnosticResultsCard from "@/Components/patient-visit-form/DiagnosticResultsCard";

const patientEntries = [
    { id: "chief_complaint", title: "CHIEF COMPLAINT", value: [] },
    { id: "physical_exam", title: "PHYSICAL EXAM", value: [] },
    { id: "plan", title: "PLAN", value: [] },
    { id: "diagnosis", title: "DIAGNOSIS", value: [] },
    {
        id: "medical_records",
        title: "MEDICAL RECORDS",
        value: [],
        hideInput: true,
    },
];

export default function PatientVisitForm({
    patient: initialPatient,
    appointmentId,
    prescriptions,
    medications,
}) {
    const [patient, setPatient] = useState(initialPatient);
    const [patientEntryData, setPatientEntryData] = useState({
        chief_complaint: {
            id: "chief_complaint",
            data: patient.chief_complaint || [],
            input: "",
        },
        physical_exam: {
            id: "physical_exam",
            data: patient.physical_exam || [],
            input: "",
        },
        plan: { id: "plan", data: patient.plan || [], input: "" },
        diagnosis: {
            id: "diagnosis",
            data: patient.diagnosis || [],
            input: "",
        },
        medical_records: {
            id: "medical_records",
            data: patient.medical_records || [],
            input: "",
        },
    });

    return (
        <AuthenticatedLayout pageTitle={"Patient Visit Form"}>
            <div className="mx-auto mt-4 flex w-[90%] max-w-screen-2xl flex-col gap-4">
                <PatientSummaryPanel
                    patient={patient}
                    setPatient={setPatient}
                />
                <div className="flex flex-col gap-4 rounded-lg bg-accent-100 py-2 shadow">
                    <div className="relative flex items-center justify-center">
                        <h2 className="z-20 rounded-md bg-accent-200 p-2 px-4 text-center">
                            Patient Visit Form ID No. 1 . July 16, 2025 2:26 PM
                            . Royce V. Garcia, MD
                        </h2>
                        <div className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 bg-accent-200"></div>
                    </div>
                    <div className="grid gap-2 px-2 sm:grid-cols-6 xl:grid-cols-9">
                        {patientEntries.slice(0, 2).map((entry, index) => (
                            <PatientEntryCard
                                key={entry.id}
                                entry={entry}
                                entryData={patientEntryData[entry.id]}
                                index={index}
                                appointmentId={appointmentId}
                                patientId={patient.patient_id}
                                patientEntryData={patientEntryData}
                                setPatientEntryData={setPatientEntryData}
                            />
                        ))}

                        <PrescriptionSection
                            patient={patient}
                            appointmentId={appointmentId}
                            prescriptions={prescriptions}
                            medications={medications}
                        />

                        {patientEntries.slice(2).map((entry, index) => (
                            <PatientEntryCard
                                entry={entry}
                                key={entry.id}
                                index={index + 2}
                                entryData={patientEntryData[entry.id]}
                                appointmentId={appointmentId}
                                patientId={patient.patient_id}
                                patientEntryData={patientEntryData}
                                setPatientEntryData={setPatientEntryData}
                            />
                        ))}
                    </div>
                    <div className="px-2">
                        <DiagnosticResultsCard />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
