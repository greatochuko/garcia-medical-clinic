import React, { useState } from "react";
import MedicationRefillModal from "../modals/MedicationRefillModal";

export function MedicalRecordsHistory({ patient }) {
    const [refillModalOpen, setRefillModalOpen] = useState(false);

    const lastVisitDate = new Date(patient.last_visit_date * 1000);

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
        <>
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

                    <button
                        onClick={() => setRefillModalOpen(true)}
                        className="absolute right-4 top-full flex -translate-y-1/2 items-center gap-2 rounded-md border border-dashed border-accent bg-white px-3 py-1.5 text-xs font-medium uppercase duration-200 hover:bg-accent-200"
                    >
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

            <MedicationRefillModal
                open={refillModalOpen}
                closeModal={() => setRefillModalOpen(false)}
                patient={patient}
            />
        </>
    );
}
