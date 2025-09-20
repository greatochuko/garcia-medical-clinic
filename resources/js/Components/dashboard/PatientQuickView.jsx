import React, { useState } from "react";

const patientStats = [
    { title: "Blood Pressure", value: "110/70" },
    { title: "Temperature", value: "37.6" },
    { title: "Heart Rate", value: "" },
    { title: "Height", value: "" },
    { title: "o2 Saturation", value: "" },
    { title: "Weight", value: "66" },
];

const patientMedicalHistory =
    "Pneumonia, Asthma, Myocardial Infarction, Hyperlipidemia, Hypertension, AKI, CKD, CVA, Pneumonia, Asthma, Myocardial Infarction, Hyperlipidemia, Hypertension, AKI, CKD, CVA";

export function PatientQuickView() {
    const [currentTab, setCurrentTab] = useState("vital-signs");

    return (
        <div className="rounded-lg bg-white shadow-md">
            <div className="relative mb-2 border-b-2 border-accent-200 px-4 pb-5 pt-3 text-center">
                <h2 className="text-sm font-bold">PATIENT QUICKVIEW</h2>
                <div className="absolute bottom-0 left-1/2 flex w-full -translate-x-1/2 translate-y-1/2 items-center justify-center">
                    <div className="flex gap-2 rounded-lg bg-accent-200 p-1 text-xs">
                        <button
                            onClick={() => setCurrentTab("vital-signs")}
                            className={`rounded-md px-3 py-1.5 duration-100 ${currentTab === "vital-signs" ? "bg-accent text-white" : "text-accent-500"}`}
                        >
                            Vital Signs
                        </button>
                        <button
                            onClick={() => setCurrentTab("medical-history")}
                            className={`rounded-md px-3 py-1.5 duration-100 ${currentTab === "medical-history" ? "bg-accent text-white" : "text-accent-500"}`}
                        >
                            Medical History
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 text-center">
                <h4 className="text-sm">
                    Your next patient <span className="font-bold">R2</span> is
                    ready
                </h4>
                <img
                    src="/images/patient.png"
                    alt="Patient"
                    height={80}
                    width={80}
                    className="rounded-full shadow-xl shadow-black/20"
                />
                <div className="flex flex-col items-center gap-1">
                    <h3 className="font-bold">Jennings, Mark Anthony</h3>
                    <p className="text-sm">53, Female</p>
                </div>
            </div>
            <hr className="border-2 border-accent-200" />
            {currentTab === "vital-signs" ? (
                <div className="grid grid-cols-2 gap-4 p-4 text-sm">
                    {patientStats.map((stat, i) => (
                        <div key={i} className="flex gap-2">
                            <div
                                className={`w-1 ${stat.value ? "bg-accent" : "bg-accent-300"}`}
                            />
                            <div className="flex flex-col gap-1">
                                <h5 className="font-semibold">{stat.title}</h5>
                                <p>{stat.value || "-"}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="h-[196px] p-4 text-sm leading-6">
                    <p>{patientMedicalHistory || "No data found."}</p>
                </div>
            )}
        </div>
    );
}
