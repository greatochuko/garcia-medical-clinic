import React, { useMemo, useState } from "react";
import DeletePatientModal from "../modals/DeletePatientModal";
import { Link, router } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function PatientRow({ patient, removePatientFromList }) {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const lastVisitDate = useMemo(
        () =>
            new Date(patient.last_visit_date * 1000).toLocaleDateString(
                "us-en",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                },
            ),
        [patient.last_visit_date],
    );

    return (
        <>
            <div className="flex hover:bg-gray-50">
                <div className="min-w-52 flex-[3.5] p-4">
                    <h4 className="w-full overflow-hidden overflow-ellipsis font-semibold">
                        {patient.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                        {patient.age}, {patient.gender}
                    </p>
                </div>
                <div className="flex min-w-40 flex-[2] items-center justify-center p-4 text-center">
                    {lastVisitDate === "Invalid Date" ? "--" : lastVisitDate}
                </div>
                <div className="flex min-w-[25rem] flex-[3] items-center justify-center p-4 text-center">
                    <div className="flex w-fit gap-2 rounded-md bg-[#EAEAEA] p-2">
                        <button
                            onClick={() =>
                                router.visit(
                                    route("appointments.create") +
                                        `?id=${patient.patient_id}`,
                                )
                            }
                            className="rounded-md border border-dashed border-accent bg-white px-3 py-1.5 text-xs duration-200 hover:bg-accent-200"
                        >
                            Create Appointment
                        </button>
                        <Link
                            href={route("medicalrecords.view", patient.id)}
                            className="rounded-md border border-dashed border-accent bg-white px-3 py-1.5 text-xs duration-200 hover:bg-accent-200"
                        >
                            View Profile & Medical Record
                        </Link>
                    </div>
                </div>
                <div className="flex min-w-24 flex-[1] items-center justify-center p-4">
                    <button
                        onClick={() => setDeleteModalOpen(true)}
                        className="rounded-md border border-transparent p-2 duration-100 hover:border-accent-400 hover:bg-accent-300"
                    >
                        <img
                            src="/assets/icons/delete-icon.svg"
                            alt="Edit Icon"
                            width={16}
                            height={16}
                        />
                    </button>
                </div>
            </div>
            <DeletePatientModal
                open={deleteModalOpen}
                closeModal={() => {
                    setDeleteModalOpen(false);
                }}
                patientId={patient.id}
                removePatientFromList={removePatientFromList}
            />
        </>
    );
}
