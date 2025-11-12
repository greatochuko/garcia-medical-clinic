import React from "react";
import ModalContainer from "../layout/ModalContainer";
import { XIcon } from "lucide-react";
import Input from "../layout/Input";
import { Loader2Icon } from "lucide-react";

const formFields = [
    { label: "Electricity Bill", id: "electricity" },
    { label: "Water Bill", id: "water" },
    { label: "Internet Bill", id: "internet" },
    { label: "Salary", id: "salary" },
    { label: "Rent", id: "rent" },
];

export default function InputExpensesModal({
    open,
    closeModal,
    data,
    setData,
    processing,
    handleSave,
}) {
    function handleSubmit(e) {
        e.preventDefault();

        handleSave();
    }
    return (
        <ModalContainer open={open} closeModal={closeModal}>
            <form
                onClick={(e) => e.stopPropagation()}
                onSubmit={handleSubmit}
                className={`mx-auto w-[90%] max-w-lg divide-y-2 divide-accent-200 rounded-lg bg-white text-sm text-accent duration-200 ${open ? "" : "translate-y-2"}`}
            >
                <div className="flex items-center justify-between py-3 pl-4 pr-2">
                    <h4 className="font-semibold">INPUT EXPENSES</h4>
                    <button
                        onClick={closeModal}
                        className="rounded-md border border-transparent p-1 duration-200 hover:border-accent-300 hover:bg-accent-200"
                    >
                        <XIcon size={14} strokeWidth={5} />
                    </button>
                </div>

                <div className="flex flex-col gap-4 p-4">
                    <p className="flex items-start gap-2 text-[13px]">
                        <img
                            src="/assets/icons/info-icon.svg"
                            alt="info icon"
                            className="mt-1"
                        />
                        Your monthly expenses on this clinic are listed below.
                        To accurately monitor your expenses, please update this
                        form regularly.
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                        {formFields.map((field) => (
                            <div
                                key={field.id}
                                className="flex flex-col gap-1.5"
                            >
                                <label
                                    htmlFor={field.id}
                                    className="text-[13px]"
                                >
                                    {field.label}
                                    <span className="text-[#EF3616]"> *</span>
                                </label>
                                <div className="relative flex">
                                    <span className="absolute flex h-full items-center justify-center rounded-l-md bg-[#EAEAEA] px-2">
                                        PHP
                                    </span>
                                    <Input
                                        value={data[field.id]}
                                        onChange={(e) =>
                                            setData((prev) => ({
                                                ...prev,
                                                [field.id]:
                                                    parseFloat(
                                                        e.target.value,
                                                    ) || 0,
                                            }))
                                        }
                                        type="number"
                                        id={field.id}
                                        name={field.id}
                                        className="w-0 flex-1 pl-14"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4 px-4 py-3">
                    <button
                        onClick={closeModal}
                        type="button"
                        className="rounded-md border border-accent p-2 text-xs duration-200 hover:bg-accent-200"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={processing}
                        type="submit"
                        className="flex items-center gap-2 rounded-md border border-accent bg-accent px-4 py-2 text-xs text-white duration-200 hover:bg-accent/90 disabled:pointer-events-none disabled:opacity-50"
                    >
                        {processing ? (
                            <>
                                <Loader2Icon
                                    size={14}
                                    className="animate-spin"
                                />
                                Saving...
                            </>
                        ) : (
                            "Save"
                        )}
                    </button>
                </div>
            </form>
        </ModalContainer>
    );
}
