import React, { useState } from "react";
import Input from "../layout/Input";
import { Loader2Icon } from "lucide-react";
import { PlusIcon } from "lucide-react";
import { router, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import SearchInput from "../ui/SearchInput";
import { SaveIcon } from "lucide-react";
import XIcon from "../icons/XIcon";

export default function PrescriptionTable({
    prescriptions,
    data,
    inputOptions,
    processing,
    setData,
    setPrescriptions,
}) {
    const [prescriptionLoading, setPrescriptionLoading] = useState("");
    const { medications, frequencies } = inputOptions;
    const { data: prescriptionToEdit, setData: setPrescriptionToEdit } =
        useForm({});

    const requiredFields = [
        "medication",
        "dosage",
        "frequency",
        "duration",
        "amount",
    ];

    const fieldVacant = requiredFields.some((key) => {
        const val = data[key];
        return typeof val === "string"
            ? !val.trim()
            : val === null || val === undefined;
    });

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

    function handleUpdatePrescription() {
        router.put(
            route(
                "patientvisitform.patientprescriptionupdate",
                prescriptionToEdit.id,
            ),
            {
                patient_id: prescriptionToEdit.patient_id,
                appointment_id: prescriptionToEdit.appointment_id,
                medication_id:
                    prescriptionToEdit.medication_id ??
                    prescriptionToEdit.medication?.id ??
                    null,
                medication: prescriptionToEdit.medication?.name ?? "",
                dosage: prescriptionToEdit.dosage,
                frequency_id:
                    prescriptionToEdit.frequency_id ??
                    prescriptionToEdit.frequency?.id ??
                    null,
                frequency: prescriptionToEdit.frequency?.name ?? "",
                amount: prescriptionToEdit.amount,
                duration: prescriptionToEdit.duration,
            },
            {
                onSuccess: () => {
                    setPrescriptions((prev) =>
                        prev.map((p) =>
                            p.id === prescriptionToEdit.id
                                ? prescriptionToEdit
                                : p,
                        ),
                    );
                    setPrescriptionToEdit(null);
                },
                onStart: () => {
                    setPrescriptionLoading(prescriptionToEdit.id);
                },
                onFinish: () => {
                    setPrescriptionLoading("");
                },
                preserveScroll: true,
                preserveState: true,
            },
        );
    }

    function cancelPrescriptionEditing() {
        setPrescriptionToEdit(null);
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
                            {prescriptionToEdit?.id === pres.id ? (
                                <PrescriptionEditingRow
                                    frequencies={frequencies}
                                    loading={prescriptionLoading}
                                    medications={medications}
                                    pres={pres}
                                    prescriptionToEdit={prescriptionToEdit}
                                    setPrescriptionToEdit={
                                        setPrescriptionToEdit
                                    }
                                />
                            ) : (
                                <>
                                    <td className="overflow-hidden px-2 py-4 pl-4">
                                        {pres.medication.name}
                                    </td>
                                    <td className="px-2 py-4 text-center">
                                        {pres.dosage}
                                    </td>
                                    <td className="px-2 py-4">
                                        {pres.frequency.name}
                                    </td>
                                    <td className="px-2 py-4 text-center">
                                        {pres.duration}
                                    </td>
                                    <td className="px-2 py-4 text-center">
                                        {pres.amount}
                                    </td>
                                </>
                            )}
                            <td className="px-2 py-4 pr-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                    {prescriptionToEdit?.id === pres.id ? (
                                        <>
                                            <button
                                                type="button"
                                                onClick={
                                                    handleUpdatePrescription
                                                }
                                                disabled={prescriptionLoading}
                                                className="rounded-md border border-transparent p-[3px] transition-colors duration-100 hover:border-accent-400 hover:bg-accent-300"
                                            >
                                                {prescriptionLoading ? (
                                                    <Loader2Icon
                                                        size={16}
                                                        className="animate-spin"
                                                    />
                                                ) : (
                                                    <SaveIcon size={18} />
                                                )}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={
                                                    cancelPrescriptionEditing
                                                }
                                                disabled={prescriptionLoading}
                                                className="rounded-md border border-transparent p-[3px] transition-colors duration-100 hover:border-accent-400 hover:bg-accent-300"
                                            >
                                                <XIcon size={18} />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setPrescriptionToEdit(pres)
                                                }
                                                disabled={
                                                    prescriptionLoading ===
                                                    pres.id
                                                }
                                                className="rounded-md border border-transparent p-1 duration-100 hover:border-accent-400 hover:bg-accent-300"
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
                                                    handleDeletePrescription(
                                                        pres.id,
                                                    )
                                                }
                                                disabled={
                                                    prescriptionLoading ===
                                                    pres.id
                                                }
                                                className="rounded-md border border-transparent p-1 duration-100 hover:border-accent-400 hover:bg-accent-300"
                                            >
                                                {prescriptionLoading ===
                                                pres.id ? (
                                                    <Loader2Icon
                                                        size={16}
                                                        className="animate-spin"
                                                    />
                                                ) : (
                                                    <img
                                                        src="/assets/icons/delete-icon.svg"
                                                        alt="Delete Icon"
                                                        width={16}
                                                        height={16}
                                                        className="h-4 w-4"
                                                    />
                                                )}
                                            </button>
                                        </>
                                    )}
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
                        <SearchInput
                            onChange={(value) =>
                                setData((prev) => ({
                                    ...prev,
                                    medication_id: null, // clear id if user types
                                    medication: value, // keep name for display
                                }))
                            }
                            onSelect={(value) => {
                                const med = medications.find(
                                    (m) => m.name === value,
                                );
                                setData((prev) => ({
                                    ...prev,
                                    medication_id: med?.id || null, // store the id here
                                    medication: med?.name || value, // keep name for showing in the field
                                }));
                            }}
                            options={medications.map((med) => ({
                                label: med.name,
                                value: med.name,
                            }))}
                            value={data.medication}
                            disabled={processing}
                            placeholder="Medication name"
                            className="p-2"
                        />
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
                    <SearchInput
                        value={data.frequency}
                        onChange={(value) =>
                            setData((prev) => ({
                                ...prev,
                                frequency_id: null, // clear id if user types
                                frequency: value, // keep name for display
                            }))
                        }
                        onSelect={(value) => {
                            const freq = frequencies.find(
                                (f) => f.name === value,
                            );
                            setData((prev) => ({
                                ...prev,
                                frequency_id: freq?.id || null, // store the id
                                frequency: freq?.name || value, // keep name for display
                            }));
                        }}
                        options={frequencies.map((f) => ({
                            label: f.name,
                            value: f.name,
                        }))}
                        disabled={processing}
                        placeholder="Frequency"
                        className="w-full px-2"
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

