import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { route } from "ziggy-js";
import PatientEntryModal from "@/Components/modals/PatientEntryModal";
import Input from "@/Components/layout/Input";
import { PlusIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { Loader2Icon } from "lucide-react";

export default function PatientEntryCard({
    entry,
    entryData,
    index,
    setPatientEntryData,
    patientId,
    appointmentId,
    patientEntryData,
}) {
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [modifyEntryModalOpen, setModifyEntryModalOpen] = useState(false);
    const [entryList, setEntryList] = useState(
        entryData.data.map((ent) => ({
            id: ent.id,
            value: ent[entry.id],
        })),
    );

    function handleAddEntry(e) {
        e.preventDefault();

        router.post(
            route(`patientvisitform.patientEntryAdd.${entry.id}`),
            {
                patient_id: patientId,
                appointment_id: appointmentId,
                [entry.id]: patientEntryData[entry.id].input,
            },
            {
                onSuccess: (res) => {
                    setPatientEntryData((prev) => ({
                        ...prev,
                        [entry.id]: {
                            data: res.props.patient[entry.id] || [],
                            input: "",
                        },
                    }));
                    setEntryList(
                        res.props.patient[entry.id].map((ent) => ({
                            id: ent.id,
                            value: ent[entry.id],
                        })) || [],
                    );
                },
                onError: (errors) => {
                    console.error(errors);
                },
                onStart: () => {
                    setLoading(true);
                },
                onFinish: () => {
                    setLoading(false);
                },
                preserveScroll: true,
                preserveState: true,
            },
        );
    }

    function openPatientEntryModal() {
        setModifyEntryModalOpen(true);
    }

    function handleUpdateEntry(newEntryList) {
        const entriesToDelete = entryData.data.filter(
            (en) => !newEntryList.some((newEnt) => newEnt.id === en.id),
        );

        const entriesToUpdate = newEntryList.map((en) => ({
            id: en.id,
            [entry.id]: en.value,
        }));

        router.put(
            route(`patientvisitform.patientEntryUpdate.${entry.id}`),
            {
                entriesToDelete,
                entriesToUpdate,
            },
            {
                onStart: () => {
                    setUpdating(true);
                },
                onFinish: () => {
                    setUpdating(false);
                },
                onSuccess: () => {
                    setPatientEntryData((prev) => ({
                        ...prev,
                        [entry.id]: {
                            data: newEntryList.map((newEntry) => ({
                                id: newEntry.id,
                                [entry.id]: newEntry.value,
                            })),
                            input: "",
                        },
                    }));
                    setModifyEntryModalOpen(false);
                },
                onError: (errors) => {
                    console.error(errors);
                },
                preserveScroll: true,
            },
        );
    }

    return (
        <>
            <div
                className={twMerge(
                    `flex flex-col divide-y-2 divide-accent-200 rounded-md bg-white text-sm shadow-md ${
                        index < 2
                            ? "sm:col-span-3"
                            : `lg:col-span-2 ${entry.id === "medical_records" ? "sm:col-span-6" : "sm:col-span-3"}`
                    }`,
                )}
            >
                <div className="relative p-4">
                    <h3 className="text-center font-semibold">{entry.title}</h3>
                    <button
                        onClick={openPatientEntryModal}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2"
                    >
                        <img
                            src={
                                entry.id === "medical_records"
                                    ? "/assets/icons/profile-card-icon.svg"
                                    : "/assets/icons/edit-icon-2.svg"
                            }
                            alt="edit icon"
                            width={18}
                            height={18}
                        />
                    </button>

                    {entry.id === "plan" && (
                        <div className="absolute left-1/2 top-full flex min-w-max -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-md bg-accent-200 p-1">
                            <button className="flex items-center gap-2 rounded-md border border-dashed border-accent bg-white px-2 py-1 text-xs font-medium duration-200 hover:bg-accent-100">
                                <img
                                    src="/assets/icons/laboratory-icon.svg"
                                    alt="pills icon"
                                />
                                LAB REQUEST
                            </button>
                            <button className="flex items-center gap-2 rounded-md border border-dashed border-accent bg-white px-2 py-1 text-xs font-medium duration-200 hover:bg-accent-100">
                                <img
                                    src="/assets/icons/med-certification-icon.svg"
                                    alt="pills icon"
                                />
                                MED CERTIFICATE
                            </button>
                        </div>
                    )}
                </div>
                <ul className="flex h-60 flex-col gap-2 overflow-y-auto break-words p-4">
                    {patientEntryData[entry.id].data.map((datum) => (
                        <li key={datum.id}>
                            <span className="mr-2 font-bold">&gt;</span>
                            {datum[entry.id]}
                        </li>
                    ))}
                </ul>
                {!entry.hideInput && (
                    <div className="p-4">
                        <form onSubmit={handleAddEntry} className="relative">
                            <Input
                                // disabled={loading}
                                value={entryData.input}
                                onChange={(e) =>
                                    setPatientEntryData((prev) => ({
                                        ...prev,
                                        [entry.id]: {
                                            ...prev[entry.id],
                                            input: e.target.value,
                                        },
                                    }))
                                }
                                className="w-full rounded-xl p-3 pr-16"
                            />
                            <button
                                type="submit"
                                disabled={!entryData.input || loading}
                                className="absolute right-0 top-1/2 flex h-full -translate-y-1/2 items-center justify-center rounded-xl rounded-bl-none bg-accent px-4 disabled:opacity-50"
                            >
                                {loading ? (
                                    <Loader2Icon
                                        size={20}
                                        className="animate-spin text-white"
                                    />
                                ) : (
                                    <PlusIcon
                                        size={20}
                                        strokeWidth={5}
                                        color="#fff"
                                    />
                                )}
                            </button>
                        </form>
                    </div>
                )}
            </div>

            <PatientEntryModal
                closeModal={() => setModifyEntryModalOpen(false)}
                open={modifyEntryModalOpen}
                entryList={entryList}
                setEntryList={setEntryList}
                entryId={entry.id}
                updating={updating}
                onSaveEntry={handleUpdateEntry}
            />
        </>
    );
}
