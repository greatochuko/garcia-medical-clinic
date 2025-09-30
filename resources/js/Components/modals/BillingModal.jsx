import React, { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import ModalContainer from "../layout/ModalContainer";
import { XIcon } from "lucide-react";

function formatPHP(amount) {
    return `PHP ${Number(amount).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function BillingModal({
    open,
    closeModal,
    appointment,
    prescriptions: initialPrescriptions,
}) {
    const { auth } = usePage().props;
    const [prescriptions, setPrescriptions] = useState(initialPrescriptions);

    useEffect(() => {
        setPrescriptions(
            initialPrescriptions.map((p) => ({
                ...p,
                amount: Number(p.amount),
            })),
        );
    }, [initialPrescriptions]);

    const patient = appointment.patient;
    const patientFullName = `${patient.first_name}, ${patient.middle_initial} ${patient.last_name}`;

    function handleCreateBilling() {}

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

    function handleQuantityChange(id, value) {
        setPrescriptions((prev) =>
            prev.map((p) =>
                p.id === id ? { ...p, amount: Number(value) || 0 } : p,
            ),
        );
    }

    function calculateTotal(prescription) {
        return prescription.medication.price * prescription.amount;
    }

    function calculateSubtotal() {
        return (
            Number(appointment.service_charge.charge) +
            prescriptions.reduce((sum, pres) => sum + calculateTotal(pres), 0)
        );
    }

    const subtotal = calculateSubtotal();
    const discount = subtotal * 0.2;
    const total = subtotal - discount;

    return (
        <ModalContainer closeModal={closeModal} open={open}>
            <div
                onClick={(e) => e.stopPropagation()}
                className={`flex h-[80%] w-[90%] max-w-5xl flex-col divide-y-2 divide-accent-200 rounded-lg bg-white text-sm duration-200 ${open ? "" : "translate-y-2"}`}
            >
                <div className="relative flex items-center justify-center p-4">
                    <h5 className="font-semibold">CHECK UP BILLING FORM</h5>
                    <button
                        type="button"
                        onClick={closeModal}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 duration-200 hover:bg-accent-200"
                    >
                        <XIcon size={20} />
                    </button>
                </div>
                <div className="flex flex-1 flex-col items-end overflow-hidden p-4">
                    <div className="z-10 mx-auto -mb-28 flex w-[calc(100%-2rem)] flex-col gap-4 rounded-lg border bg-white p-4 pb-10 shadow sm:-mb-[5.5rem] md:-mb-16">
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
                    <div className="relative w-full flex-1 overflow-y-auto rounded-lg bg-accent-200 p-4 pt-20 sm:pt-14 md:pt-8">
                        <table className="w-full text-xs">
                            <thead className="sticky top-0 z-20">
                                <tr className="font-bold uppercase text-[#838383]">
                                    <th className="min-w-48 p-2 text-left">
                                        Description
                                    </th>
                                    <th className="w-20 p-2">Quantity</th>
                                    <th className="w-20 p-2">Price</th>
                                    <th className="w-20 p-2">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Service section */}
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="p-2 font-bold uppercase"
                                    >
                                        Service
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-2">
                                        <select
                                            name="serviceType"
                                            id="serviceType"
                                            className="w-44 cursor-pointer rounded-md border-accent-400 p-2 text-xs outline-none focus:border-accent-500 focus:ring-2 focus:ring-[#089bab]/50 disabled:cursor-not-allowed disabled:bg-[#E4E4E4] disabled:text-gray-500"
                                        >
                                            <option value={appointment.service}>
                                                {
                                                    appointment.service_charge
                                                        .name
                                                }
                                            </option>
                                        </select>
                                    </td>
                                    <td className="p-2 text-center">1</td>
                                    <td className="p-2 text-center">
                                        {appointment.service_charge.charge}
                                    </td>
                                    <td className="p-2 text-center">
                                        {formatPHP(
                                            appointment.service_charge.charge,
                                        )}
                                    </td>
                                </tr>

                                {/* Medications section */}
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="p-2 font-bold uppercase"
                                    >
                                        Medications
                                    </td>
                                </tr>
                                {prescriptions.map((prescription) => (
                                    <tr key={prescription.id}>
                                        <td className="truncate p-2">
                                            {prescription.medication.name}
                                            <p className="text-[10px] text-[#8C8C8C]">
                                                {`${prescription.dosage} ${prescription.frequency.name} for ${prescription.duration} days - #${parseInt(prescription.amount)}`}
                                            </p>
                                        </td>
                                        <td className="p-2 text-center">
                                            <input
                                                type="number"
                                                value={prescription.amount}
                                                min={1}
                                                className="w-full rounded-md border border-accent-400 bg-white p-2 text-center text-xs outline-none focus:border-accent-500 focus:ring-2 focus:ring-[#089bab]/50"
                                                onChange={(e) =>
                                                    handleQuantityChange(
                                                        prescription.id,
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </td>
                                        <td className="p-2 text-center">
                                            {prescription.medication.price}
                                        </td>
                                        <td className="p-2 text-center">
                                            {formatPHP(
                                                prescription.medication.price *
                                                    prescription.amount,
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan={4} className="py-2">
                                        <hr />
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td
                                        colSpan={2}
                                        className="text-[#15475BA6]"
                                    >
                                        SUBTOTAL
                                    </td>
                                    <td className="text-center">
                                        {formatPHP(subtotal)}
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td
                                        colSpan={2}
                                        className="text-[#15475BA6]"
                                    >
                                        SENIOR DISCOUNT 20%
                                    </td>
                                    <td className="text-center">
                                        -{formatPHP(discount)}
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td colSpan={2} className="p-2 text-sm">
                                        TOTAL
                                    </td>
                                    <td className="p-2 text-center text-sm font-bold">
                                        {formatPHP(total)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 flex items-center justify-end gap-4">
                        <button
                            onClick={closeModal}
                            className="rounded-md border border-accent p-2 text-xs duration-200 hover:bg-accent-200"
                        >
                            Cancel
                        </button>
                        <button className="rounded-md border border-accent bg-accent px-4 py-2 text-xs text-white duration-200 hover:bg-accent/90">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </ModalContainer>
    );
}