function PrescriptionEditingRow({
    prescriptionToEdit,
    setPrescriptionToEdit,
    medications,
    pres,
    frequencies,
    loading,
}) {
    return (
        <>
            {/* Medication */}
            <td className="px-2 py-2 pl-4">
                <div className="flex w-full">
                    <SearchInput
                        value={prescriptionToEdit.medication?.name || ""}
                        onChange={(value) =>
                            setPrescriptionToEdit((prev) => ({
                                ...prev,
                                medication_id: null, // clear id if user types
                                medication: {
                                    ...prev.medication,
                                    name: value,
                                },
                            }))
                        }
                        onSelect={(value) => {
                            const med = medications.find(
                                (m) => m.name === value,
                            );
                            setPrescriptionToEdit((prev) => ({
                                ...prev,
                                medication_id: med?.id || null, // store id
                                medication: med || {
                                    name: value,
                                },
                            }));
                        }}
                        options={medications.map((med) => ({
                            label: med.name,
                            value: med.name,
                        }))}
                        disabled={loading}
                        placeholder="Medication name"
                        className="p-2 py-1.5"
                        containerClassName="w-0 flex-1"
                        position="bottom"
                    />
                </div>
            </td>

            {/* Dosage */}
            <td className="px-2 py-2 text-center">
                <div className="flex w-full">
                    <Input
                        value={prescriptionToEdit.dosage || ""}
                        onChange={(e) =>
                            setPrescriptionToEdit((prev) => ({
                                ...prev,
                                dosage: e.target.value,
                            }))
                        }
                        disabled={loading}
                        placeholder="Dose"
                        className="w-0 flex-1 px-2 py-1.5"
                    />
                </div>
            </td>

            {/* Frequency */}
            <td className="px-2 py-2">
                <div className="flex w-full">
                    <SearchInput
                        className="p-2 py-1.5"
                        containerClassName="w-0 flex-1"
                        value={prescriptionToEdit.frequency?.name || ""}
                        onChange={(value) =>
                            setPrescriptionToEdit((prev) => ({
                                ...prev,
                                frequency_id: null, // clear id if user types
                                frequency: {
                                    ...prev.frequency,
                                    name: value,
                                },
                            }))
                        }
                        onSelect={(value) => {
                            const freq = frequencies.find(
                                (f) => f.name === value,
                            );
                            setPrescriptionToEdit((prev) => ({
                                ...prev,
                                frequency_id: freq?.id || null, // store id
                                frequency: freq || {
                                    name: value,
                                },
                            }));
                        }}
                        options={frequencies.map((f) => ({
                            label: f.name,
                            value: f.name,
                        }))}
                        disabled={loading}
                        placeholder="Frequency"
                        position="bottom"
                    />
                </div>
            </td>

            {/* Duration */}
            <td className="px-2 py-2 text-center">
                <div className="flex w-full">
                    <Input
                        type="number"
                        value={prescriptionToEdit.duration || ""}
                        onChange={(e) =>
                            setPrescriptionToEdit((prev) => ({
                                ...prev,
                                duration: e.target.value,
                            }))
                        }
                        disabled={loading}
                        placeholder="Duration"
                        className="w-0 flex-1 px-2 py-1.5"
                    />
                </div>
            </td>

            {/* Amount */}
            <td className="px-2 py-2 text-center">
                <div className="flex w-full">
                    <Input
                        type="number"
                        value={prescriptionToEdit.amount || ""}
                        onChange={(e) =>
                            setPrescriptionToEdit((prev) => ({
                                ...prev,
                                amount: e.target.value,
                            }))
                        }
                        disabled={loading}
                        placeholder="Amount"
                        className="w-0 flex-1 px-2 py-1.5"
                    />
                </div>
            </td>
        </>
    );
}
