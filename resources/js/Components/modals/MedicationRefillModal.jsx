import React, { useState } from "react";
import { usePage } from "@inertiajs/react";
import ModalContainer from "../layout/ModalContainer";
import { XIcon } from "lucide-react";
import { CircleCheckIcon } from "lucide-react";
import axios from "axios";
import { route } from "ziggy-js";
import toast from "react-hot-toast";
import { InfoIcon, PlusIcon } from "lucide-react";
import SearchInput from "../ui/SearchInput";
import PaymentModal from "./PaymentModal";

function formatPHP(amount) {
    return `PHP ${Number(amount).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function MedicationRefillModal({
    open,
    closeModal: closeBillingModal,
    medications,
    readOnly = false,
    patient,
    type,
}) {
    const { auth } = usePage().props;
    const [prescriptions, setPrescriptions] = useState([]);
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [paid, setPaid] = useState(false);
    const [loading, setLoading] = useState(false);
    const [medicationInput, setMedicationInput] = useState("");
    const [medication, setMedication] = useState(null);

    const patientFullName = patient
        ? `${patient.first_name}, ${patient.middle_initial || ""} ${patient.last_name}`
        : "WALK IN PATIENT";

    function closeModal() {
        if (paymentModalOpen || loading) return;
        closeBillingModal();
        setTimeout(() => {
            setPaid(false);
            setMedication(null);
            setMedicationInput("");
            setPrescriptions([]);
        }, 200);
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
            value: "N/A",
        },
        {
            id: "status",
            label: "Status:",
            value: "Unpaid",
        },
    ];

    function handleAddMedication(e) {
        e.preventDefault();
        if (!medication || loading) return;
        setPrescriptions((prev) => [
            ...prev,
            { id: medication.id + String(prev.length), medication, amount: 1 },
        ]);
        setMedication(null);
        setMedicationInput("");
    }

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
        return prescriptions.reduce(
            (sum, pres) => sum + calculateTotal(pres),
            0,
        );
    }

    const subtotal = calculateSubtotal();
    const discount = 0;
    const total = subtotal - discount;

    async function handleSubmit() {
        setLoading(true);
        const patientData = patient
            ? {
                  id: patient.id,
                  patient_id: patient.patient_id,
                  first_name: patient.first_name,
                  middle_initial: patient.middle_initial,
                  last_name: patient.last_name,
                  age: patient.age,
                  gender: patient.gender,
              }
            : {
                  id: null,
                  patient_id: null,
                  first_name: "",
                  middle_initial: "",
                  last_name: "",
                  age: null,
                  gender: "",
              };

        try {
            const data = {
                patient: patientData,
                service: {
                    id: "0",
                    name: type === "refill" ? "Prescription Refill" : "Walk In",
                    charge: 0,
                },
                prescriptions,
                total: subtotal,
                discount,
                final_total: total,
                paid: true,
            };
            const res = await axios.post(route("billingrecord.add"), data);

            if (res.data.success) {
                setPaid(true);
                setPaymentModalOpen(false);
            } else {
                toast.error("Failed to bill client");
            }
        } catch (error) {
            toast.error("An error occurred while billing client");
            console.error(error?.response?.data?.error || error.message);
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
                                {type === "refill"
                                    ? "REFILL MEDICATION BILLING FORM"
                                    : "WALK IN MEDICATION BILLING FORM"}
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
                                            <p className="text-xs text-[#47778B]">
                                                {patient
                                                    ? `${patient.age}, ${patient.gender}`
                                                    : "No data found"}
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
                                            <td className="p-2">Walk In</td>
                                            <td className="p-2 text-center">
                                                1
                                            </td>
                                            <td className="p-2 text-center">
                                                0
                                            </td>
                                            <td className="p-2 text-center">
                                                {formatPHP(0)}
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
                                                        No data found
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
                                <div className="sticky left-0 flex flex-col-reverse justify-between gap-6 sm:flex-row">
                                    <div className="flex flex-col gap-4">
                                        <p className="flex items-start gap-1 text-xs italic">
                                            <InfoIcon
                                                size={12}
                                                className="mt-0.5"
                                            />
                                            <span className="flex-1">
                                                Use the medication search bar to
                                                add over-the-counter drugs for
                                                this billing.
                                            </span>
                                        </p>
                                        <form
                                            onSubmit={handleAddMedication}
                                            className="relative"
                                        >
                                            <SearchInput
                                                value={medicationInput}
                                                onChange={(value) => {
                                                    setMedication(null);
                                                    setMedicationInput(value);
                                                }}
                                                onSelect={(medId) => {
                                                    const found =
                                                        medications.find(
                                                            (med) =>
                                                                med.id ===
                                                                medId,
                                                        );
                                                    setMedication(found);
                                                    setMedicationInput(
                                                        found.name,
                                                    );
                                                }}
                                                options={medications.map(
                                                    (opt) => ({
                                                        label: opt.name,
                                                        value: opt.id,
                                                    }),
                                                )}
                                                className="w-full bg-white"
                                                disabled={loading}
                                            />
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="absolute right-0 top-1/2 flex h-[110%] -translate-y-1/2 translate-x-2 items-center justify-center rounded-xl rounded-bl-none bg-accent p-4"
                                            >
                                                <PlusIcon
                                                    strokeWidth={5}
                                                    size={18}
                                                    color="white"
                                                />
                                            </button>
                                        </form>
                                    </div>
                                    <div className="mt-auto">
                                        <div className="flex justify-end gap-2 text-xs">
                                            <div
                                                colSpan={2}
                                                className="text-[#15475BA6]"
                                            >
                                                SUBTOTAL
                                            </div>
                                            <div className="w-[8vw] min-w-16 max-w-20" />
                                            <div className="w-[8vw] min-w-[78px] max-w-28 text-center">
                                                {formatPHP(subtotal)}
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-2 text-xs">
                                            <div
                                                colSpan={2}
                                                className="p-2 text-sm"
                                            >
                                                TOTAL
                                            </div>
                                            <div className="w-[8vw] min-w-16 max-w-20" />
                                            <div className="w-[8vw] min-w-[78px] max-w-28 p-2 text-center text-sm font-bold">
                                                {formatPHP(total)}
                                            </div>
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
                                        disabled={prescriptions.length < 1}
                                        className="rounded-md border border-accent bg-accent px-4 py-2 text-xs text-white duration-200 hover:bg-accent/90 disabled:pointer-events-none disabled:opacity-50"
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
                total={total}
                formatPHP={formatPHP}
                onSubmit={handleSubmit}
                loading={loading}
            />
        </>
    );
}
