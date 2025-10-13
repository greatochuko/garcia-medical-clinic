import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Paginator from "@/Components/layout/Paginator";
import MedicalRecordsHeader from "@/Components/medical-records/MedicalRecordsHeader";
import PatientTableHeader from "@/Components/medical-records/PatientTableHeader";
import PatientRow from "@/Components/medical-records/PatientRow";

export default function MedicalRecords({ patientData }) {
    const [currentTab, setCurrentTab] = useState("all");
    const patients = patientData.data;

    return (
        <AuthenticatedLayout pageTitle="Medical Records">
            <div className="max-w-full flex-1 pt-6">
                <div className="mx-auto flex h-full w-[95%] max-w-screen-2xl flex-col gap-4 bg-white text-accent">
                    <MedicalRecordsHeader
                        currentTab={currentTab}
                        setCurrentTab={setCurrentTab}
                        perPage={patientData.per_page}
                        page={patientData.current_page}
                    />

                    <div className="flex w-full flex-col gap-4 overflow-x-auto whitespace-nowrap p-4 text-sm">
                        <PatientTableHeader />
                        {patients.map((patient) => (
                            <PatientRow key={patient.id} patient={patient} />
                        ))}
                    </div>
                    <Paginator
                        currentPage={patientData.current_page}
                        per_page={patientData.per_page}
                        totalPages={patientData.last_page}
                        totalList={patientData.total}
                        routeName="medicalrecords.index"
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
