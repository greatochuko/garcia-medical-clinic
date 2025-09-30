import { Link } from "@inertiajs/react";
import React from "react";
import { route } from "ziggy-js";

export default function PatientProfile({ patient, medicalHistory }) {
    const patientFullName = `${patient.first_name} ${patient.middle_initial || ""} ${patient.last_name}`;

    const patientInfo = [
        {
            id: "dob",
            label: "Date of Birth",
            icon: "/assets/icons/dob-icon.svg",
            value: new Date(patient.dob).toLocaleDateString("en-US", {
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
            value: patient.vitals
                ? `${patient.vitals.height_ft}' ${patient.vitals.height_in}"`
                : "N/A",
        },
        {
            id: "weight",
            label: "Weight",
            icon: "/assets/icons/weight-icon.svg",
            value: patient.vitals?.weight
                ? `${patient.vitals.weight} kg`
                : "N/A",
        },
        {
            id: "temperature",
            label: "Temperature",
            icon: "/assets/icons/temperature-icon.svg",
            value: patient.vitals?.temperature
                ? `${patient.vitals.temperature} °C`
                : "N/A",
        },
        {
            id: "blood-pressure",
            label: "Blood Pressure",
            icon: "/assets/icons/blood-pressure-icon.svg",
            value:
                patient.vitals?.blood_systolic_pressure &&
                patient.vitals?.blood_diastolic_pressure
                    ? `${patient.vitals.blood_systolic_pressure}/${patient.vitals.blood_diastolic_pressure} mmHg`
                    : "N/A",
        },
        {
            id: "oxygen",
            label: "Oxygen Saturation",
            icon: "/assets/icons/oxygen-icon.svg",
            value: patient.vitals?.o2saturation
                ? `${patient.vitals.o2saturation}%`
                : "N/A",
        },
        {
            id: "heart-rate",
            label: "Heart Rate",
            icon: "/assets/icons/heart-icon.svg",
            value: patient.vitals?.heart_rate
                ? `${patient.vitals.heart_rate} bpm`
                : "N/A",
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
