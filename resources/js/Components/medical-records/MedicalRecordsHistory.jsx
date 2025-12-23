import React, { useState } from "react";
import MedicationRefillModal from "../modals/MedicationRefillModal";
import { Link, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import { Loader2Icon } from "lucide-react";

export function MedicalRecordsHistory({ patient, user }) {
    const { medicalRecords, medications } = usePage().props;
    const [refillModalOpen, setRefillModalOpen] = useState(false);
    const [addingRecord, setAddingRecord] = useState(false);

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

    function handleAddRecord() {
        setAddingRecord(true);
        setAddingRecord(false);
    }

    return (
        <>
            <div className="flex flex-[1.6] flex-col divide-y-2 divide-accent-200 rounded-md border border-[#efefef] shadow">
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

                    <div className="absolute right-4 top-full flex -translate-y-1/2 items-center gap-4">
                        {user.role !== "secretary" && (
                            <button
                                onClick={handleAddRecord}
                                disabled={addingRecord}
                                className="flex items-center gap-2 rounded-md border border-dashed border-accent bg-white px-3 py-1.5 text-xs font-medium uppercase duration-200 hover:bg-accent-200 disabled:pointer-events-none disabled:opacity-50"
                            >
                                {addingRecord ? (
                                    <>
                                        <Loader2Icon
                                            size={14}
                                            className="animate-spin"
                                        />
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <img
                                            src="/assets/icons/plus-icon.svg"
                                            alt="user edit icon"
                                            width={14}
                                            height={14}
                                        />
                                        Add Record
                                    </>
                                )}
                            </button>
                        )}
                        <button
                            onClick={() => setRefillModalOpen(true)}
                            className="flex items-center gap-2 rounded-md border border-dashed border-accent bg-white px-3 py-1.5 text-xs font-medium uppercase duration-200 hover:bg-accent-200"
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
                </div>
                <div className="flex flex-col gap-1 p-4 pt-8">
                    {medicalRecords.length > 0 ? (
                        medicalRecords.map((record) => (
                            <div
                                key={record.id}
                                className="flex items-stretch gap-2"
                            >
                                <div className="flex flex-col items-center gap-[2px]">
                                    <span className="block rounded-full bg-[#EAECF0] p-2">
                                        <img
                                            src="/assets/icons/file-icon.svg"
                                            alt="File icon"
                                            className="h-3 w-3"
                                        />
                                    </span>
                                    <div className="w-[2px] flex-1 bg-[#EAECF0]"></div>
                                </div>
                                <div className="flex flex-col gap-2 pb-4 pt-1.5 text-xs">
                                    <p className="text-[#666666]">
                                        {new Date(
                                            record.appointment.appointment_date,
                                        ).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}{" "}
                                        |{" "}
                                        {record.appointment.service_charge.name}
                                    </p>
                                    <div className="">
                                        {user.role === "secretary" ? (
                                            <h4 className="text-sm font-semibold">
                                                {
                                                    record.appointment
                                                        .service_charge.name
                                                }
                                            </h4>
                                        ) : (
                                            <Link
                                                href={route(
                                                    "patientvisitform.index",
                                                    {
                                                        patient_id:
                                                            record.patient_id,
                                                        appointment_id:
                                                            record.appointment_id,
                                                    },
                                                )}
                                                className="text-sm font-semibold hover:underline"
                                            >
                                                {record.diagnosis}
                                            </Link>
                                        )}
                                        <p className="text-[#666666]">
                                            Prescribed Medications:{" "}
                                            {record.prescribed_medications.join(
                                                ", ",
                                            )}
                                        </p>
                                    </div>
                                    <p className="text-[#5E8696]">
                                        {record.doctor.first_name},{" "}
                                        {record.doctor.middle_initial}{" "}
                                        {record.doctor.last_name} MD
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-accent-500">
                            This Patient has no medical history yet
                        </p>
                    )}
                </div>
            </div>

            <MedicationRefillModal
                open={refillModalOpen}
                closeModal={() => setRefillModalOpen(false)}
                medications={medications || []}
                patient={patient}
                type="refill"
            />
        </>
    );
}
