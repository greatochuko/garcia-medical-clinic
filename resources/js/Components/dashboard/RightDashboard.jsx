import React, { useLayoutEffect, useState } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as am4charts from "@amcharts/amcharts4/charts";
import PropTypes from "prop-types";
import { usePage } from "@inertiajs/react";

const colors = [
    { color: "#15475B", foreground: "#FFFFFF" }, // Regular Check Up
    { color: "#1D607B", foreground: "#FFFFFF" }, // Regular Check Up + MC
    { color: "#2F94BD", foreground: "#FFFFFF" }, // Senior Check Up
    { color: "#59D0FF", foreground: "#000000" }, // Senior Check Up + MC
    { color: "#E9EEF3", foreground: "#000000" }, // Medical Certificate Only
    { color: "#E6E6E6", foreground: "#000000" }, // Circumcision (10 Below)
    { color: "#BCBEBD", foreground: "#000000" }, // Circumcision (11 Above)
    { color: "#FFB347", foreground: "#000000" }, // Extra color 1
    { color: "#FF7F50", foreground: "#000000" }, // Extra color 2
    { color: "#A3C4BC", foreground: "#000000" }, // Extra color 3
];

export default function RightDashboard({ className, userRole }) {
    const { billingItems } = usePage().props;

    const dailyProfessionalIncomeReport = Object.values(
        billingItems.reduce((acc, appt) => {
            const serviceName = appt.service?.name || "Unknown";
            const price = parseFloat(appt.service?.charge || 0);
            if (!acc[serviceName]) {
                acc[serviceName] = {
                    category: serviceName,
                    price: 0,
                    value: 0,
                };
            }
            acc[serviceName].price += price;
            acc[serviceName].value += 1;
            return acc;
        }, {}),
    ).map((report, i) => ({
        ...report,
        color: colors[i % colors.length].color,
        foreground: colors[i % colors.length].foreground,
    }));

    const dailyMedicineIncomeReport = [];

    billingItems.forEach((appointment) => {
        appointment.prescriptions.forEach((prescription) => {
            const med = prescription.medication;
            if (!med) return; // skip if no medication

            // Check if medicine already exists in report
            const existing = dailyMedicineIncomeReport.find(
                (item) => item.medicine === med.name,
            );

            if (existing) {
                existing.value += prescription.amount;
                existing.price += med.price * prescription.amount;
            } else {
                dailyMedicineIncomeReport.push({
                    medicine: med.name,
                    value: prescription.amount,
                    price: med.price * prescription.amount,
                });
            }
        });
    });

    const totalMedicineEarnings = dailyMedicineIncomeReport.reduce(
        (acc, curr) => acc + curr.price,
        0,
    );
    const totalProfessionalFeeEarnings = dailyProfessionalIncomeReport.reduce(
        (acc, curr) => acc + curr.price,
        0,
    );
    const [currentTab, setCurrentTab] = useState("professional-fee");

    return (
        <div className={`flex-1 rounded-lg bg-white shadow-md ${className}`}>
            <div className="relative mb-2 border-b-2 border-accent-200 px-4 pb-5 pt-3 text-center">
                <h2 className="text-sm font-bold">DAILY INCOME REPORT</h2>
                <div className="absolute bottom-0 left-1/2 flex w-full -translate-x-1/2 translate-y-1/2 items-center justify-center">
                    <div className="flex gap-2 rounded-lg bg-accent-200 p-1 text-xs">
                        <button
                            onClick={() => setCurrentTab("professional-fee")}
                            className={`rounded-md px-3 py-1.5 duration-100 ${currentTab === "professional-fee" ? "bg-accent text-white" : "text-accent-500"}`}
                        >
                            Professional Fee
                        </button>
                        <button
                            onClick={() => setCurrentTab("medicines")}
                            className={`rounded-md px-3 py-1.5 duration-100 ${currentTab === "medicines" ? "bg-accent text-white" : "text-accent-500"}`}
                        >
                            Medicines
                        </button>
                    </div>
                </div>
            </div>
            {currentTab === "professional-fee" ? (
                <>
                    <div className="p-4 text-center">
                        <h3 className="text-sm font-bold">
                            Today&apos;s Earnings
                        </h3>
                        <div className="relative">
                            <div className="relative z-20">
                                <PieChart
                                    incomeReport={dailyProfessionalIncomeReport}
                                />
                            </div>
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-left">
                                <span className="text-xs">PHP</span>
                                <p className="text-2xl">
                                    {userRole !== "secretary"
                                        ? totalProfessionalFeeEarnings
                                        : 500}
                                </p>
                            </div>
                        </div>
                        <p className="flex items-center justify-center gap-1 text-xs">
                            <img
                                src="/assets/icons/info-icon.svg"
                                alt="Info icon"
                            />
                            Daily earnings per category: professional fee.
                        </p>
                    </div>

                    <hr className="border-2 border-accent-200" />

                    <ul className="flex flex-col gap-4 p-4">
                        {dailyProfessionalIncomeReport.map((income, i) => (
                            <li key={i} className="flex items-center gap-4">
                                <span
                                    className="flex h-6 w-6 items-center justify-center rounded-md text-xs"
                                    style={{
                                        backgroundColor: colors[i].color,
                                        color: colors[i].foreground,
                                    }}
                                >
                                    {income.value}
                                </span>
                                <p className="line-clamp-1 flex-1 text-sm">
                                    {income.category}
                                </p>
                                {userRole !== "secretary" && (
                                    <p className="ml-auto whitespace-nowrap">
                                        PHP {income.price.toLocaleString()}
                                    </p>
                                )}
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <>
                    <div className="flex flex-col gap-2 p-4 text-center">
                        <h3 className="text-sm font-bold">
                            Today&apos;s Earnings
                        </h3>
                        <p className="text-4xl font-bold">
                            {totalMedicineEarnings.toLocaleString()}
                        </p>
                        <p className="flex items-center justify-center gap-1 text-xs">
                            <img
                                src="/assets/icons/info-icon.svg"
                                alt="Info icon"
                            />
                            Daily earnings per category: medicine.
                        </p>
                    </div>

                    <hr className="border-2 border-accent-200" />
                    <ul className="flex flex-col gap-4 p-4">
                        {dailyMedicineIncomeReport.map((income, i) => (
                            <li key={i} className="flex items-center gap-4">
                                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#BCBEBD] text-xs">
                                    {income.value}
                                </span>
                                <p className="line-clamp-1 flex-1 text-sm">
                                    {income.medicine}
                                </p>
                                <p className="ml-auto whitespace-nowrap">
                                    PHP {income.price.toLocaleString()}
                                </p>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}

am4core.useTheme(am4themes_animated);

function PieChart({ incomeReport }) {
    useLayoutEffect(() => {
        // Create chart
        let chart = am4core.create("chartdiv", am4charts.PieChart);
        chart.padding(0, 0, 0, 0);
        chart.margin(0, 0, 0, 0);

        // Sample data
        chart.data = incomeReport.map((service) => ({
            category: service.category,
            value: service.price,
        }));

        // Add and configure series
        let pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "value";
        pieSeries.dataFields.category = "category";
        pieSeries.colors.list = incomeReport.map((income) =>
            am4core.color(income.color),
        );

        // Make it donut style (optional)
        pieSeries.innerRadius = am4core.percent(50);

        // Remove labels and ticks for clean circle
        pieSeries.labels.template.disabled = true;
        pieSeries.ticks.template.disabled = true;

        // Customize tooltip text and font size
        pieSeries.tooltip.label.fontSize = 12;

        // Disable padding
        chart.padding(0, 0, 0, 0);

        return () => {
            chart.dispose();
        };
    }, [incomeReport]);

    return <div id="chartdiv" style={{ width: "100%", height: "256px" }}></div>;
}

RightDashboard.propTypes = {
    className: PropTypes.string,
    userRole: PropTypes.string,
};
