import React, { useEffect } from "react";
import ModalContainer from "../layout/ModalContainer";
import { XIcon } from "lucide-react";
import Input from "../layout/Input";
import { useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import toast from "react-hot-toast";
import { Loader2Icon } from "lucide-react";

const initialData = {
    name: "",
};

export default function AddPlanModal({
    open,
    closeModal: closePlanModal,
    planToEdit,
}) {
    const { data, setData, post, put, processing } = useForm(initialData);

    function closeModal() {
        setTimeout(() => {
            setData(initialData);
        }, 200);
        closePlanModal();
    }

    useEffect(() => {
        if (planToEdit) {
            setData({
                name: planToEdit.name,
            });
        }
    }, [planToEdit, setData]);

    function handleSave(e) {
        e.preventDefault();
        post(route("plan-list.store"), {
            onSuccess: () => {
                closeModal();
            },
            onError: (error) => {
                toast.error(Object.values(error)?.[0]);
            },
            preserveScroll: true,
        });
    }

    function handleUpdate(e) {
        e.preventDefault();
        put(route("plan-list.update", planToEdit?.id), {
            onSuccess: () => {
                closeModal();
            },
            onError: (error) => {
                toast.error(Object.values(error)?.[0]);
            },
            preserveScroll: true,
        });
    }

    const cannotSubmit = !data.name;

    return (
        <ModalContainer open={open} closeModal={closeModal}>
            <form
                onClick={(e) => e.stopPropagation()}
                onSubmit={planToEdit ? handleUpdate : handleSave}
                className={`mx-auto w-[90%] max-w-lg divide-y-2 divide-accent-200 rounded-lg bg-white text-sm text-accent duration-200 ${open ? "" : "translate-y-2"}`}
            >
                <div className="flex items-center justify-between py-3 pl-4 pr-2">
                    <h4 className="font-semibold">Add Plan</h4>
                    <button className="rounded-md border border-transparent p-1 duration-200 hover:border-accent-300 hover:bg-accent-200">
                        <XIcon size={14} strokeWidth={5} />
                    </button>
                </div>

                <div className="flex flex-col gap-4 p-4">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="plan-name" className="text-[13px]">
                            Plan Name
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
                            id="plan-name"
                            name="plan-name"
                        />
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
                        disabled={cannotSubmit || processing}
                        type="submit"
                        className="flex items-center gap-2 rounded-md border border-accent bg-accent px-4 py-2 text-xs text-white duration-200 hover:bg-accent/90 disabled:pointer-events-none disabled:opacity-50"
                    >
                        {processing ? (
                            <>
                                <Loader2Icon
                                    size={14}
                                    className="animate-spin"
                                />
                                {planToEdit ? "Updating" : "Saving"}...
                            </>
                        ) : planToEdit ? (
                            "Update"
                        ) : (
                            "Save"
                        )}
                    </button>
                </div>
            </form>
        </ModalContainer>
    );
}
