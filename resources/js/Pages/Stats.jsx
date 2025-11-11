import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Filters from "@/Components/Stats/Filters";
import RevenueCards from "@/Components/Stats/RevenueCards";
import MonthlyExpenses from "@/Components/Stats/MonthlyExpenses";
import StaffList from "@/Components/Stats/StaffList";
import TypeOfServices from "@/Components/Stats/TypeOfServices";
import DailyRevenue from "@/Components/Stats/DailyRevenue";

export default function Stats({ auth, services, users, medicationList }) {
    const user = auth.user;

    const [startDate, setStartDate] = useState(() => {
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);

        return sevenDaysAgo;
    });
    const [endDate, setEndDate] = useState(new Date());

    return (
        <AuthenticatedLayout pageTitle="Stats">
            <div className="max-w-full flex-1 pt-6">
                <div className="mx-auto flex h-full w-[95%] max-w-screen-2xl flex-col divide-y-2 divide-accent-200 rounded-md bg-[#F8FAFC] text-accent shadow-sm shadow-[#00000040]">
                    <h1 className="p-4 text-center text-sm font-bold">
                        REPORTS
                    </h1>
                    <div className="flex flex-1 flex-col gap-4 p-4">
                        <p className="text-sm">
                            Track revenue, expenses, and financial performance
                            metrics.
                        </p>

                        <div className="flex flex-col gap-4 lg:hidden">
                            <p className="rounded-md bg-accent-200 p-2 text-center text-sm">
                                Hello, {user.first_name}! Today is{" "}
                                {new Date().toLocaleDateString("en-us", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </p>
                            <img
                                src="/images/stats-clip-art.svg"
                                alt="stats"
                                className="h-44 object-contain"
                            />
                        </div>
                        <div className="flex flex-col gap-4 lg:flex-row">
                            <div className="flex flex-[2] flex-col gap-4">
                                <Filters
                                    doctors={users.filter(
                                        (user) => user.role === "doctor",
                                    )}
                                    services={services}
                                    endDate={endDate}
                                    setEndDate={setEndDate}
                                    setStartDate={setStartDate}
                                    startDate={startDate}
                                />

                                <RevenueCards />

                                <DailyRevenue
                                    endDate={endDate}
                                    startDate={startDate}
                                />

                                <div className="flex flex-col gap-4 md:flex-row">
                                    <MonthlyExpenses />
                                    <StaffList users={users} />
                                </div>
                            </div>
                            <div className="flex flex-1 flex-col gap-4">
                                <div className="hidden flex-col gap-4 lg:flex">
                                    <p className="rounded-md bg-accent-200 p-2 text-center text-sm">
                                        Hello, {user.first_name}! Today is{" "}
                                        {new Date().toLocaleDateString(
                                            "en-us",
                                            {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            },
                                        )}
                                    </p>
                                    <img
                                        src="/images/stats-clip-art.svg"
                                        alt="stats"
                                        className="h-44 object-contain"
                                    />
                                </div>

                                <TypeOfServices
                                    services={services}
                                    medicationList={medicationList}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
