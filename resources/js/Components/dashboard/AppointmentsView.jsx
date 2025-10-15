import { usePage } from "@inertiajs/react";
import React, { useState } from "react";

export function AppointmentsView() {
    const { upcomingPatients, pendingProcedures } = usePage().props;

    const [currentTab, setCurrentTab] = useState("check-up");

    return (
        <div className="rounded-lg bg-white shadow-md">
            <div className="relative flex flex-col items-center gap-2 p-4 pb-0 text-center">
                <h2 className="text-sm font-bold">APPOINTMENTS VIEW</h2>
                <div className="z-10 flex gap-2 rounded-lg bg-accent-200 p-1 text-xs">
                    <button
                        onClick={() => setCurrentTab("check-up")}
                        className={`flex items-center gap-2 rounded-md px-3 py-1.5 duration-100 ${currentTab === "check-up" ? "bg-accent text-white" : "text-accent-500"}`}
                    >
                        Check Up
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                            {upcomingPatients.length}
                        </span>
                    </button>
                    <button
                        onClick={() => setCurrentTab("procedures")}
                        className={`flex items-center gap-2 rounded-md px-3 py-1.5 duration-100 ${currentTab === "procedures" ? "bg-accent text-white" : "text-accent-500"}`}
                    >
                        Procedures{" "}
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                            {pendingProcedures.length}
                        </span>
                    </button>
                </div>
                <hr className="absolute bottom-0 left-0 w-full -translate-y-5 border-2 border-accent-200" />
            </div>

            <div className="flex flex-col gap-2 p-4">
                {(currentTab === "check-up"
                    ? upcomingPatients
                    : pendingProcedures
                ).map((patient, i) => (
                    <div
                        key={i}
                        className="flex gap-4 rounded-lg bg-accent-200 p-2"
                    >
                        <h4
                            className={`text-2xl font-bold ${patient.queue_type === "S" ? "text-accent-orange" : ""}`}
                        >
                            {patient.queue_type}
                            {patient.queue_number}
                        </h4>
                        <div className="">
                            <h5 className="line-clamp-1 text-sm font-bold">
                                {patient.first_name}
                                {patient.middle_initial
                                    ? ` ${patient.middle_initial}, `
                                    : " "}
                                {patient.last_name}
                            </h5>
                            <p className="text-xs">{patient.service_name}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
