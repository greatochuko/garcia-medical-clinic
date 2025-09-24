import React, { useState } from "react";
import ModalContainer from "../layout/ModalContainer";
import { useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import LoadingIndicator from "../layout/LoadingIndicator";
import { XIcon } from "lucide-react";
import toast from "react-hot-toast";

export default function MedicalHistoryModal({
    open,
    closeModal: closeMedicalHistoryModal,
    patientId,
    medicalHistory,
    setMedicalHistory,
}) {
    const { processing, data, setData, post } = useForm({
        diseases: medicalHistory || [],
        patient_id: patientId.toString(),
    });

    const [inputValue, setInputValue] = useState("");

    function closeModal() {
        closeMedicalHistoryModal();
        setTimeout(() => {
            setData((prev) => ({ ...prev, diseases: medicalHistory }));
        }, 300);
    }

    function handleAdd(e) {
        if (e.key === "Enter" && inputValue.trim() !== "") {
            e.preventDefault();
            if (!data.diseases.includes(inputValue.trim())) {
                setData((prev) => ({
                    ...prev,
                    diseases: [...prev.diseases, inputValue.trim()],
                }));
            }
            setInputValue("");
        } else if (e.key === "Backspace" && inputValue === "") {
            e.preventDefault();
            const newHistory = [...data.diseases];
            newHistory.pop();
            setData((prev) => ({ ...prev, diseases: newHistory }));
        }
    }

    function handleRemove(item) {
        setData((prev) => ({
            ...prev,
            diseases: prev.diseases.filter((h) => h !== item),
        }));
    }

    function handleSave() {
        post(route("patientvisitform.add_medical_history"), {
            onSuccess: () => {
                setMedicalHistory(data.diseases);
                toast.success("Medical history updated successfully");
                closeModal();
            },

            onError: (err) => {
                console.error(err);
                toast.error("Failed to update medical history");
            },
        });
    }

    function closeDeleteModal() {
        if (processing) return;
        closeModal();
    }

    return (
        <ModalContainer closeModal={closeDeleteModal} open={open}>
            <div
                onClick={(e) => e.stopPropagation()}
                className={`w-[90%] max-w-xl divide-y-2 divide-accent-200 rounded-lg bg-white text-sm duration-200 ${open ? "" : "translate-y-2"}`}
            >
                <div className="flex items-center justify-between p-2 px-4 pr-2">
                    <h5 className="font-semibold">Update Medical History</h5>
                    <button
                        onClick={closeDeleteModal}
                        className="rounded-full p-2 duration-200 hover:bg-accent-200"
                    >
                        <XIcon size={20} />
                    </button>
                </div>

                <div className="flex flex-col gap-2 p-4">
                    <label htmlFor="medical-history">
                        Enter patient medical history, press enter to enter
                        multiple medical history.
                    </label>

                    {/* Tag container */}
                    <label
                        htmlFor="medical-history"
                        className="min-h-40 rounded-md border border-[#dfdfdf] bg-accent-200 p-2"
                    >
                        <div className="flex flex-wrap gap-2 text-[13px]">
                            {data.diseases.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-2 rounded-md bg-accent px-2 py-1 text-white"
                                >
                                    <span>{item}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemove(item)}
                                        className="text-white"
                                    >
                                        <XIcon size={14} strokeWidth={3} />
                                    </button>
                                </div>
                            ))}
                            <input
                                type="text"
                                id="medical-history"
                                name="medical-history"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleAdd}
                                disabled={processing}
                                className="min-w-0 flex-1 border-0 bg-transparent px-2 py-[3px] text-[13px] focus:ring-0"
                                // placeholder="Type and press Enter..."
                            />
                        </div>
                    </label>
                </div>

                <div className="flex items-center justify-end gap-4 p-4 text-xs">
                    <button
                        onClick={closeDeleteModal}
                        disabled={processing}
                        className="btn rounded-md border border-accent px-4 py-2 duration-200 hover:bg-accent-200"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={processing || !data.diseases.length}
                        onClick={handleSave}
                        className="btn flex items-center gap-2 rounded-md border border-accent bg-accent px-4 py-2 text-white duration-200 hover:bg-accent/90 disabled:pointer-events-none disabled:opacity-50"
                    >
                        {processing ? (
                            <>
                                <LoadingIndicator /> Saving...
                            </>
                        ) : (
                            "Save"
                        )}
                    </button>
                </div>
            </div>
        </ModalContainer>
    );
}
