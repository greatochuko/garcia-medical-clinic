import React, { useMemo, useState } from "react";

export default function TypeOfServices({
    services,
    medicationList,
    filteredRecords,
}) {
    const [currentTab, setCurrentTab] = useState("professional-fee");

    const { allServiceTotals, serviceTotal } = useMemo(() => {
        const allServiceTotals = services
            .map((service) => ({
                name: service.name,
                amount: filteredRecords.reduce(
                    (acc, curr) =>
                        acc + (curr.service.id === service.id ? 1 : 0),
                    0,
                ),
            }))
            .sort((a, b) => b.amount - a.amount);

        const serviceTotal = allServiceTotals.reduce(
            (acc, curr) => acc + curr.amount,
            0,
        );

        return { allServiceTotals, serviceTotal };
    }, [filteredRecords, services]);

    const { allMedicationTotals, medicationTotal } = useMemo(() => {
        const allMedicationTotals = medicationList
            .map((medication) => {
                const total = filteredRecords.reduce((sum, record) => {
                    const recordQty = record.prescriptions?.reduce(
                        (innerSum, p) => {
                            if (p.medication?.id === medication.id) {
                                return (
                                    innerSum +
                                    Number(p.quantity || p.amount || 0)
                                );
                            }
                            return innerSum;
                        },
                        0,
                    );

                    return sum + recordQty;
                }, 0);

                return {
                    name: medication.name,
                    amount: total,
                };
            })
            .sort((a, b) => b.amount - a.amount);

        const medicationTotal = allMedicationTotals.reduce(
            (acc, curr) => acc + curr.amount,
            0,
        );

        return { allMedicationTotals, medicationTotal };
    }, [filteredRecords, medicationList]);

    return (
        <div className="flex flex-1 flex-col divide-y divide-accent-200 rounded-md bg-white shadow-md">
            <div className="relative p-2 pb-5">
                <h3 className="text-center text-sm font-bold">
                    TYPES OF SERVICES
                </h3>
                <div className="absolute left-1/2 top-full flex w-fit -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-accent-200 text-xs">
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
            <div className="flex flex-1 flex-col gap-4 p-4 pt-6">
                <p className="flex items-center gap-2 text-xs">
                    <img src="/assets/icons/info-icon.svg" alt="info icon" />{" "}
                    All types of{" "}
                    {currentTab === "professional-fee"
                        ? "services"
                        : "medicine"}{" "}
                    according to patient visit.
                </p>

                {currentTab === "professional-fee" ? (
                    <ul className="flex max-h-[617px] flex-1 flex-col gap-4 overflow-y-auto px-4">
                        {allServiceTotals.map((service, i) => {
                            const salePercentage = serviceTotal
                                ? (
                                      (service.amount / serviceTotal) *
                                      100
                                  ).toFixed()
                                : 0;
                            return (
                                <li
                                    key={i}
                                    className="flex flex-col gap-1 text-xs"
                                >
                                    <div className="flex justify-between">
                                        <p>{service.name}</p>
                                        <p>{salePercentage}%</p>
                                    </div>
                                    <div className="relative h-4 overflow-hidden rounded-md bg-accent/25">
                                        <div
                                            className="h-full bg-[#59889C]"
                                            style={{
                                                width: `${salePercentage}%`,
                                            }}
                                        ></div>

                                        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white">
                                            {service.amount}
                                        </span>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <ul className="flex max-h-[617px] flex-1 flex-col gap-4 overflow-y-auto px-4">
                        {allMedicationTotals.map((medication, i) => {
                            const salePercentage = medicationTotal
                                ? (
                                      (medication.amount / medicationTotal) *
                                      100
                                  ).toFixed()
                                : 0;
                            return (
                                <li
                                    key={i}
                                    className="flex flex-col gap-1 text-xs"
                                >
                                    <div className="flex justify-between">
                                        <p>{medication.name}</p>
                                        <p>{salePercentage}%</p>
                                    </div>
                                    <div className="relative h-4 overflow-hidden rounded-md bg-accent/25">
                                        <div
                                            className="h-full bg-[#59889C]"
                                            style={{
                                                width: `${salePercentage}%`,
                                            }}
                                        ></div>

                                        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white">
                                            {medication.amount}
                                        </span>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}
