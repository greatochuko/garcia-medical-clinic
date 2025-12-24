import React from "react";
import { MedicalRecordsHistory } from "@/Components/medical-records/MedicalRecordsHistory";
import PatientProfile from "@/Components/medical-records/PatientProfile";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function ViewMedicalRecord({
    auth,
    patient,
    // medicalRecord,
    medicalHistory,
    patientVisitRecords,
}) {
    return (
        <AuthenticatedLayout
            pageTitle={`${patient.first_name} ${patient.last_name} - Medical Records`}
        >
            <div className="mx-auto mt-6 flex w-[90%] max-w-screen-2xl flex-col gap-4 rounded-md border bg-white p-4 text-sm lg:flex-row">
                <PatientProfile
                    patient={patient}
                    medicalHistory={medicalHistory}
                />
                <MedicalRecordsHistory
                    patient={patient}
                    patientVisitRecords={patientVisitRecords}
                    user={auth.user}
                />
            </div>
        </AuthenticatedLayout>
    );
}
