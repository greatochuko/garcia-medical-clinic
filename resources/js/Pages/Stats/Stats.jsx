import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Filters from "./Filters";
import RevenueCards from "./RevenueCards";
import TypeOfServices from "./TypeOfServices";
import React, { useLayoutEffect } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as am4charts from "@amcharts/amcharts4/charts";
import MonthlyExpenses from "./MonthlyExpenses";
import StaffList from "./StaffList";

export const expenses = [
    { id: "electricity", amount: 500 },
    { id: "water", amount: 250 },
];

export const expenseNames = [
    { id: "electricity", name: "Electricity Bill" },
    { id: "water", name: "Water Bill" },
    { id: "internet", name: "Internet Bill" },
    { id: "salary", name: "Salary" },
    { id: "rent", name: "Rent" },
];

export function getExpenseAmount(id) {
    return expenses.find((ex) => ex.id === id)?.amount;
}

export const totalExpenses = expenses.reduce(
    (acc, curr) => acc + curr.amount,
    0,
);

export default function Stats({ auth, services, users }) {
    const user = auth.user;
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
                                <Filters />

                                <RevenueCards />

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

                                <TypeOfServices services={services} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

am4core.useTheme(am4themes_animated);

export function PieChart({ expenses }) {
    useLayoutEffect(() => {
        let chart = am4core.create("chartdiv", am4charts.PieChart);
        chart.padding(0, 0, 0, 0);

        // Only include expenses with amount > 0
        chart.data = expenses
            .filter((ex) => ex.amount > 0)
            .map((ex) => ({
                category: ex.name || ex.id, // fallback to id if name missing
                value: ex.amount,
            }));

        let pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "value";
        pieSeries.dataFields.category = "category";

        // Assign static colors or generate dynamically
        const grayColors = [
            "#51504F",
            "#51504FCC",
            "#51504F99",
            "#51504F66",
            "#51504F33",
        ];

        pieSeries.colors.list = chart.data.map((_, i) =>
            am4core.color(grayColors[i % grayColors.length]),
        );

        pieSeries.innerRadius = am4core.percent(50);
        pieSeries.labels.template.disabled = true;
        pieSeries.ticks.template.disabled = true;
        pieSeries.tooltip.label.fontSize = 12;

        return () => chart.dispose();
    }, [expenses]);

    return <div id="chartdiv" style={{ width: "100%", height: "160px" }}></div>;
}
