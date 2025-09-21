import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Link } from "@inertiajs/react";

export default function AppointmentManager(props) {
    console.log(props);
    const [currentTab, setCurrentTab] = useState("active");

    return (
        <AuthenticatedLayout pageTitle={"Appointments"}>
            <div className="mx-auto flex h-full w-[95%] max-w-screen-2xl flex-col gap-4 bg-accent-100 px-4 py-6 text-accent md:px-6">
                <div className="relative mb-2 border-b-2 border-accent-200 px-4 pb-6 pt-3 text-center">
                    <h1 className="text-center text-sm font-bold">
                        APPOINTMENTS MANAGER
                    </h1>
                    <div className="absolute left-1/2 top-full flex -translate-x-1/2 -translate-y-1/2 gap-2 rounded-lg bg-accent-200 p-1 text-xs">
                        <button
                            onClick={() => setCurrentTab("active")}
                            className={`rounded-md px-3 py-1.5 duration-100 ${currentTab === "active" ? "bg-accent text-white" : "text-accent-500"}`}
                        >
                            Active
                        </button>
                        <button
                            onClick={() => setCurrentTab("completed")}
                            className={`rounded-md px-3 py-1.5 duration-100 ${currentTab === "completed" ? "bg-accent text-white" : "text-accent-500"}`}
                        >
                            Completed
                        </button>
                    </div>

                    <div className="absolute right-4 top-full flex -translate-y-1/2 items-center gap-4">
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
                        <button className="flex items-center gap-2 rounded-[10px] border-2 border-dashed border-accent bg-accent-200 p-2 text-xs text-accent duration-200 hover:bg-accent-300">
                            <img
                                src="/assets/icons/walk-in-icon.svg"
                                alt="walk in "
                                width={16}
                                height={16}
                            />
                        </button>
                    </div>
                </div>
                <div className="p-4 text-center text-sm text-accent-500">
                    <p>There are no appointments right now</p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
