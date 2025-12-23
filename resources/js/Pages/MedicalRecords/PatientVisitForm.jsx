import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PatientSummaryPanel from "@/Components/patient-visit-form/PatientSummaryPanel";

import PrescriptionSection from "@/Components/patient-visit-form/PrescriptionSection";

import PatientEntryCard from "@/Components/patient-visit-form/PatientEntryCard";
import DiagnosticResultsCard from "@/Components/patient-visit-form/DiagnosticResultsCard";

const patientEntries = [
    { id: "chief_complaints", title: "CHIEF COMPLAINT", value: [] },
    { id: "physical_exams", title: "PHYSICAL EXAM", value: [] },
    { id: "plans", title: "PLAN", value: [] },
    { id: "diagnoses", title: "DIAGNOSIS", value: [] },
    {
        id: "medical_records",
        title: "MEDICAL RECORDS",
        value: [],
        hideInput: true,
    },
];

export default function PatientVisitForm({
    patientVisitRecord: initialRecord,
    medicalRecords,
    inputOptions,
    medicalHistory,
}) {
    const [patientVisitRecord, setPatientVisitRecord] = useState(initialRecord);
    const [patient, setPatient] = useState(patientVisitRecord.patient);

    const medicalCertificate = patientVisitRecord.medical_certificate;

    const laboratoryRequest = patientVisitRecord.lab_request;
    const prescriptions = patientVisitRecord.prescriptions;

    const appointment = patientVisitRecord.appointment;
    const appointmentId = appointment?.id;
    const patientRecordIsClosed = patientVisitRecord.is_closed;

    return (
        <AuthenticatedLayout
            pageTitle={`${patient.first_name} ${patient.last_name} - Patient Visit Form`}
        >
            <div className="mx-auto mt-4 flex w-[90%] max-w-screen-2xl flex-col gap-4">
                <PatientSummaryPanel
                    patientVisitRecord={patientVisitRecord}
                    appointmentId={appointmentId}
                    patient={patient}
                    medicalHistory={medicalHistory}
                    setPatient={setPatient}
                    medicalCertificate={medicalCertificate}
                    labRequest={laboratoryRequest}
                    prescriptions={prescriptions}
                    appointmentIsClosed={patientRecordIsClosed}
                    setPatientVisitRecord={setPatientVisitRecord}
                    medications={prescriptions.map(
                        (pres) => pres.medication.name,
                    )}
                />
                <div className="flex flex-col gap-4 rounded-lg bg-accent-100 py-2 shadow">
                    <div className="relative flex items-center justify-center">
                        <h2 className="z-20 rounded-md bg-accent-200 p-2 px-4 text-center">
                            Patient Visit Form ID No. 1 . July 16, 2025 2:26 PM
                            . Royce V. Garcia, MD
                        </h2>
                        <div className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 bg-accent-200"></div>
                    </div>
                    <div
                        className={`grid gap-2 px-2 sm:grid-cols-6 xl:grid-cols-9 ${patientRecordIsClosed ? "grayscale" : ""}`}
                    >
                        {patientEntries.slice(0, 2).map((entry, index) => (
                            <PatientEntryCard
                                key={entry.id}
                                appointmentId={appointmentId}
                                appointmentIsClosed={patientRecordIsClosed}
                                entry={entry}
                                index={index}
                                patientId={patient.patient_id}
                                entryList={patientVisitRecord[entry.id]}
                                patientVisitRecordId={patientVisitRecord.id}
                                setEntryList={(newEntryList) =>
                                    setPatientVisitRecord((prev) => ({
                                        ...prev,
                                        [entry.id]: newEntryList,
                                    }))
                                }
                                inputOptions={
                                    inputOptions[entry.id]?.map(
                                        (pl) => pl.name,
                                    ) || []
                                }
                            />
                        ))}

                        <PrescriptionSection
                            patient={patient}
                            appointmentId={appointmentId}
                            prescriptions={prescriptions}
                            inputOptions={inputOptions}
                            appointmentIsClosed={patientRecordIsClosed}
                            patientVisitRecordId={patientVisitRecord.id}
                        />

                        {patientEntries.slice(2).map((entry, index) => (
                            <PatientEntryCard
                                entry={entry}
                                key={entry.id}
                                index={index + 2}
                                appointmentId={appointmentId}
                                appointmentIsClosed={patientRecordIsClosed}
                                patientId={patient.patient_id}
                                entryList={patientVisitRecord[entry.id]}
                                setEntryList={(newEntryList) =>
                                    setPatientVisitRecord((prev) => ({
                                        ...prev,
                                        [entry.id]: newEntryList,
                                    }))
                                }
                                inputOptions={
                                    inputOptions[entry.id]?.map(
                                        (pl) => pl.name,
                                    ) || []
                                }
                                medicalCertificate={medicalCertificate}
                                laboratoryRequest={laboratoryRequest}
                                medicalRecords={medicalRecords}
                                patientVisitRecordId={patientVisitRecord.id}
                            />
                        ))}
                    </div>
                    <div className="px-2">
                        <DiagnosticResultsCard
                            appointmentIsClosed={patientRecordIsClosed}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
