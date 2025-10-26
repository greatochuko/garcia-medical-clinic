import Input from "@/Components/layout/Input";
import { useForm } from "@inertiajs/react";
import { Loader2Icon } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { route } from "ziggy-js";

export default function EditInventoryForm({ closeEditingForm, medication }) {
    const { data, post, processing, setData } = useForm({
        lastRunDate: new Date(),
        entryDetails: "Restock",
        quantity: 0,
        previousTotal: medication.quantity,
        expiryDate: new Date(medication.expirationDate),
    });

    function handleChangeQuantity() {
        if (data.entryDetails === "Restock") {
            setData((prev) => ({
                ...prev,
                quantity: Number(prev.quantity) + 1,
            }));
        } else {
            if (data.quantity > medication.quantity) return;
            setData((prev) => ({
                ...prev,
                quantity: Number(prev.quantity) - 1,
            }));
        }
    }

    function handleSave() {
        post(route("inventory.change.update", medication.id), {
            onSuccess: () => {
                closeEditingForm();
            },
            onError: (errors) => {
                Object.values(errors).forEach((error) => {
                    toast.error(error);
                });
            },
            preserveScroll: true,
        });
    }

    return (
        <tr>
            <td colSpan="7" className="bg-gray-100 p-4">
                <span className="text-xs font-bold">Stock Details</span>
                <div className="mt-2 flex justify-between gap-4">
                    <div className="flex max-w-40 flex-1 flex-col gap-1">
                        <label htmlFor="datePerformed" style={{ fontSize: 13 }}>
                            Date Performed{" "}
                            <span className="text-[#EF3616]">*</span>
                        </label>
                        <div className="relative flex max-w-40">
                            <Input
                                type="date"
                                name={"datePerformed"}
                                id={"datePerformed"}
                                value={
                                    new Date(data.lastRunDate)
                                        .toISOString()
                                        .split("T")[0]
                                }
                                onChange={(e) =>
                                    setData((prev) => ({
                                        ...prev,
                                        datePerformed: e.target.value,
                                    }))
                                }
                                className="w-0 flex-1 p-2"
                                required={true}
                                disabled={processing}
                            />
                            <img
                                src={"/assets/icons/calendar-icon-2.svg"}
                                alt={"Date icon"}
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                            />
                        </div>
                    </div>
                    <div className="flex max-w-48 flex-1 flex-col gap-3">
                        <div className="flex flex-col gap-1">
                            <label
                                htmlFor="entry-details"
                                style={{ fontSize: 13 }}
                            >
                                Entry Details{" "}
                                <span className="text-[#EF3616]">*</span>
                            </label>
                            <select
                                name="entry-details"
                                id="entry-details"
                                disabled={processing}
                                value={data.entryDetails}
                                onChange={(e) =>
                                    setData((prev) => ({
                                        ...prev,
                                        entryDetails: e.target.value,
                                        quantity: 0,
                                    }))
                                }
                                className="cursor-pointer rounded-lg border-accent p-2 text-sm outline-none focus:border-accent-500 focus:ring-2 focus:ring-[#089bab]/50 disabled:cursor-not-allowed disabled:bg-[#E4E4E4] disabled:text-gray-500"
                            >
                                <option value="Restock">
                                    Restock Medication
                                </option>
                                <option value="Pull Out">Pull Out</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                            <label htmlFor="quantity" style={{ fontSize: 13 }}>
                                Quantity{" "}
                                <span className="text-[#EF3616]">*</span>
                            </label>

                            <div className="flex">
                                <button
                                    onClick={handleChangeQuantity}
                                    className="flex w-10 items-center justify-center rounded-l-md bg-[#EAEAEA] outline-none duration-200 hover:bg-gray-300 focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-[#089bab]/50"
                                >
                                    {data.entryDetails === "Restock" ? (
                                        <FaPlus />
                                    ) : (
                                        <FaMinus />
                                    )}
                                </button>
                                <Input
                                    type="number"
                                    name="quantity"
                                    id="quantity"
                                    value={data.quantity}
                                    disabled={processing}
                                    min={
                                        data.entryDetails === "Restock" ? 0 : 1
                                    }
                                    onChange={(e) =>
                                        setData((prev) => ({
                                            ...prev,
                                            quantity: Number(e.target.value),
                                        }))
                                    }
                                    className="w-20 rounded-l-none border-0 bg-white"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex max-w-40 flex-1 flex-col gap-3">
                        <div className="flex flex-col gap-1">
                            <label
                                htmlFor="date-performed"
                                style={{ fontSize: 13 }}
                            >
                                Expiry Date{" "}
                                <span className="text-[#EF3616]">*</span>
                            </label>
                            <div className={`relative flex`}>
                                <Input
                                    type="date"
                                    name={"expiryDate"}
                                    id={"expiryDate"}
                                    value={
                                        new Date(data.expiryDate)
                                            .toISOString()
                                            .split("T")[0]
                                    }
                                    onChange={(e) =>
                                        setData((prev) => ({
                                            ...prev,
                                            expiryDate: e.target.value,
                                        }))
                                    }
                                    className="w-0 flex-1 p-2"
                                    required={true}
                                    disabled={processing}
                                />
                                <img
                                    src={"/assets/icons/calendar-icon-2.svg"}
                                    alt={"Date icon"}
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mb-1 flex items-end justify-center gap-3 text-xs">
                        <button
                            disabled={processing}
                            onClick={closeEditingForm}
                            className="rounded-md border border-accent bg-white px-3 py-2 text-accent duration-200 hover:bg-accent-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-1 rounded-md border border-accent bg-accent px-3 py-2 text-white duration-200 hover:bg-accent/90"
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
                                "Confirm"
                            )}
                        </button>
                    </div>
                </div>
            </td>
        </tr>
    );
}
