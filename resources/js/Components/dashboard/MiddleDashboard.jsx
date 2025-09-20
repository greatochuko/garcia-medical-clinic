import React from "react";
import Calendar from "./Calendar";
import PropTypes from "prop-types";

const totalStats = [
    {
        title: "Total Patients",
        value: 756,
        icon: "/assets/icons/patients-icon-white.svg",
    },
    {
        title: "Total Doctors",
        value: 7,
        icon: "/assets/icons/doctors-icon-white.svg",
    },
    {
        title: "Total Appointments",
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
                        Hello, Gibrick! Currently we have{" "}
                        <span className="font-bold">15 patients</span> waiting
                        today.
                    </p>
                </div>
                <div className="flex flex-wrap gap-4">
                    {totalStats.map((stat, i) => (
                        <div
                            key={i}
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
                                <p>{stat.value}</p>
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
