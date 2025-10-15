import React from "react";
import ModalContainer from "../layout/ModalContainer";
import XIcon from "../icons/XIcon";
import { useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import LoadingIndicator from "../layout/LoadingIndicator";
import InputError from "../InputError";
import Input from "../layout/Input";
import InputLabel from "../InputLabel";

export default function DeleteOwnAccountModal({ open, closeModal }) {
    const {
        processing,
        delete: deleteRequest,
        errors,
        data,
        setData,
    } = useForm({ password: "" });

    const cannotSubmit = !data.password;

    function handleDeleteAccount() {
        deleteRequest(route("profile.destroy"), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
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
                className={`w-[90%] max-w-xl divide-y-2 divide-accent-200 rounded-lg bg-white text-sm text-accent duration-200 ${open ? "" : "translate-y-2"}`}
            >
                <div className="flex items-center justify-between p-2 px-4 pr-2">
                    <h5 className="font-semibold">Delete Account</h5>
                    <button
                        onClick={closeDeleteModal}
                        className="rounded-full p-2 duration-200 hover:bg-accent-200"
                    >
                        <XIcon size={20} />
                    </button>
                </div>
                <div className="flex flex-col gap-4 p-4">
                    <h2 className="text-lg font-medium">
                        Are you sure you want to delete your account?
                    </h2>
                    <p>
                        Once your account is deleted, all of its resources and
                        data will be permanently deleted. Please enter your
                        password to confirm you would like to permanently delete
                        your account.
                    </p>

                    <div className="flex flex-col gap-1">
                        <InputLabel
                            htmlFor="password_confirm"
                            value="Password"
                            className="sr-only"
                        />
                        <Input
                            id="password_confirm"
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            className="block w-full max-w-80"
                            placeholder="Password"
                        />
                        <InputError message={errors.password} />
                    </div>
                </div>
                <div className="flex items-center justify-end gap-4 p-4 text-[13px] font-medium">
                    <button
                        onClick={closeDeleteModal}
                        disabled={processing}
                        className="btn rounded-md border border-accent px-4 py-2 duration-200 hover:bg-accent-200"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={processing || cannotSubmit}
                        onClick={handleDeleteAccount}
                        className="btn flex items-center gap-2 rounded-md border border-[#8D2310] bg-[#8D2310] px-4 py-2 text-white duration-200 hover:bg-[#8D2310]/90 disabled:pointer-events-none disabled:opacity-50"
                    >
                        {processing ? (
                            <>
                                <LoadingIndicator /> Deleting...
                            </>
                        ) : (
                            "Delete Account"
                        )}
                    </button>
                </div>
            </div>
        </ModalContainer>
    );
}
