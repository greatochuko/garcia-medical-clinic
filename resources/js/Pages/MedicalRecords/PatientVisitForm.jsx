import React, { useCallback, useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PatientSummaryPanel from "@/Components/patient-visit-form/PatientSummaryPanel";

import PrescriptionSection from "@/Components/patient-visit-form/PrescriptionSection";

import PatientEntryCard from "@/Components/patient-visit-form/PatientEntryCard";
import DiagnosticResultsCard from "@/Components/patient-visit-form/DiagnosticResultsCard";
import { router } from "@inertiajs/react";
import { route } from "ziggy-js";
import toast from "react-hot-toast";
import { getUserFullName } from "@/utils/getUserFullname";

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

const AUTOSAVE_INTERVAL = 30_000; // 30 seconds

export default function PatientVisitForm({
    patientVisitRecord: initialRecord,
    medicalRecords,
    inputOptions,
    medicalHistory,
}) {
    const [patientVisitRecord, setPatientVisitRecord] = useState(initialRecord);
    const [patient, setPatient] = useState(patientVisitRecord.patient);
    const [saving, setSaving] = useState(false);
    const [closing, setClosing] = useState(false);
    const [prescriptions, setPrescriptions] = useState(
        initialRecord.prescriptions || [],
    );

    const medicalCertificate = patientVisitRecord.medical_certificate;

    const laboratoryRequest = patientVisitRecord.lab_request;

    const appointment = patientVisitRecord.appointment;
    const appointmentId = appointment?.id;
    const patientRecordIsClosed = patientVisitRecord.is_closed;

    const isSaved =
        JSON.stringify(initialRecord.chief_complaints) ===
            JSON.stringify(patientVisitRecord.chief_complaints) &&
        JSON.stringify(initialRecord.physical_exams) ===
            JSON.stringify(patientVisitRecord.physical_exams) &&
        JSON.stringify(initialRecord.plans) ===
            JSON.stringify(patientVisitRecord.plans) &&
        JSON.stringify(initialRecord.diagnoses) ===
            JSON.stringify(patientVisitRecord.diagnoses) &&
        JSON.stringify(initialRecord.prescriptions) ===
            JSON.stringify(patientVisitRecord.prescriptions);

    const handleSaveForm = useCallback(
        (showToastNotification = true) => {
            const payload = {
                chief_complaints: patientVisitRecord.chief_complaints,
                physical_exams: patientVisitRecord.physical_exams,
                plans: patientVisitRecord.plans,
                diagnoses: patientVisitRecord.diagnoses,
            };

            router.put(
                route("patientVisitRecords.update", {
                    id: patientVisitRecord.id,
                }),
                payload,
                {
                    onStart() {
                        setSaving(true);
                    },
                    onFinish() {
                        setSaving(false);
                    },
                    onSuccess() {
                        if (showToastNotification) {
                            toast.success("Form Saved Successfully");
                        }
                    },
                    preserveScroll: true,
                    onError: (errors) => {
                        console.error(errors);
                        toast.error("Failed to Save Patient Visit Form");
                    },
                },
            );
        },
        [
            patientVisitRecord.chief_complaints,
            patientVisitRecord.diagnoses,
            patientVisitRecord.id,
            patientVisitRecord.physical_exams,
            patientVisitRecord.plans,
        ],
    );

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (isSaved) return;
            handleSaveForm(false);
        }, AUTOSAVE_INTERVAL);

        return () => clearInterval(intervalId);
    }, [handleSaveForm, isSaved]);

    const doctorFullName = patientVisitRecord.doctor
        ? getUserFullName(patientVisitRecord.doctor)
        : "";

    const patientVisitDate = new Date(
        patientVisitRecord.created_at,
    ).toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });

    const patientVisitHeader = patientVisitRecord
        ? `Patient Visit Form ID No. ${patientVisitRecord.id} · ${patientVisitDate} ${patientVisitRecord.doctor ? `· ${doctorFullName}` : ""}`
        : "";

    return (
        <AuthenticatedLayout
            pageTitle={`${patient.first_name} ${patient.last_name} - Patient Visit Form`}
        >
            <div className="mx-auto mt-4 flex w-[90%] max-w-screen-2xl flex-col gap-4">
                <PatientSummaryPanel
                    appointmentId={appointmentId}
                    appointmentIsClosed={patientRecordIsClosed}
                    closing={closing}
                    handleSaveForm={handleSaveForm}
                    isSaved={isSaved}
                    labRequest={laboratoryRequest}
                    medicalCertificate={medicalCertificate}
                    medicalHistory={medicalHistory}
                    patient={patient}
                    patientVisitRecord={patientVisitRecord}
                    prescriptions={prescriptions}
                    saving={saving}
                    setPatient={setPatient}
                    setPatientVisitRecord={setPatientVisitRecord}
                    setClosing={setClosing}
                />
                <div className="flex flex-col gap-4 rounded-lg bg-accent-100 py-2 shadow">
                    <div className="relative flex items-center justify-center">
                        <h2 className="z-20 rounded-md bg-accent-200 p-2 px-4 text-center">
                            {patientVisitHeader}
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
                                saving={saving}
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
                            setPrescriptions={setPrescriptions}
                            inputOptions={inputOptions}
                            appointmentIsClosed={patientRecordIsClosed}
                            saving={saving}
                            patientVisitRecordId={patientVisitRecord.id}
                        />

                        {patientEntries.slice(2).map((entry, index) => (
                            <PatientEntryCard
                                entry={entry}
                                saving={saving}
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
                                setPatientVisitRecord={setPatientVisitRecord}
                            />
                        ))}
                    </div>
                    <div className="px-2">
                        <DiagnosticResultsCard
                            appointmentIsClosed={patientRecordIsClosed}
                            saving={saving}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
