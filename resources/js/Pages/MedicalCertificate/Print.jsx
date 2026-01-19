import React, { useEffect } from "react";
import "../../../css/medicalcertificate-print.css";

export default function PrintMedicalCertificate({
    patient,
    diagnosis,
    comments,
    date,
    doctor,
}) {
    useEffect(() => {
        window.print();
    }, []);

    function formatAgeString(age) {
        if (!age) return "";

        const value = parseInt(age);
        const unit = age.slice(-1).toUpperCase();

        switch (unit) {
            case "D":
                return `${value} day${value !== 1 ? "s" : ""} old`;
            case "M":
                return `${value} month${value !== 1 ? "s" : ""} old`;
            case "Y":
                return `${value} year${value !== 1 ? "s" : ""} old`;
            default:
                return `${value} year${value !== 1 ? "s" : ""} old`; // fallback
        }
    }

    return (
        <div className="page bg-gray-100">
            <div className="h-[100vh] w-full bg-white px-6">
                <div className="mb-2 flex flex-col items-center">
                    <img
                        src="/images/garcia-logo.png"
                        alt="Garcia Medical Clinic Logo"
                        className="h-20 w-[12rem] object-cover"
                    />
                </div>

                <div className="text-center">
                    <span className="font-fraunces text-xl font-bold">
                        MEDICAL CERTIFICATE
                    </span>
                </div>

                <div className="mb-4 text-right font-alice text-lg font-normal">
                    Date: <span className="underline">{date}</span>
                </div>

                <div className="text-14px mb-6 font-alice font-normal leading-relaxed">
                    This is to certify that I examined / treated{" "}
                    <span className="underline">
                        {patient.name}, {formatAgeString(patient.age)},{" "}
                        {patient.gender}, {patient.civilStatus}
                    </span>
                    , from <span className="underline">{patient.address}</span>{" "}
                    on <span className="underline">{patient.visitDate}</span>.
                </div>

                <div className="text-14px mb-9 font-alice font-normal">
                    This certificate is issued to the above patient for whatever
                    purpose it may serve him / her best.
                </div>

                <div className="mb-9">
                    <div className="text-14px mb-2 font-alice font-normal">
                        Diagnosis:{" "}
                        <span className="underline">{diagnosis}</span>
                    </div>
                    <div className="text-14px font-alice font-normal">
                        Comments: <span className="underline">{comments}</span>
                    </div>
                </div>

                <div className="flex justify-end">
                    <div className="text-14px text-center">
                        <div className="mb-2 border-t border-gray-400"></div>
                        <div className="font-montserrat text-base font-bold">
                            {doctor.name} {doctor?.license_no ? " MD" : ""}
                        </div>
                        <div className="font-montserrat text-sm font-bold">
                            <div>LICENSE NO. {doctor.licenseNo}</div>
                            <div>PTR NO. {doctor.ptrNo}</div>
                        </div>
                    </div>
                </div>

                <div className="text-12px mt-8 font-fraunces font-normal italic">
                    *Not valid for Medico-Legal purposes
                </div>
            </div>
        </div>
    );
}
