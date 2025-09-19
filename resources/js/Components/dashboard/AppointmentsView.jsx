import React, { useState } from "react";

const checkups = [
    {
        id: "R3",
        name: "Jennings, Anthony Mark Dela Cruz",
        type: "Regular Check Up",
    },
    {
        id: "R3",
        name: "Jennings, Anthony Mark Dela Cruz",
        type: "Regular Check Up",
    },
    {
        id: "R3",
        name: "Jennings, Anthony Mark Dela Cruz",
        type: "Regular Check Up",
    },
];

export function AppointmentsView() {
    const [currentTab, setCurrentTab] = useState("check-up");

    return (
        <div className="shadowmd rounded-lg bg-white">
            <div className="relative flex flex-col items-center gap-2 p-4 pb-0 text-center">
                <h2 className="text-sm font-bold">PATIENT QUICKVIEW</h2>
                <div className="z-10 flex gap-2 rounded-lg bg-accent-200 p-1 text-xs">
                    <button
                        onClick={() => setCurrentTab("check-up")}
                        className={`rounded-md px-3 py-1.5 duration-100 ${currentTab === "check-up" ? "bg-accent text-white" : "text-accent-500"}`}
                    >
                        Check Up
                    </button>
                    <button
                        onClick={() => setCurrentTab("procedures")}
                        className={`flex items-center gap-2 rounded-md px-3 py-1.5 duration-100 ${currentTab === "procedures" ? "bg-accent text-white" : "text-accent-500"}`}
                    >
                        Procedures{" "}
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                            {checkups.length}
                        </span>
                    </button>
                </div>
                <hr className="absolute bottom-0 left-0 w-full -translate-y-5 border-2 border-accent-200" />
            </div>

            <div className="flex flex-col gap-2 p-4">
                {checkups.map((checkup, i) => (
                    <div
                        key={i}
                        className="flex gap-4 rounded-lg bg-accent-200 p-2"
                    >
                        <h4 className="text-2xl font-bold">{checkup.id}</h4>
                        <div className="">
                            <h5 className="line-clamp-1 text-sm font-bold">
                                {checkup.name}
                            </h5>
                            <p className="text-xs">{checkup.type}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
