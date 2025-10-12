import React, { useEffect } from "react";
import ModalContainer from "../layout/ModalContainer";
import { XIcon } from "lucide-react";
import Input from "../layout/Input";
import { useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import toast from "react-hot-toast";
import { Loader2Icon } from "lucide-react";

const patientTypes = ["Regular", "Senior"];

const initialData = {
    name: "",
    patient_type: "Regular",
    charge: 0,
};

export default function AddServiceModal({
    open,
    closeModal: closeServiceModal,
    serviceToEdit,
}) {
    const { data, setData, post, put, processing } = useForm(initialData);

    function closeModal() {
        setTimeout(() => {
            setData(initialData);
        }, 200);
        closeServiceModal();
    }

    useEffect(() => {
        if (serviceToEdit) {
            setData({
                name: serviceToEdit.name,
                patient_type: serviceToEdit.patient_type,
                charge: parseFloat(serviceToEdit.charge.replace(/,/g, "")),
            });
        }
    }, [serviceToEdit, setData]);

    function handleSave() {
        post(route("service-charges.store"), {
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
        put(route("service-charges.update", serviceToEdit?.id), {
            onSuccess: () => {
                closeModal();
            },
            onError: (error) => {
                toast.error(Object.values(error)?.[0]);
            },
            preserveScroll: true,
        });
    }

    const cannotSubmit = !data.name || !data.patient_type || data.charge <= 0;

    return (
        <ModalContainer open={open} closeModal={closeModal}>
            <div
                onClick={(e) => e.stopPropagation()}
                className={`mx-auto w-[90%] max-w-lg divide-y-2 divide-accent-200 rounded-lg bg-white text-sm text-accent duration-200 ${open ? "" : "translate-y-2"}`}
            >
                <div className="flex items-center justify-between py-3 pl-4 pr-2">
                    <h4 className="font-semibold">Add Service</h4>
                    <button className="rounded-md border border-transparent p-1 duration-200 hover:border-accent-300 hover:bg-accent-200">
                        <XIcon size={14} strokeWidth={5} />
                    </button>
                </div>

                <div className="flex flex-col gap-4 p-4">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="service-name" className="text-[13px]">
                            Service Name
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
                            id="service-name"
                            name="service-name"
                        />
                    </div>
                    <div>
                        <div className="flex flex-col gap-1.5">
                            <label
                                htmlFor="patient-type"
                                className="text-[13px]"
                            >
                                Patient Type
                                <span className="text-[#EF3616]"> *</span>
                            </label>
                            <select
                                name="patient-type"
                                id="patient-type"
                                value={data.patient_type}
                                onChange={(e) =>
                                    setData((prev) => ({
                                        ...prev,
                                        patient_type: e.target.value,
                                    }))
                                }
                                className="max-w-60 cursor-pointer rounded-lg border-accent-400 bg-accent-200 p-1.5 px-2 pr-6 text-[13px] outline-none duration-200 focus:border-accent-500 focus:ring-2 focus:ring-[#089bab]/50 disabled:cursor-not-allowed disabled:bg-[#E4E4E4] disabled:text-gray-500"
                            >
                                {patientTypes.map((cat) => (
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
                                value={data.charge}
                                onChange={(e) =>
                                    setData((prev) => ({
                                        ...prev,
                                        charge: e.target.value,
                                    }))
                                }
                                type="number"
                                id="price"
                                name="price"
                                min={0}
                                className="w-28 rounded-none border-none pr-2 focus:border-none focus:ring-0"
                            />
                        </div>
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
                        onClick={serviceToEdit ? handleUpdate : handleSave}
                        className="flex items-center gap-2 rounded-md border border-accent bg-accent px-4 py-2 text-xs text-white duration-200 hover:bg-accent/90 disabled:pointer-events-none disabled:opacity-50"
                    >
                        {processing ? (
                            <>
                                <Loader2Icon
                                    size={14}
                                    className="animate-spin"
                                />
                                {serviceToEdit ? "Updating" : "Saving"}...
                            </>
                        ) : serviceToEdit ? (
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
