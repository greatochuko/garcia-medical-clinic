import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Link } from "@inertiajs/react";
import React, { useState } from "react";
import { route } from "ziggy-js";

export default function ViewMedicalRecord({
    auth,
    patient,
    medicalRecords,
    medicalHistory,
}) {
    const [user, setUser] = useState(auth.user);

    return (
        <AuthenticatedLayout
            pageTitle={"Dashboard"}
            user={user}
            setUser={setUser}
        >
            <div className="mx-auto mt-6 flex w-[90%] max-w-screen-2xl flex-col gap-4 rounded-md border bg-white p-4 text-sm lg:flex-row">
                <PatientProfile
                    patient={patient}
                    medicalHistory={medicalHistory}
                />
                <MedicalRecords
                    patient={patient}
                    medicalRecords={medicalRecords}
                />
            </div>
        </AuthenticatedLayout>
    );
}

function PatientProfile({ patient, medicalHistory }) {
    const patientFullName = `${patient.first_name} ${patient.middle_initial} ${patient.last_name}`;

    const patientInfo = [
        {
            id: "dob",
            label: "Date of Birth",
            icon: "/assets/icons/dob-icon.svg",
            value: new Date(patient.dob).toLocaleDateString("us-en", {
                month: "long",
                day: "numeric",
                year: "numeric",
            }),
        },
        {
            id: "marital-status",
            label: "Marital Status",
            icon: "/assets/icons/marital-status-icon.svg",
            value: "Single",
        },
        {
            id: "phone-number",
            label: "Mobile Number",
            icon: "/assets/icons/phone-number-icon.svg",
            value: patient.phone,
        },
        {
            id: "home-address",
            label: "Home Address",
            icon: "/assets/icons/home-address-icon.svg",
            value: patient.address,
        },
        {
            id: "height",
            label: "Height",
            icon: "/assets/icons/height-icon.svg",
            value: patient.vitals?.height || "N/A",
        },

        {
            id: "weight",
            label: "Weight",
            icon: "/assets/icons/weight-icon.svg",
            value: patient.vitals?.weight || "N/A",
        },
        {
            id: "medical-history",
            label: "Medical History",
            icon: "/assets/icons/medical-history-icon.svg",
            value:
                medicalHistory.length > 0 ? medicalHistory.join(", ") : "N/A",
            colSpan: 2,
        },
    ];

    return (
        <div className="flex flex-1 flex-col divide-y-2 divide-accent-200 rounded-md border shadow">
            <h2 className="p-4 text-center font-bold">PATIENT PROFILE</h2>
            <div className="relative flex items-center gap-4 p-4 py-6">
                <img
                    src="/images/patient.png"
                    alt="patient profile picture"
                    className="rounded-full shadow-md"
                    width={80}
                    height={80}
                />
                <div className="flex flex-col gap-1">
                    <h3 className="font-bold">{patientFullName}</h3>
                    <p>
                        {patient.age}, {patient.gender}
                    </p>
                </div>

                <Link
                    href={route("patient.edit", patient.id)}
                    className="absolute left-1/2 top-full flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-md border border-dashed border-accent bg-white px-3 py-1.5 text-xs font-medium uppercase duration-200 hover:bg-accent-200"
                >
                    <img
                        src="/assets/icons/user-edit-icon.svg"
                        alt="user edit icon"
                        width={14}
                        height={14}
                    />
                    Edit Profile
                </Link>
            </div>

            <div className="grid gap-4 gap-y-6 p-4 pt-6 sm:grid-cols-2">
                {patientInfo.map((info) => (
                    <div
                        key={info.id}
                        className={`flex items-center gap-4 ${info.colSpan === 2 ? "sm:col-span-2" : ""}`}
                    >
                        <img
                            src={info.icon}
                            alt={info.label}
                            height={24}
                            width={24}
                        />
                        <div className="flex flex-col gap-1">
                            <h4 className="font-bold">{info.label}</h4>
                            <p>{info.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function MedicalRecords({ patient }) {
    const lastVisitDate = new Date(patient.last_visit_date);

    const medicalRecordsStats = [
        {
            id: "patient-id",
            label: "Patient ID",
            icon: "/assets/icons/id-card-icon.svg",
            value: patient.patient_id,
            needBg: true,
        },
        {
            id: "registration-date",
            label: "Registration Date",
            icon: "/assets/icons/registration-icon.svg",
            value: new Date(patient.created_at).toLocaleDateString("us-en", {
                month: "short",
                day: "numeric",
                year: "numeric",
            }),
        },
        {
            id: "total-appointments",
            label: "Total Appointments",
            icon: "/assets/icons/appointments-icon.svg",
            value: patient.appointments.length,
        },
        {
            id: "last-visit-date",
            label: "Last Visit Date",
            icon: "/assets/icons/registration-icon.svg",
            value: isNaN(lastVisitDate.getTime())
                ? "N/A"
                : lastVisitDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                  }),
        },
    ];
    return (
        <div className="flex flex-[1.6] flex-col divide-y-2 divide-accent-200 rounded-md border shadow">
            <h2 className="p-4 text-center font-bold">MEDICAL RECORDS</h2>
            <div className="relative grid grid-cols-2 gap-4 p-4 pb-8 xl:grid-cols-4">
                {medicalRecordsStats.map((stat) => (
                    <div
                        key={stat.id}
                        className="flex items-center gap-4 rounded-lg bg-[#5E869612] p-4"
                    >
                        <img
                            src={stat.icon}
                            alt={stat.label + " icon"}
                            width={24}
                            height={24}
                            className={`${stat.needBg ? "h-[26px] w-[26px] rounded bg-[#6BC2E6] p-[3px]" : "h-6 w-6"}`}
                        />
                        <div className="flex flex-col gap-1 text-xs">
                            <h4 className="font-bold">{stat.label}</h4>
                            <p>{stat.value}</p>
                        </div>
                    </div>
                ))}

                <button className="absolute right-4 top-full flex -translate-y-1/2 items-center gap-2 rounded-md border border-dashed border-accent bg-white px-3 py-1.5 text-xs font-medium uppercase duration-200 hover:bg-accent-200">
                    <img
                        src="/assets/icons/plus-icon.svg"
                        alt="user edit icon"
                        width={14}
                        height={14}
                    />
                    Medication Refill
                </button>
            </div>
            <div className="p-4 pt-8">
                <p className="text-center text-accent-500">
                    This Patient has no medical history yet
                </p>
            </div>
        </div>
    );
}
