import React, { useEffect } from "react";
import ModalContainer from "../layout/ModalContainer";
import { XIcon } from "lucide-react";
import Input from "../layout/Input";
import { useForm } from "@inertiajs/react";
import ToggleSwitch from "../ui/ToggleSwitch";
import { route } from "ziggy-js";
import toast from "react-hot-toast";
import { Loader2Icon } from "lucide-react";

const allCategories = [
    "Pain Relief",
    "Antibiotic",
    "Diabetes",
    "Gastrointestinal",
    "Cardiovascular",
    "CNS",
    "Antifungal",
    "Antiviral",
    "Respiratory",
    "Allergy",
    "Dermatological",
    "Vitamins & Supplements",
    "Hormonal",
    "Ophthalmic",
    "ENT (Ear, Nose & Throat)",
    "Musculoskeletal",
    "Oncology",
    "Renal",
    "Immunological",
    "Psychiatric",
    "Anesthetic",
    "Antiseptic",
    "Antimalarial",
    "Anti-inflammatory",
    "Antihypertensive",
];

const initialData = {
    name: "",
    category: "",
    price: 0,
    quantity: 0,
    controlled: true,
};

export default function AddMedicineModal({
    open,
    closeModal: closeMedicineModal,
    medicineToEdit,
}) {
    const { data, setData, post, put, processing } = useForm(initialData);

    function closeModal() {
        setTimeout(() => {
            setData(initialData);
        }, 200);
        closeMedicineModal();
    }

    useEffect(() => {
        if (medicineToEdit) {
            setData({
                name: medicineToEdit.name,
                category: medicineToEdit.category,
                controlled: Boolean(medicineToEdit.controlled),
                price: medicineToEdit.price,
                quantity: medicineToEdit.quantity,
            });
        }
    }, [medicineToEdit, setData]);

    function handleSave() {
        post(route("inventory.add"), {
            onSuccess: () => {
                closeModal();
            },
            onError: (error) => {
                toast.error(Object.values(error)?.[0]);
            },
            preserveScroll: true,
        });
    }

    function handleUpdate() {
        put(route("inventory.update", medicineToEdit?.id), {
            onSuccess: () => {
                closeModal();
            },
            onError: (error) => {
                toast.error(Object.values(error)?.[0]);
            },
            preserveScroll: true,
        });
    }

    const cannotSubmit = !data.name || !data.category || data.price <= 0;

    return (
        <ModalContainer open={open} closeModal={closeModal}>
            <div
                onClick={(e) => e.stopPropagation()}
                className={`mx-auto w-[90%] max-w-lg divide-y-2 divide-accent-200 rounded-lg bg-white text-sm text-accent duration-200 ${open ? "" : "translate-y-2"}`}
            >
                <div className="flex items-center justify-between py-3 pl-4 pr-2">
                    <h4 className="font-semibold">Add Medication To List</h4>
                    <button className="rounded-md border border-transparent p-1 duration-200 hover:border-accent-300 hover:bg-accent-200">
                        <XIcon size={14} strokeWidth={5} />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4">
                    <div className="col-span-2 flex flex-col gap-1.5">
                        <label
                            htmlFor="medication-name"
                            className="text-[13px]"
                        >
                            Enter Medication
                            <span className="text-[#EF3616]"> *</span>
                        </label>
                        <Input
                            value={data.name}
                            onChange={(e) =>
                                setData((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                }))
                            }
                            id="medication-name"
                            name="medication-name"
                        />
                    </div>
                    <div className="col-span-2">
                        <div className="flex flex-col gap-1.5">
                            <label
                                htmlFor="medication-name"
                                className="text-[13px]"
                            >
                                Select Category
                                <span className="text-[#EF3616]"> *</span>
                            </label>
                            <select
                                name="category"
                                id="category"
                                value={data.category}
                                onChange={(e) =>
                                    setData((prev) => ({
                                        ...prev,
                                        category: e.target.value,
                                    }))
                                }
                                className="w-1/2 cursor-pointer rounded-lg border-accent-400 bg-accent-200 p-1.5 px-2 pr-6 text-[13px] outline-none duration-200 focus:border-accent-500 focus:ring-2 focus:ring-[#089bab]/50 disabled:cursor-not-allowed disabled:bg-[#E4E4E4] disabled:text-gray-500"
                            >
                                <option value="">All Categories</option>
                                {allCategories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="price" className="text-[13px]">
                            Price
                            <span className="text-[#EF3616]"> *</span>
                        </label>
                        <div className="flex w-fit overflow-hidden rounded-md border border-[#DFDFDF] duration-200 focus-within:border-accent-500 focus-within:ring-2 focus-within:ring-[#089bab]/50">
                            <p className="flex items-center justify-center bg-[#EAEAEA] px-2">
                                PHP
                            </p>
                            <Input
                                value={data.price}
                                onChange={(e) =>
                                    setData((prev) => ({
                                        ...prev,
                                        price: e.target.value,
                                    }))
                                }
                                type="number"
                                id="price"
                                name="price"
                                min={0}
                                className="w-20 rounded-none border-none focus:border-none focus:ring-0"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="quantity" className="text-[13px]">
                            Quantity
                            <span className="text-[#EF3616]"> *</span>
                        </label>
                        <Input
                            value={data.quantity}
                            onChange={(e) =>
                                setData((prev) => ({
                                    ...prev,
                                    quantity: e.target.value,
                                }))
                            }
                            type="number"
                            id="quantity"
                            name="quantity"
                            min={0}
                            className="w-20"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="controlled" className="text-[13px]">
                            Controlled (?)
                        </label>
                        <ToggleSwitch
                            onChange={(value) =>
                                setData((prev) => ({
                                    ...prev,
                                    controlled: value,
                                }))
                            }
                            checked={data.controlled}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4 px-4 py-3">
                    <button
                        onClick={closeModal}
                        className="rounded-md border border-accent p-2 text-xs duration-200 hover:bg-accent-200"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={cannotSubmit || processing}
                        onClick={medicineToEdit ? handleUpdate : handleSave}
                        className="flex items-center gap-2 rounded-md border border-accent bg-accent px-4 py-2 text-xs text-white duration-200 hover:bg-accent/90 disabled:pointer-events-none disabled:opacity-50"
                    >
                        {processing ? (
                            <>
                                <Loader2Icon
                                    size={14}
                                    className="animate-spin"
                                />
                                {medicineToEdit ? "Updating" : "Saving"}...
                            </>
                        ) : medicineToEdit ? (
                            "Update"
                        ) : (
                            "Save"
                        )}
                    </button>
                </div>
            </div>
        </ModalContainer>
    );
}
