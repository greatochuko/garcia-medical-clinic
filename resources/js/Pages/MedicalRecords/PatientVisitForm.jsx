import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PatientSummaryPanel from "@/Components/patient-visit-form/PatientSummaryPanel";
import Input from "@/Components/layout/Input";
import { PlusIcon } from "lucide-react";
import PrescriptionSection from "@/Components/patient-visit-form/PrescriptionSection";

const patientEntries = [
    { id: "chief-complaint", title: "CHIEF COMPLAINT", value: [] },
    { id: "physical-exam", title: "PHYSICAL EXAM", value: [] },
    { id: "plan", title: "PLAN", value: [] },
    { id: "diagnosis", title: "DIAGNOSIS", value: [] },
    {
        id: "medical-records",
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
                        {patientEntries.slice(0, 2).map((entry) => (
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
                                <div className="h-60 overflow-y-auto"></div>
                                <div className="p-4">
                                    <div className="relative">
                                        <Input className="w-full rounded-xl p-3 pr-16" />
                                        <button className="absolute right-0 top-1/2 flex h-full -translate-y-1/2 items-center justify-center rounded-xl rounded-bl-none bg-accent px-4">
                                            <PlusIcon
                                                size={20}
                                                strokeWidth={5}
                                                color="#fff"
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <PrescriptionSection
                            patient={patient}
                            appointmentId={appointmentId}
                            prescriptions={prescriptions}
                            medications={medications}
                        />

                        {patientEntries.slice(2).map((entry) => (
                            <div
                                key={entry.id}
                                className={`flex flex-col divide-y-2 divide-accent-200 rounded-md bg-white text-sm shadow-md lg:col-span-2 ${
                                    entry.id === "medical-records"
                                        ? "sm:col-span-6"
                                        : "sm:col-span-3"
                                }`}
                            >
                                <div className="relative p-4">
                                    <h3 className="text-center font-semibold">
                                        {entry.title}
                                    </h3>
                                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2">
                                        <img
                                            src={
                                                entry.id === "medical-records"
                                                    ? "/assets/icons/profile-card-icon.svg"
                                                    : "/assets/icons/edit-icon-2.svg"
                                            }
                                            alt="edit icon"
                                            width={18}
                                            height={18}
                                        />
                                    </button>

                                    {entry.id === "plan" && (
                                        <div className="absolute left-1/2 top-full flex min-w-max -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-md bg-accent-200 p-1">
                                            <button className="flex items-center gap-2 rounded-md border border-dashed border-accent bg-white px-2 py-1 text-xs font-medium duration-200 hover:bg-accent-100">
                                                <img
                                                    src="/assets/icons/laboratory-icon.svg"
                                                    alt="pills icon"
                                                />
                                                LAB REQUEST
                                            </button>
                                            <button className="flex items-center gap-2 rounded-md border border-dashed border-accent bg-white px-2 py-1 text-xs font-medium duration-200 hover:bg-accent-100">
                                                <img
                                                    src="/assets/icons/med-certification-icon.svg"
                                                    alt="pills icon"
                                                />
                                                MED CERTIFICATE
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="h-60 overflow-y-auto"></div>
                                {!entry.hideInput && (
                                    <div className="p-4">
                                        <div className="relative">
                                            <Input className="w-full rounded-xl p-3 pr-16" />
                                            <button className="absolute right-0 top-1/2 flex h-full -translate-y-1/2 items-center justify-center rounded-xl rounded-bl-none bg-accent px-4">
                                                <PlusIcon
                                                    size={20}
                                                    strokeWidth={5}
                                                    color="#fff"
                                                />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
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
