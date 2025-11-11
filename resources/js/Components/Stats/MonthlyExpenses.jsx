import React, { useLayoutEffect, useMemo, useState } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as am4charts from "@amcharts/amcharts4/charts";
import InputExpensesModal from "../modals/InputExpensesModal";

const dummyExpenses = [
    { id: "electricity", amount: 500 },
    { id: "water", amount: 250 },
];

const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const months = [];
const today = new Date();

for (let i = 0; i < 12; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push({
        month: date.getMonth(),
        year: date.getFullYear(),
    });
}

export default function MonthlyExpenses({ expenses }) {
    const [expensesModalOpen, setExpensesModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        return { year: today.getFullYear(), month: today.getMonth() };
    });

    const { currentMonthExpenses, totalExpenses } = useMemo(() => {
        const monthExpenses = expenses.find(
            (ex) =>
                ex.month === selectedDate.month &&
                ex.year === selectedDate.year,
        );

        const currentMonthExpenses = [
            {
                id: "electricity",
                name: "Electricity Bill",
                amount: monthExpenses?.electricity || 0,
            },
            {
                id: "water",
                name: "Water Bill",
                amount: monthExpenses?.water || 0,
            },
            {
                id: "internet",
                name: "Internet Bill",
                amount: monthExpenses?.internet || 0,
            },
            {
                id: "salary",
                name: "Salary",
                amount: monthExpenses?.salary || 0,
            },
            { id: "rent", name: "Rent", amount: monthExpenses?.rent || 0 },
        ];

        const totalExpenses = currentMonthExpenses.reduce(
            (acc, curr) => acc + curr.amount,
            0,
        );

        return { totalExpenses, currentMonthExpenses };
    }, [expenses, selectedDate.month, selectedDate.year]);

    return (
        <>
            <div className="flex-[1.5] divide-y-2 divide-accent-200 rounded-md bg-white shadow shadow-black/25">
                <div className="relative p-4 pb-6">
                    <h3 className="text-center text-sm font-bold">
                        MONTHLY EXPENSES
                    </h3>
                    <select
                        name="month"
                        id="month"
                        className="absolute right-4 top-full -translate-y-1/2 rounded-md border border-[#DFDFDF] px-2 py-1 pr-8 text-[13px]"
                        value={`${selectedDate.month}-${selectedDate.year}`}
                        onChange={(e) =>
                            setSelectedDate({
                                month: Number(e.target.value.split("-")[0]),
                                year: Number(e.target.value.split("-")[1]),
                            })
                        }
                    >
                        {months.map((month) => (
                            <option
                                key={`${month.month}-${month.year}`}
                                value={`${month.month}-${month.year}`}
                            >
                                {`${monthNames[month.month]} ${new Date(
                                    month.year,
                                    month.month,
                                    1,
                                ).getFullYear()}`}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-6">
                    <p className="flex items-center gap-2 text-xs">
                        <img
                            src="/assets/icons/info-icon.svg"
                            alt="info icon"
                        />
                        Monthly expenses monitor are calculated on a monthly
                        basis.
                    </p>

                    <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="flex flex-1 flex-col items-center gap-2">
                            <PieChart expenses={dummyExpenses} />
                            <button
                                onClick={() => setExpensesModalOpen(true)}
                                className="flex items-center gap-2 rounded-md border border-dashed border-[#9C3725] p-2 text-xs text-[#9C3725] duration-200 hover:bg-[#9C3725]/10"
                            >
                                <img
                                    src="/assets/icons/red-plus-icon.svg"
                                    alt="red plus icon"
                                />
                                Input Expense
                            </button>
                        </div>
                        <div className="flex flex-1 flex-col gap-4 text-xs">
                            {currentMonthExpenses.map((expense, i) => {
                                const percentage = totalExpenses
                                    ? (expense.amount / totalExpenses) * 100
                                    : 0;

                                return (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between gap-2"
                                    >
                                        <div className="flex flex-col gap-1">
                                            <h5 className="text-xs font-medium">
                                                {expense.name}
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
                                            {expense.amount
                                                ? -expense.amount
                                                : 0}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <InputExpensesModal
                open={expensesModalOpen}
                closeModal={() => setExpensesModalOpen(false)}
                year={selectedDate.year}
                month={selectedDate.month}
                prevExpenses={currentMonthExpenses}
            />
        </>
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
