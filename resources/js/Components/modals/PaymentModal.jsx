import React from "react";
import ModalContainer from "../layout/ModalContainer";
import { XIcon } from "lucide-react";
import { Loader2Icon } from "lucide-react";
import { getUserFullName } from "@/utils/getUserFullname";

export default function PaymentModal({
    open,
    closeModal,
    formatPHP,
    patient,
    total,
    onSubmit,
    loading,
    cashTendered,
    setCashTendered,
}) {
    const patientFullName = patient
        ? getUserFullName(patient)
        : "WALK IN PATIENT";

    const handleNumberClick = (val) => {
        if (val === ".") {
            if (cashTendered.includes(".")) return; // prevent multiple decimals
            if (cashTendered === "") setCashTendered("0.");
            else setCashTendered(cashTendered + ".");
        } else {
            setCashTendered(cashTendered + val);
        }
    };

    const handleBackspace = () => {
        if (cashTendered.length > 0) {
            setCashTendered(cashTendered.slice(0, -1));
        }
    };

    const cashValue = parseFloat(cashTendered || "0");
    const change = cashValue - total;

    const [intPart, decPart] = cashTendered.split(".");

    return (
        <ModalContainer open={open} closeModal={closeModal}>
            <div
                onClick={(e) => e.stopPropagation()}
                className="max-h-[85%] w-[90%] max-w-lg divide-y-2 divide-accent-200 overflow-hidden rounded-lg bg-white"
            >
                <div className="relative p-4">
                    <h4 className="text-center text-sm font-semibold">
                        ENTER CASH TENDERED
                    </h4>
                    <button
                        disabled={loading}
                        type="button"
                        onClick={closeModal}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 duration-200 hover:bg-accent-200"
                    >
                        <XIcon size={16} strokeWidth={4} />
                    </button>
                </div>
                <div className="flex flex-col gap-4 p-4 sm:flex-row sm:gap-6">
                    <div className="flex flex-[1.2] flex-col justify-between">
                        <div className="flex items-center gap-4">
                            <img
                                src="/images/patient.png"
                                alt="patient profile picture"
                                className="h-14 w-14 rounded-full shadow-md"
                            />
                            <div className="flex flex-col gap-1">
                                <h4>{patientFullName}</h4>
                                <p className="text-xs text-[#47778B]">
                                    {patient
                                        ? `${patient.age}, ${patient.gender}`
                                        : "No data found"}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-4">
                            <p className="text-lg font-bold">
                                TOTAL BILL {formatPHP(total)}
                            </p>
                            <div className="flex w-full rounded-3xl bg-[#F5F7F8] p-1 text-lg">
                                <p className="p-3 text-[#B4BBC2]">PHP</p>
                                <p className="flex flex-1 items-center justify-center bg-white p-2">
                                    {intPart ? Number(intPart) : "0"}
                                </p>
                                <p className="p-3 text-[#B4BBC2]">
                                    .{decPart ? decPart.padEnd(2, 0) : "00"}
                                </p>
                            </div>
                            <p className="text-lg font-bold text-accent-orange">
                                CHANGE{" "}
                                {change.toLocaleString("en-PH", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </p>
                        </div>
                    </div>
                    <div className="grid flex-1 grid-cols-3 gap-2">
                        {Array.from({ length: 9 }, (_, i) => (
                            <button
                                disabled={loading}
                                key={i}
                                onClick={() => handleNumberClick(String(i + 1))}
                                className="rounded-md border border-[#D5D9E0] p-2 text-3xl duration-200 hover:bg-accent-200"
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            disabled={loading}
                            onClick={handleBackspace}
                            className="flex items-center justify-center rounded-md border border-[#D5D9E0] p-2 text-3xl duration-200 hover:bg-accent-200"
                        >
                            <img
                                src="/assets/icons/backspace-icon.svg"
                                alt="Backspace icon"
                                className="h-6 w-6"
                            />
                        </button>
                        <button
                            disabled={loading}
                            onClick={() => handleNumberClick("0")}
                            className="rounded-md border border-[#D5D9E0] p-2 text-3xl duration-200 hover:bg-accent-200"
                        >
                            0
                        </button>
                        <button
                            disabled={loading}
                            onClick={() => handleNumberClick(".")}
                            className="rounded-md border border-[#D5D9E0] p-2 text-3xl duration-200 hover:bg-accent-200"
                        >
                            .
                        </button>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-4 p-3 px-4">
                    <button
                        disabled={loading}
                        onClick={closeModal}
                        className="rounded-md border border-accent p-2 text-xs duration-200 hover:bg-accent-200"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={loading || cashTendered < total}
                        onClick={onSubmit}
                        className="flex items-center gap-2 rounded-md border border-accent bg-accent px-4 py-2 text-xs text-white duration-200 hover:bg-accent/90 disabled:pointer-events-none disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader2Icon
                                    size={14}
                                    className="animate-spin"
                                />{" "}
                                Processing...
                            </>
                        ) : (
                            "Submit"
                        )}
                    </button>
                </div>
            </div>
        </ModalContainer>
    );
}
