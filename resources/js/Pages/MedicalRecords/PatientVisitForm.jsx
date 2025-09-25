import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PatientSummaryPanel from "@/Components/patient-visit-form/PatientSummaryPanel";

import PrescriptionSection from "@/Components/patient-visit-form/PrescriptionSection";

import PatientEntryCard from "@/Components/patient-visit-form/PatientEntryCard";

const patientEntries = [
    { id: "chief_complaint", title: "CHIEF COMPLAINT", value: [] },
    { id: "physicalExam", title: "PHYSICAL EXAM", value: [] },
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
        physicalExam: { data: [], input: "" },
        plan: { data: [], input: "" },
        diagnosis: { data: [], input: "" },
        medical_records: { data: [], input: "" },
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
                        {/* {patientEntries.slice(0, 2).map((entry) => (
                            <div
                                key={entry.id}
                                className="flex flex-col divide-y-2 divide-accent-200 rounded-md bg-white text-sm shadow-md sm:col-span-3"
                            >
                                <div className="relative p-4">
                                    <h3 className="text-center font-semibold">
                                        {entry.title}
                                    </h3>
                                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2">
                                        <img
                                            src="/assets/icons/edit-icon-2.svg"
                                            alt="edit icon"
                                            width={18}
                                            height={18}
                                        />
                                    </button>
                                </div>
                                <ul className="flex h-60 flex-col gap-2 overflow-y-auto break-words p-4">
                                    {patientEntryData[entry.id].data.map(
                                        (datum) => (
                                            <li key={datum.id}>
                                                <span className="mr-2 font-bold">
                                                    &gt;
                                                </span>
                                                {datum["chief_complaint"]}{" "}
                                                {entry.id}
                                            </li>
                                        ),
                                    )}
                                </ul>
                                <div className="p-4">
                                    <form
                                        onSubmit={(e) =>
                                            handleAddEntry(e, entry.id)
                                        }
                                        className="relative"
                                    >
                                        <Input
                                            value={
                                                patientEntryData[entry.id].input
                                            }
                                            onChange={(e) =>
                                                setPatientEntryData((prev) => ({
                                                    ...prev,
                                                    [entry.id]: {
                                                        ...prev[entry.id],
                                                        input: e.target.value,
                                                    },
                                                }))
                                            }
                                            className="w-full rounded-xl p-3 pr-16"
                                        />
                                        <button
                                            type="submit"
                                            disabled={
                                                !patientEntryData[entry.id]
                                                    .input
                                            }
                                            className="focus-visible::ring-2 absolute right-0 top-1/2 flex h-full -translate-y-1/2 items-center justify-center rounded-xl rounded-bl-none border-2 border-accent bg-accent px-4 focus:border-accent-500 focus:ring-2 focus:ring-[#089bab]/50 focus-visible:border-white focus-visible:outline-none"
                                        >
                                            <PlusIcon
                                                size={20}
                                                strokeWidth={5}
                                                color="#fff"
                                            />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ))} */}

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

                        {/* <div className="flex flex-[2] flex-col gap-2">
                            <div className="grid grid-cols-2 gap-2">
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
