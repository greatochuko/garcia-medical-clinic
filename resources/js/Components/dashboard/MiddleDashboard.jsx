import React from "react";
import Calendar from "./Calendar";
import PropTypes from "prop-types";
import { usePage } from "@inertiajs/react";

const totalStats = [
    {
        title: "Total Patients",
        id: "total_patients",
        value: 756,
        icon: "/assets/icons/patients-icon-white.svg",
    },
    {
        title: "Total Doctors",
        id: "total_doctors",
        value: 7,
        icon: "/assets/icons/doctors-icon-white.svg",
    },
    {
        title: "Total Appointments",
        id: "total_appointments",
        value: 1530,
        icon: "/assets/icons/doctors-icon-white.svg",
    },
];

export default function MiddleDashboard({ className }) {
    return (
        <div className={`flex flex-[1.5] flex-col gap-6 ${className}`}>
            <TotalCounts />
            <Calendar />
        </div>
    );
}

function TotalCounts() {
    const {
        summary,
        auth: { user },
    } = usePage().props;

    return (
        <div className="rounded-lg bg-white shadow-md">
            <div className="border-b-2 border-accent-200 p-4 text-center">
                <h2 className="text-sm font-bold">TOTAL COUNTS</h2>
            </div>
            <div className="p-4">
                <div className="flex items-center gap-4">
                    <img
                        src="/images/dashboard-image.png"
                        alt=""
                        className="w-[55%] flex-1"
                    />
                    <p className="flex-1 text-sm">
                        Hello, {user.first_name}! Currently we have{" "}
                        <span className="font-bold">15 patients</span> waiting
                        today.
                    </p>
                </div>
                <div className="flex flex-wrap gap-4">
                    {totalStats.map((stat) => (
                        <div
                            key={stat.id}
                            className="flex flex-1 items-center gap-4 whitespace-nowrap rounded-lg bg-accent-200 p-2 py-4"
                        >
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent">
                                <img
                                    src={stat.icon}
                                    alt={stat.title}
                                    width={
                                        stat.icon.includes("doctor") ? 14 : 18
                                    }
                                    height={
                                        stat.icon.includes("doctor") ? 14 : 18
                                    }
                                />
                            </div>
                            <div className="flex-1 text-sm">
                                <p>{summary[stat.id]}</p>
                                <h4 className="text-xs">{stat.title}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

MiddleDashboard.propTypes = {
    className: PropTypes.string,
};
