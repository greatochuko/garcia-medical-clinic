import React, { useLayoutEffect, useState } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as am4charts from "@amcharts/amcharts4/charts";
import PropTypes from "prop-types";

const dailyIncomeReport = [
    {
        category: "Regular Check Up",
        price: 2400,
        value: 8,
        color: "#15475B",
        foreground: "#FFFFFF",
    },
    {
        category: "Regular Check Up + MC",
        price: 1000,
        value: 2,
        color: "#1D607B",
        foreground: "#FFFFFF",
    },
    {
        category: "Senior Check Up",
        price: 1250,
        value: 5,
        color: "#2F94BD",
        foreground: "#FFFFFF",
    },
    {
        category: "Senior Check Up + MC",
        price: 500,
        value: 1,
        color: "#59D0FF",
        foreground: "#000000",
    },
    {
        category: "Medical Certificate Only",
        price: 600,
        value: 2,
        color: "#E9EEF3",
        foreground: "#000000",
    },
    {
        category: "Circumcision (10 Below)",
        price: 0,
        value: 0,
        color: "#E6E6E6",
        foreground: "#000000",
    },
    {
        category: "Circumcision (11 Above)",
        price: 0,
        value: 0,
        color: "#BCBEBD",
        foreground: "#000000",
    },
];

const totalEarnings = dailyIncomeReport.reduce(
    (acc, curr) => acc + curr.price,
    0,
);
export default function RightDashboard({ className }) {
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

            <div className="p-4 text-center">
                <h3 className="text-sm font-bold">Today&apos;s Earnings</h3>
                <div className="relative">
                    <PieChart />
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-left">
                        <span className="text-xs">PHP</span>
                        <p className="text-2xl">{totalEarnings}</p>
                    </div>
                </div>
                <p className="flex items-center justify-center gap-1 text-xs">
                    <img src="/assets/icons/info-icon.svg" alt="Info icon" />
                    Daily earnings per category: professional fee.
                </p>
            </div>

            <hr className="border-2 border-accent-200" />

            <ul className="flex flex-col gap-4 p-4">
                {dailyIncomeReport.map((income, i) => (
                    <li key={i} className="flex items-center gap-4">
                        <span
                            className="flex h-6 w-6 items-center justify-center rounded-md text-xs"
                            style={{
                                backgroundColor: income.color,
                                color: income.foreground,
                            }}
                        >
                            {income.value}
                        </span>
                        <p className="line-clamp-1 flex-1 text-sm">
                            {income.category}
                        </p>
                        <p className="ml-auto whitespace-nowrap">
                            PHP {income.price.toLocaleString()}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

am4core.useTheme(am4themes_animated);

function PieChart() {
    useLayoutEffect(() => {
        // Create chart
        let chart = am4core.create("chartdiv", am4charts.PieChart);
        chart.padding(0, 0, 0, 0);
        chart.margin(0, 0, 0, 0);

        // Sample data
        chart.data = dailyIncomeReport.map((service) => ({
            category: service.category,
            value: service.price,
        }));

        // Add and configure series
        let pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "value";
        pieSeries.dataFields.category = "category";
        pieSeries.colors.list = dailyIncomeReport.map((income) =>
            am4core.color(income.color),
        );

        // Make it donut style (optional)
        pieSeries.innerRadius = am4core.percent(50);

        // Remove labels and ticks for clean circle
        pieSeries.labels.template.disabled = true;
        pieSeries.ticks.template.disabled = true;

        // Disable padding
        chart.padding(0, 0, 0, 0);

        return () => {
            chart.dispose();
        };
    }, []);

    return <div id="chartdiv" style={{ width: "100%", height: "256px" }}></div>;
}

RightDashboard.propTypes = {
    className: PropTypes.string,
};
