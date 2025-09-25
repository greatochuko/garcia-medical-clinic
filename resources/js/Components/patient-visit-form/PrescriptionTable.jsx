import React, { useState } from "react";
import Input from "../layout/Input";
import MedicationDropdown from "./MedicationDropdown";
import { Loader2Icon } from "lucide-react";
import { PlusIcon } from "lucide-react";
import { router } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function PrescriptionTable({
    prescriptions,
    data,
    medications,
    processing,
    setData,
    setPrescriptions,
}) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [prescriptionLoading, setPrescriptionLoading] = useState("");

    const fieldVacant = Object.values(data).some((val) => !val?.trim());

    function handleDeletePrescription(prescriptionId) {
        router.delete(
            route("patientvisitform.patientprescriptionremove", prescriptionId),
            {
                onSuccess: () => {
                    setPrescriptions((prev) =>
                        prev.filter((p) => p.id !== prescriptionId),
                    );
                },
                onStart: () => {
                    setPrescriptionLoading(prescriptionId);
                },
                onFinish: () => {
                    setPrescriptionLoading("");
                },
                preserveScroll: true,
                preserveState: true,
            },
        );
    }

    return (
        <>
            <table className="w-full border-collapse">
                <thead className="sticky top-0 z-10 bg-accent-200">
                    <tr>
                        <th className="w-3/10 min-w-48 whitespace-nowrap px-2 py-4 pl-4 text-left font-normal">
                            Medication Name
                        </th>
                        <th className="w-1/10 min-w-20 whitespace-nowrap px-2 py-4 text-center font-normal">
                            Dose
                        </th>
                        <th className="w-3/10 whitespace-nowrap px-2 py-4 text-left font-normal">
                            Frequency / Instruction
                        </th>
                        <th className="w-1/10 whitespace-nowrap px-2 py-4 text-center font-normal">
                            Duration (Days)
                        </th>
                        <th className="w-1/10 whitespace-nowrap px-2 py-4 text-center font-normal">
                            Amount (#)
                        </th>
                        <th className="w-1/10 whitespace-nowrap px-2 py-4 pr-4 text-center font-normal">
                            Action
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {prescriptions.map((pres, i) => (
                        <tr key={i} className="even:bg-[#F8F8F8]">
                            <td className="overflow-hidden px-2 py-4 pl-4">
                                {pres.medication}
                            </td>
                            <td className="px-2 py-4 text-center">
                                {pres.dosage}
                            </td>
                            <td className="px-2 py-4">{pres.frequency}</td>
                            <td className="px-2 py-4 text-center">
                                {pres.duration}
                            </td>
                            <td className="px-2 py-4 text-center">
                                {pres.amount}
                            </td>
                            <td className="px-2 py-4 pr-4 text-center">
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        className="rounded-md border border-transparent p-1 duration-100 hover:border-accent-400 hover:bg-accent-300"
                                        disabled={
                                            prescriptionLoading === pres.id
                                        }
                                    >
                                        <img
                                            src="/assets/icons/edit-icon.svg"
                                            alt="Edit Icon"
                                            width={16}
                                            height={16}
                                            className="h-4 w-4"
                                        />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDeletePrescription(pres.id)
                                        }
                                        disabled={
                                            prescriptionLoading === pres.id
                                        }
                                        className="rounded-md border border-transparent p-1 duration-100 hover:border-accent-400 hover:bg-accent-300"
                                    >
                                        {prescriptionLoading === pres.id ? (
                                            <Loader2Icon
                                                size={16}
                                                className="animate-spin"
                                            />
                                        ) : (
                                            <img
                                                src="/assets/icons/delete-icon.svg"
                                                alt="Edit Icon"
                                                width={16}
                                                height={16}
                                                className="h-4 w-4"
                                            />
                                        )}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Sticky bottom input row */}
            <div className="sticky bottom-0 z-10 mt-auto flex min-w-min bg-white">
                <div className="w-3/10 min-w-48 px-2 py-4 pl-4">
                    <div className="group relative">
                        <Input
                            disabled={processing}
                            placeholder="Medication name"
                            className="w-full px-2"
                            value={data.medication}
                            onChange={(e) => {
                                setDropdownOpen(true);
                                setData((prev) => ({
                                    ...prev,
                                    medication: e.target.value,
                                }));
                            }}
                        />
                        {dropdownOpen && (
                            <MedicationDropdown
                                medications={medications}
                                medicationInput={data.medication}
                                setMedicationInput={(value) => {
                                    setDropdownOpen(false);

                                    setData((prev) => ({
                                        ...prev,
                                        medication: value,
                                    }));
                                }}
                            />
                        )}
                    </div>
                </div>
                <div className="w-1/10 min-w-20 px-2 py-4">
                    <Input
                        disabled={processing}
                        placeholder="Dose"
                        className="w-full"
                        value={data.dosage}
                        onChange={(e) =>
                            setData((prev) => ({
                                ...prev,
                                dosage: e.target.value,
                            }))
                        }
                    />
                </div>
                <div className="w-3/10 min-w-[177.5px] px-2 py-4">
                    <Input
                        disabled={processing}
                        placeholder="Frequency"
                        className="w-full px-2"
                        value={data.frequency}
                        onChange={(e) =>
                            setData((prev) => ({
                                ...prev,
                                frequency: e.target.value,
                            }))
                        }
                    />
                </div>
                <div className="w-1/10 min-w-[127px] px-2 py-4">
                    <Input
                        disabled={processing}
                        type="number"
                        placeholder="Duration"
                        className="w-full px-2"
                        value={data.duration}
                        onChange={(e) =>
                            setData((prev) => ({
                                ...prev,
                                duration: e.target.value,
                            }))
                        }
                    />
                </div>
                <div className="w-1/10 min-w-[100px] px-2 py-4">
                    <Input
                        disabled={processing}
                        type="number"
                        placeholder="Amount"
                        className="w-full px-2"
                        value={data.amount}
                        onChange={(e) =>
                            setData((prev) => ({
                                ...prev,
                                amount: e.target.value,
                            }))
                        }
                    />
                </div>
                <div className="w-1/10 px-2 py-4 pr-4 text-center">
                    <button
                        type="submit"
                        disabled={fieldVacant || processing}
                        className="mx-auto flex items-center justify-center rounded-xl rounded-bl-none bg-accent p-2 px-4 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {processing ? (
                            <Loader2Icon
                                size={20}
                                color="#fff "
                                className="animate-spin"
                            />
                        ) : (
                            <PlusIcon size={20} strokeWidth={5} color="#fff" />
                        )}
                    </button>
                </div>
            </div>
        </>
    );
}
