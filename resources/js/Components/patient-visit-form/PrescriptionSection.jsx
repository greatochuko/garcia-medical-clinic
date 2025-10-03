import React, { useState } from "react";
import AddPrescriptionModal from "../modals/AddPrescriptionModal";

export default function PrescriptionSection({
    patient,
    appointmentId,
    prescriptions,
    inputOptions,
    appointmentIsClosed,
}) {
    const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);

    return (
        <>
            <div className="row-span-2 flex flex-1 flex-col divide-y-2 divide-accent-200 rounded-md bg-white text-sm shadow-md sm:col-span-6 xl:col-span-3">
                <div className="relative p-4">
                    <h3 className="text-center font-semibold">PRESCRIPTIONS</h3>
                    <button
                        disabled={appointmentIsClosed}
                        onClick={() => setPrescriptionModalOpen(true)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-transparent p-1.5 duration-200 hover:border-accent-400 hover:bg-accent-200"
                    >
                        <img
                            src={"/assets/icons/edit-icon-2.svg"}
                            alt="edit icon"
                            width={16}
                            height={16}
                        />
                    </button>

                    <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2 rounded-md bg-accent-200 p-1">
                        <button
                            disabled={appointmentIsClosed}
                            onClick={() => setPrescriptionModalOpen(true)}
                            className="flex items-center gap-2 rounded-md border border-dashed border-accent bg-white px-2 py-1 text-xs font-medium duration-200 hover:bg-accent-100"
                        >
                            <img
                                src="/assets/icons/pills-icon.svg"
                                alt="pills icon"
                            />
                            ADD MEDICATION
                        </button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 pt-8 sm:pt-4">
                    <ol className="flex h-80 flex-col gap-4 pt-2 xl:h-[666px]">
                        {prescriptions.map((pres, i) => (
                            <li key={pres.id} className="flex gap-2">
                                <span className="font-bold">{i + 1}.</span>
                                <div className="flex flex-col">
                                    {pres.medication.name} #{pres.amount} tabs
                                    <span className="text-xs text-[#666666]">
                                        {pres.dosage} {pres.frequency.name}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>

            <AddPrescriptionModal
                open={prescriptionModalOpen}
                closeModal={() => setPrescriptionModalOpen(false)}
                patient={patient}
                appointmentId={appointmentId}
                prescriptions={prescriptions}
                inputOptions={inputOptions}
            />
        </>
    );
}
