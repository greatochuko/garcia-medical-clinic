import React from "react";
import XIcon from "../icons/XIcon";
import ModalContainer from "../layout/ModalContainer";
import { usePage } from "@inertiajs/react";

export default function MedicationRefillModal({ closeModal, open, patient }) {
    const { auth } = usePage().props;

    const patientFullName = `${patient.first_name} ${patient.middle_initial} ${patient.last_name}`;

    function closeVitalsModal() {
        closeModal();
    }

    function handleCreateBilling(e) {
        e.preventDefault();
    }

    const billingStats = [
        { id: "doctor", label: "Doctor:", value: auth.user.first_name },
        {
            id: "issued",
            label: "Issued:",
            value: new Date().toLocaleDateString("us-en", {
                month: "short",
                day: "numeric",
                year: "numeric",
            }),
        },
        {
            id: "invoice-no",
            label: "Invoice No.",
            value: new Date().toLocaleDateString("us-en", {
                month: "short",
                day: "numeric",
                year: "numeric",
            }),
        },
        {
            id: "status",
            label: "Status:",
            value: "unpaid",
        },
    ];

    return (
        <ModalContainer closeModal={closeVitalsModal} open={open}>
            <form
                onClick={(e) => e.stopPropagation()}
                onSubmit={handleCreateBilling}
                className={`max-h-[80%] w-[90%] max-w-5xl divide-y-2 divide-accent-200 overflow-y-auto rounded-lg bg-white text-sm duration-200 ${open ? "" : "translate-y-2"}`}
            >
                <div className="relative flex items-center justify-center p-4">
                    <h5 className="font-semibold">MEDICATION REFILL LIST</h5>
                    <button
                        type="button"
                        onClick={closeVitalsModal}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 duration-200 hover:bg-accent-200"
                    >
                        <XIcon size={20} />
                    </button>
                </div>
                <div className="flex flex-col items-end gap-4 p-4 pt-28 sm:pt-20 md:pt-14">
                    <div className="relative w-full rounded-lg bg-accent-200 p-4 pt-24 sm:pt-16 md:pt-10">
                        <div className="flex flex-col gap-2 overflow-x-auto text-xs">
                            <div className="z-20 flex items-center text-xs font-bold uppercase text-[#838383] sm:px-4">
                                <h5 className="min-w-32 flex-[6] p-2">
                                    Description
                                </h5>
                                <h5 className="min-w-20 flex-1 p-2 text-center">
                                    Released
                                </h5>
                                <h5 className="min-w-20 flex-1 p-2 text-center">
                                    Price
                                </h5>
                                <h5 className="min-w-20 flex-1 p-2 text-center">
                                    Total
                                </h5>
                                <h5 className="min-w-20 flex-1 p-2 text-center">
                                    Refill
                                </h5>
                            </div>
                            <div className="sm:px-4">
                                <h5 className="p-2 font-bold uppercase">
                                    Service
                                </h5>
                                <div className="flex items-center">
                                    <p className="min-w-32 flex-[6] overflow-hidden overflow-ellipsis whitespace-nowrap p-2">
                                        Prescription Refill
                                    </p>
                                    <p className="min-w-20 flex-1 p-2 text-center"></p>
                                    <p className="min-w-20 flex-1 p-2 text-center">
                                        0.00
                                    </p>
                                    <p className="min-w-20 flex-1 p-2 text-center">
                                        PHP 0.00
                                    </p>
                                    <p className="min-w-20 flex-1 p-2 text-center"></p>
                                </div>
                            </div>
                            <div className="sm:px-4">
                                <h5 className="p-2 font-bold uppercase">
                                    Medications
                                </h5>
                                <div className="flex items-center">
                                    <p className="min-w-32 flex-[6] overflow-hidden overflow-ellipsis whitespace-nowrap p-2">
                                        Paracetamol 500mg
                                    </p>
                                    <p className="min-w-20 flex-1 p-2 text-center">
                                        0
                                    </p>
                                    <p className="min-w-20 flex-1 p-2 text-center">
                                        7.00
                                    </p>
                                    <p className="min-w-20 flex-1 p-2 text-center">
                                        PHP 7.00
                                    </p>
                                    <p className="flex min-w-20 flex-1 items-center justify-center p-2 text-center">
                                        <button
                                            type="button"
                                            className="rounded-md border border-transparent p-1 duration-200 hover:border-accent-400 hover:bg-accent-300"
                                        >
                                            <img
                                                src="/assets/icons/plus-icon.svg"
                                                alt="plus icon"
                                                width={14}
                                                height={14}
                                            />
                                        </button>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="absolute left-[2.5%] right-[2.5%] top-4 z-10 flex -translate-y-1/2 flex-col gap-4 rounded-lg border bg-white p-4 pb-10 shadow">
                            <div className="flex flex-col justify-between md:flex-row md:items-center">
                                <div className="flex items-center gap-4">
                                    <img
                                        src="/images/patient.png"
                                        alt="patient profile picture"
                                        className="h-12 w-12 rounded-full"
                                    />
                                    <div className="flex flex-col gap-1">
                                        <h4 className="font-bold">
                                            {patientFullName}
                                        </h4>
                                        <p className="text-xs">
                                            {patient.age}, {patient.gender}
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-xs sm:grid-cols-4 md:flex">
                                    {billingStats.map((stat) => (
                                        <div
                                            key={stat.id}
                                            className="items-left flex flex-col justify-center gap-1 rounded-md bg-[#FAFBFE] p-2"
                                        >
                                            <h5 className="text-[#838383]">
                                                {stat.label}
                                            </h5>
                                            <p
                                                className={
                                                    stat.id === "status"
                                                        ? "w-fit rounded-md border border-dashed border-accent bg-white p-2 py-1"
                                                        : ""
                                                }
                                            >
                                                {stat.value}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* <div className="flex items-center text-xs font-bold uppercase text-[#838383]">
                                <h5 className="flex-[6] min-w-32 p-2">Description</h5>
                                <h5 className="min-w-20 flex-1 p-2 text-center">
                                    Released
                                </h5>
                                <h5 className="min-w-20 flex-1 p-2 text-center">
                                    Price
                                </h5>
                                <h5 className="min-w-20 flex-1 p-2 text-center">
                                    Total
                                </h5>
                                <h5 className="min-w-20 flex-1 p-2 text-center">
                                    Refill
                                </h5>
                            </div> */}
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="flex items-center gap-2 rounded-md border border-dashed border-accent bg-accent-100 px-3 py-1.5 text-sm duration-200 hover:bg-accent-200"
                    >
                        <img
                            src="/assets/icons/plus-icon.svg"
                            alt="plus icon"
                            width={16}
                            height={16}
                        />
                        Create Billing
                    </button>
                </div>
            </form>
        </ModalContainer>
    );
}
