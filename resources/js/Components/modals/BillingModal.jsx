import React, { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import ModalContainer from "../layout/ModalContainer";
import { XIcon } from "lucide-react";
import PaymentModal from "./PaymentModal";
import { CircleCheckIcon } from "lucide-react";
import axios from "axios";
import { route } from "ziggy-js";
import toast from "react-hot-toast";

function formatPHP(amount) {
    return `PHP ${Number(amount).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function BillingModal({
    open,
    closeModal: closeBillingModal,
    appointment,
    patient,
    prescriptions: initialPrescriptions,
    setAppointment,
    readOnly = false,
    invoiceNumber,
}) {
    const { auth } = usePage().props;
    const [prescriptions, setPrescriptions] = useState(initialPrescriptions);
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [paid, setPaid] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setPrescriptions(
            initialPrescriptions.map((p) => ({
                ...p,
                amount: Number(p.amount),
            })),
        );
    }, [initialPrescriptions]);

    function closeModal() {
        if (paymentModalOpen || loading) return;
        closeBillingModal();
        setTimeout(() => {
            setPaid(false);
        }, 200);
    }

    const patientFullName = `${patient.first_name}, ${patient.middle_initial || ""} ${patient.last_name}`;

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
            value: invoiceNumber ? `#${invoiceNumber}` : "N/A",
        },
        {
            id: "status",
            label: "Status:",
            value: invoiceNumber ? "Paid" : "Unpaid",
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
    const discount = patient.age > 60 ? subtotal * 0.2 : 0;
    const total = subtotal - discount;

    async function handleSubmit() {
        setLoading(true);
        try {
            const res = await axios.post(route("billingrecord.add"), {
                patient_id: patient.patient_id,
                appointment_id: String(appointment.id),
                services: appointment.service_charge.name,
                total: subtotal,
                final_total: total,
                discount,
                paid: true,
            });

            if (res.data.success) {
                setPaid(true);
                setPaymentModalOpen(false);
                setAppointment?.((prev) => ({
                    ...prev,
                    status: "checked_out",
                }));
            } else {
                toast.error("Failed to bill client");
            }
        } catch (error) {
            toast.error("An error occured while billing client");
            console.error(error);
        }
        setLoading(false);
    }

    return (
        <>
            <ModalContainer closeModal={closeModal} open={open}>
                {paid ? (
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative aspect-[1.2] w-[90%] max-w-sm overflow-hidden rounded-lg bg-white"
                    >
                        <div className="absolute left-1/2 top-0 aspect-square w-[150%] -translate-x-1/2 -translate-y-[75%] rounded-full bg-accent-200"></div>
                        <div className="flex h-full flex-col items-center justify-between p-6 pt-10">
                            <CircleCheckIcon
                                size={72}
                                className="z-20"
                                color="#16B721"
                            />
                            <div className="flex flex-col items-center gap-4 text-center">
                                <p className="z-20 text-2xl font-semibold">
                                    Successful!
                                </p>
                                <p>Billing receipt sent to the doctor.</p>
                                <button
                                    onClick={closeModal}
                                    className="w-full max-w-40 rounded-md bg-accent p-4 text-sm font-bold text-white duration-200 hover:bg-accent/90"
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className={`flex h-[80%] w-[90%] max-w-5xl flex-col divide-y-2 divide-accent-200 rounded-lg bg-white text-sm duration-200 ${open ? "" : "translate-y-2"}`}
                    >
                        <div className="relative flex items-center justify-center p-4">
                            <h5 className="font-semibold">
                                CHECK UP BILLING FORM
                            </h5>
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
                                                            ? `w-fit rounded-md px-4 py-1 ${stat.value === "Paid" ? "bg-[#27D01E] text-white" : "border border-dashed border-accent bg-white"}`
                                                            : stat.id ===
                                                                "invoice-no"
                                                              ? "text-center"
                                                              : ""
                                                    }
                                                >
                                                    {stat.value}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="relative flex w-full flex-1 flex-col justify-between overflow-y-auto rounded-lg bg-accent-200 p-4 pt-20 sm:pt-14 md:pt-8">
                                <table className="w-full whitespace-nowrap text-xs">
                                    <thead className="sticky top-0 z-20">
                                        <tr className="font-bold uppercase text-[#838383]">
                                            <th className="min-w-48 p-2 text-left">
                                                Description
                                            </th>
                                            <th className="w-20 p-2">
                                                Quantity
                                            </th>
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
                                                {readOnly ? (
                                                    appointment.service_charge
                                                        .name
                                                ) : (
                                                    <select
                                                        name="serviceType"
                                                        id="serviceType"
                                                        className="w-44 cursor-pointer rounded-md border-accent-400 p-2 text-xs outline-none focus:border-accent-500 focus:ring-2 focus:ring-[#089bab]/50 disabled:cursor-not-allowed disabled:bg-[#E4E4E4] disabled:text-gray-500"
                                                    >
                                                        <option
                                                            value={
                                                                appointment.service
                                                            }
                                                        >
                                                            {
                                                                appointment
                                                                    .service_charge
                                                                    .name
                                                            }
                                                        </option>
                                                    </select>
                                                )}
                                            </td>
                                            <td className="p-2 text-center">
                                                1
                                            </td>
                                            <td className="p-2 text-center">
                                                {
                                                    appointment.service_charge
                                                        .charge
                                                }
                                            </td>
                                            <td className="p-2 text-center">
                                                {formatPHP(
                                                    appointment.service_charge
                                                        .charge,
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
                                                    {
                                                        prescription.medication
                                                            .name
                                                    }
                                                    <p className="text-[10px] text-[#8C8C8C]">
                                                        {`${prescription.dosage} ${prescription.frequency.name} for ${prescription.duration} days - #${parseInt(prescription.amount)}`}
                                                    </p>
                                                </td>
                                                <td className="p-2 text-center">
                                                    {readOnly ? (
                                                        prescription.amount
                                                    ) : (
                                                        <input
                                                            type="number"
                                                            value={
                                                                prescription.amount
                                                            }
                                                            min={1}
                                                            className="w-full rounded-md border border-accent-400 bg-white p-2 text-center text-xs outline-none focus:border-accent-500 focus:ring-2 focus:ring-[#089bab]/50"
                                                            onChange={(e) =>
                                                                handleQuantityChange(
                                                                    prescription.id,
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                    )}
                                                </td>
                                                <td className="p-2 text-center">
                                                    {
                                                        prescription.medication
                                                            .price
                                                    }
                                                </td>
                                                <td className="p-2 text-center">
                                                    {formatPHP(
                                                        prescription.medication
                                                            .price *
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
                                    </tbody>
                                </table>
                                <div className="">
                                    <div className="flex justify-end gap-2 text-xs">
                                        <div
                                            colSpan={2}
                                            className="text-[#15475BA6]"
                                        >
                                            SUBTOTAL
                                        </div>
                                        <div className="w-20" />
                                        <div className="w-28 text-center">
                                            {formatPHP(subtotal)}
                                        </div>
                                    </div>
                                    {patient.age > 60 && (
                                        <div className="flex justify-end gap-2 text-xs">
                                            <div
                                                colSpan={2}
                                                className="text-[#15475BA6]"
                                            >
                                                SENIOR DISCOUNT 20%
                                            </div>
                                            <div className="w-20" />
                                            <div className="w-28 text-center">
                                                -{formatPHP(discount)}
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex justify-end gap-2 text-xs">
                                        <div
                                            colSpan={2}
                                            className="p-2 text-sm"
                                        >
                                            TOTAL
                                        </div>
                                        <div className="w-20" />
                                        <div className="w-28 p-2 text-center text-sm font-bold">
                                            {formatPHP(total)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {!readOnly && (
                                <div className="mt-4 flex items-center justify-end gap-4">
                                    <button
                                        onClick={closeModal}
                                        className="rounded-md border border-accent p-2 text-xs duration-200 hover:bg-accent-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() =>
                                            setPaymentModalOpen(true)
                                        }
                                        className="rounded-md border border-accent bg-accent px-4 py-2 text-xs text-white duration-200 hover:bg-accent/90"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </ModalContainer>

            <PaymentModal
                open={paymentModalOpen}
                closeModal={() => {
                    if (loading) return;
                    setPaymentModalOpen(false);
                }}
                patient={patient}
                total={total}
                formatPHP={formatPHP}
                onSubmit={handleSubmit}
                loading={loading}
            />
        </>
    );
}
