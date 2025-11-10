import React, { useState } from "react";

const serviceSales = [
    { serviceId: 1, value: 5 },
    { serviceId: 2, value: 3 },
    { serviceId: 3, value: 2 },
    { serviceId: 4, value: 4 },
    { serviceId: 5, value: 6 },
];

export const getServiseSaleValue = (id) => {
    return serviceSales.find((sale) => sale.serviceId === id)?.value || 0;
};

export const totalSales = serviceSales.reduce(
    (acc, curr) => acc + curr.value,
    0,
);

export default function TypeOfServices({ services }) {
    const [currentTab, setCurrentTab] = useState("professional-fee");

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
                    All types of services according to patient visit.
                </p>

                <ul className="flex flex-col gap-4">
                    {[...services]
                        .sort(
                            (a, b) =>
                                getServiseSaleValue(b.id) -
                                getServiseSaleValue(a.id),
                        )
                        .map((service) => {
                            const salePercentage = (
                                (getServiseSaleValue(service.id) / totalSales) *
                                100
                            ).toFixed();
                            return (
                                <li
                                    key={service.id}
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
                                            {getServiseSaleValue(service.id)}
                                        </span>
                                    </div>
                                </li>
                            );
                        })}
                </ul>
            </div>
        </div>
    );
}
