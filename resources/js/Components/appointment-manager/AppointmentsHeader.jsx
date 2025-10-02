import { Link, usePage } from "@inertiajs/react";
import React, { useState } from "react";
import MedicationRefillModal from "../modals/MedicationRefillModal";

export default function AppointmentsHeader({ currentTab, setCurrentTab }) {
    const { medications } = usePage().props;
    const [walkInBillingModalOpen, setWalkInBillingModalOpen] = useState(false);

    return (
        <>
            <div className="relative mb-2 flex flex-col items-center gap-1 border-b-2 border-accent-200 p-4 px-4 pb-6 text-center">
                <h1 className="text-center text-sm font-bold">
                    APPOINTMENTS MANAGER
                </h1>
                <div className="absolute left-1/2 top-full flex -translate-x-1/2 -translate-y-1/2 gap-2 rounded-lg bg-accent-200 p-1 text-xs">
                    {["active", "completed"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setCurrentTab(tab)}
                            className={`rounded-md px-3 py-1.5 duration-100 ${
                                currentTab === tab
                                    ? "bg-accent text-white"
                                    : "text-accent-500"
                            }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
                <div className="right-4 top-full my-2 flex items-center gap-4 sm:absolute sm:m-0 sm:-translate-y-1/2">
                    <Link
                        href="/appointments/select-patient"
                        className="flex items-center gap-2 rounded-[10px] border-2 border-dashed border-accent bg-accent-200 p-2 text-xs text-accent duration-200 hover:bg-accent-300"
                    >
                        <img
                            src="/assets/icons/plus-icon.svg"
                            alt="plus icon"
                            width={14}
                            height={14}
                        />
                        Create Appointment
                    </Link>
                    <button
                        onClick={() => setWalkInBillingModalOpen(true)}
                        className="flex items-center gap-2 rounded-[10px] border-2 border-dashed border-accent bg-accent-200 p-2 text-xs text-accent duration-200 hover:bg-accent-300"
                    >
                        <img
                            src="/assets/icons/walk-in-icon.svg"
                            alt="walk in"
                            width={16}
                            height={16}
                        />
                    </button>
                </div>
            </div>

            <MedicationRefillModal
                open={walkInBillingModalOpen}
                closeModal={() => setWalkInBillingModalOpen(false)}
                medications={medications}
            />
        </>
    );
}
