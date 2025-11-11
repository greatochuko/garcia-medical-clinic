import React, { useState, useMemo } from "react";
import DailyRevenueChart from "./DailyRevenueChart";

function getDatesBetween(startDate, endDate) {
    if (!startDate || !endDate) return [];
    const dates = [];
    let current = new Date(startDate);
    const end = new Date(endDate);
    while (current <= end) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }
    return dates;
}

export default function DailyRevenue({ startDate, endDate, filteredRecords }) {
    const [currentTab, setCurrentTab] = useState("all");

    const dates = useMemo(
        () => getDatesBetween(startDate, endDate),
        [startDate, endDate],
    );

    const dailyData = useMemo(() => {
        return dates.map((date) => {
            const day = date.toDateString(); // unique identifier for the day

            // Filter records for this date
            const recordsForDay = filteredRecords.filter(
                (r) => new Date(r.created_at).toDateString() === day,
            );

            let professionalFee = 0;
            let medicineRevenue = 0;

            recordsForDay.forEach((r) => {
                professionalFee += Number(r.service?.charge || 0);
                r.prescriptions?.forEach((p) => {
                    medicineRevenue +=
                        Number(p.amount || 0) *
                        Number(p.medication?.price || 0);
                });
            });

            // Decide what to show based on currentTab
            let value;
            if (currentTab === "all") value = professionalFee + medicineRevenue;
            else if (currentTab === "professional-fee") value = professionalFee;
            else if (currentTab === "medicine") value = medicineRevenue;

            return {
                label: date.toLocaleDateString("en-us", {
                    month: "short",
                    day: "numeric",
                }),
                professionalFee,
                medicineRevenue,
                value,
            };
        });
    }, [dates, filteredRecords, currentTab]);

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
                    data={dailyData}
                    width={300}
                    height={120}
                    color="#00C2D1"
                />
            </div>
        </div>
    );
}
