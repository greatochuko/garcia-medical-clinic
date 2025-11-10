import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Filters from "./Filters";
import RevenueCards from "./RevenueCards";
import TypeOfServices from "./TypeOfServices";
import React, { useLayoutEffect } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as am4charts from "@amcharts/amcharts4/charts";

const expenses = [
    { id: "electricity", amount: 500 },
    { id: "water", amount: 250 },
];

const expenseNames = [
    { id: "electricity", name: "Electricity Bill" },
    { id: "water", name: "Water Bill" },
    { id: "internet", name: "Internet Bill" },
    { id: "salary", name: "Salary" },
    { id: "rent", name: "Rent" },
];

function getExpenseAmount(id) {
    return expenses.find((ex) => ex.id === id)?.amount;
}

const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

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
                                    <div className="flex-[1.5] divide-y-2 divide-accent-200 rounded-md bg-white shadow shadow-black/25">
                                        <div className="relative p-4 pb-6">
                                            <h3 className="text-center text-sm font-bold">
                                                MONTHLY EXPENSES
                                            </h3>
                                            <select
                                                name="month"
                                                id="month"
                                                className="absolute right-4 top-full -translate-y-1/2 rounded-md border border-[#DFDFDF] px-2 py-1 pr-8 text-[13px]"
                                            >
                                                <option value="">
                                                    November 2025
                                                </option>
                                            </select>
                                        </div>
                                        <div className="flex flex-1 flex-col gap-4 p-4 pt-6">
                                            <p className="flex items-center gap-2 text-xs">
                                                <img
                                                    src="/assets/icons/info-icon.svg"
                                                    alt="info icon"
                                                />
                                                Monthly expenses monitor are
                                                calculated on a monthly basis.
                                            </p>

                                            <div className="flex gap-4">
                                                <div className="flex flex-1 flex-col items-center gap-2">
                                                    <PieChart
                                                        expenses={expenses}
                                                    />
                                                    <button className="flex items-center gap-2 rounded-md border border-dashed border-[#9C3725] p-2 text-xs text-[#9C3725] duration-200 hover:bg-[#9C3725]/10">
                                                        <img
                                                            src="/assets/icons/red-plus-icon.svg"
                                                            alt="red plus icon"
                                                        />
                                                        Input Expense
                                                    </button>
                                                </div>
                                                <div className="flex flex-1 flex-col gap-4 text-xs">
                                                    {expenseNames.map(
                                                        (expense, i) => {
                                                            const amount =
                                                                getExpenseAmount(
                                                                    expense.id,
                                                                ) || 0;
                                                            const percentage =
                                                                totalExpenses
                                                                    ? (amount /
                                                                          totalExpenses) *
                                                                      100
                                                                    : 0;

                                                            return (
                                                                <div
                                                                    key={i}
                                                                    className="flex items-center justify-between gap-2"
                                                                >
                                                                    <div className="flex flex-col gap-1">
                                                                        <h5 className="text-xs font-medium">
                                                                            {
                                                                                expense.name
                                                                            }
                                                                        </h5>
                                                                        <div className="h-1 w-20 rounded-full bg-[#D9D9D9]">
                                                                            <div
                                                                                className="h-full rounded-full bg-[#51504F]/80"
                                                                                style={{
                                                                                    width: `${percentage.toFixed(0)}%`,
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <p className="font-medium text-[#9C3725]">
                                                                        PHP{" "}
                                                                        {amount
                                                                            ? -amount
                                                                            : 0}
                                                                    </p>
                                                                </div>
                                                            );
                                                        },
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 divide-y-2 divide-accent-200 rounded-md bg-white shadow shadow-black/25">
                                        <h3 className="p-4 text-center text-sm font-bold">
                                            LIST OF STAFFS
                                        </h3>

                                        <ul className="flex max-h-72 flex-col gap-4 overflow-y-auto p-4">
                                            {users.map((user) => (
                                                <li
                                                    key={user.id}
                                                    className="flex items-center gap-4"
                                                >
                                                    <img
                                                        src={
                                                            user.avatar_url ||
                                                            "/images/placeholder-avatar.jpg"
                                                        }
                                                        alt={
                                                            user.first_name +
                                                            " profile picture"
                                                        }
                                                        width={32}
                                                        height={32}
                                                        className="rounded-full border-2"
                                                    />
                                                    <div className="text-sm">
                                                        <h5 className="font-bold">
                                                            {user.first_name}{" "}
                                                            {user.middle_initial
                                                                ? `${user.middle_initial.toUpperCase()}. `
                                                                : ""}
                                                            {user.last_name}
                                                        </h5>
                                                        <p className="uppercase">
                                                            {user.role ===
                                                            "doctor"
                                                                ? "GENERAL MEDICINE"
                                                                : user.role ===
                                                                    "admin"
                                                                  ? "CLINIC ADMIN"
                                                                  : "CLINIC SECRETARY"}
                                                        </p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
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

function PieChart({ expenses }) {
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
