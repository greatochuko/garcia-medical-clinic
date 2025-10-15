import React, { useState } from "react";
import DeleteOwnAccountModal from "@/Components/modals/DeleteOwnAccountModal";

export default function DeleteUserForm({ className }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
    };

    return (
        <section className={`flex flex-col gap-6 ${className}`}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Delete Account
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Once your account is deleted, all of its resources and data
                    will be permanently deleted. Before deleting your account,
                    please download any data or information that you wish to
                    retain.
                </p>
            </header>

            <button
                onClick={confirmUserDeletion}
                className="w-fit rounded-md bg-[#8D2310] px-4 py-2 text-sm font-semibold text-white duration-200 hover:opacity-90"
            >
                Delete Account
            </button>

            <DeleteOwnAccountModal
                open={confirmingUserDeletion}
                closeModal={closeModal}
            />
        </section>
    );
}
