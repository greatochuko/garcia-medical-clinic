import AddPatientForm from "@/Components/patients/AddPatientForm";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React from "react";

export default function AddPatientPage({ patientId, patient }) {
    return (
        <AuthenticatedLayout pageTitle={"Add Patient"}>
            <div className="flex-1">
                <div className="max-w-8xl mx-auto mt-6 flex h-full w-[95%] flex-col bg-white text-accent md:px-6">
                    <h1 className="border-b-2 border-accent-200 py-2 text-center font-bold">
                        PATIENT REGISTRATION FORM
                    </h1>

                    <AddPatientForm
                        patientId={patient?.patient_id || patientId}
                        patient={patient}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
