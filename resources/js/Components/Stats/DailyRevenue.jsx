import React, { useState } from "react";
import DailyRevenueChart from "./DailyRevenueChart";

function getRandomNumber(min = 1, max = 50) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getDatesBetween(startDate, endDate) {
    if (!startDate || !endDate) return [];

    const dates = [];

    let current = new Date(startDate);

    const end = new Date(endDate);
    while (current <= end) {
        dates.push(new Date(current)); // store a copy
        current.setDate(current.getDate() + 1); // move to next day
    }

    return dates;
}

export default function DailyRevenue({ startDate, endDate }) {
    const [currentTab, setCurrentTab] = useState("all");

    const dates = getDatesBetween(startDate, endDate);

    const data = dates.map((date) => ({
        label: new Date(date).toLocaleDateString("us-en", {
            month: "short",
            day: "numeric",
        }),
        value: getRandomNumber(1, 50),
    }));

    return (
        <div className="divide-y-2 divide-accent-200 rounded-md bg-white shadow shadow-black/25">
            <div className="relative p-2 pb-4">
                <h3 className="text-center text-sm font-bold">DAILY REVENUE</h3>
                <div className="absolute left-1/2 top-full flex w-fit -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-accent-200 text-xs">
                    <button
                        onClick={() => setCurrentTab("all")}
                        className={`rounded-md p-1 px-2 ${currentTab === "all" ? "bg-accent text-white" : ""}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setCurrentTab("professional-fee")}
                        className={`rounded-md p-1 px-2 ${currentTab === "professional-fee" ? "bg-accent text-white" : ""}`}
                    >
                        Professional Fee
                    </button>
                    <button
                        onClick={() => setCurrentTab("medicine")}
                        className={`rounded-md p-1 px-2 ${currentTab === "medicine" ? "bg-accent text-white" : ""}`}
                    >
                        Medicine
                    </button>
                </div>
            </div>
            <div className="p-4 pt-6">
                <p className="flex items-center gap-2 text-xs">
                    <img
                        src="/assets/icons/info-icon.svg"
                        alt="info icon"
                        width={12}
                        height={12}
                    />
                    Daily view of professional fee, medicine, or both revenues.
                </p>
                <DailyRevenueChart
                    data={data}
                    width={300}
                    height={120}
                    color="#00C2D1"
                />
            </div>
        </div>
    );
}
