import React from "react";
import ModalContainer from "../layout/ModalContainer";
import XIcon from "../icons/XIcon";
import { useForm } from "@inertiajs/react";
import LoadingIndicator from "../layout/LoadingIndicator";

export default function SignPatientVisitFormModal({
    open,
    closeModal: closeSignModal,
    appointmentId,
    patientId,
}) {
    const { processing } = useForm();

    function handleSignAppointment() {
        console.log({ appointmentId, patientId });
    }

    function closeModal() {
        if (processing) return;
        closeSignModal();
    }

    return (
        <ModalContainer closeModal={closeModal} open={open}>
            <div
                onClick={(e) => e.stopPropagation()}
                className={`w-[90%] max-w-md divide-y-2 divide-accent-200 rounded-lg bg-white text-sm duration-200 ${open ? "" : "translate-y-2"}`}
            >
                <div className="flex items-center justify-between p-2 px-4 pr-2">
                    <h5 className="font-semibold">
                        Sign and Close Appointment
                    </h5>
                    <button
                        onClick={closeModal}
                        className="rounded-full p-2 duration-200 hover:bg-accent-200"
                    >
                        <XIcon size={20} />
                    </button>
                </div>
                <div className="px-4 py-8">
                    <p>
                        Are you sure you want to sign and close this
                        appointment?
                    </p>
                </div>
                <div className="flex items-center justify-end gap-4 p-4 text-xs">
                    <button
                        onClick={closeModal}
                        disabled={processing}
                        className="btn rounded-md border border-accent px-4 py-2 duration-200 hover:bg-accent-200"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={processing}
                        onClick={handleSignAppointment}
                        className="btn flex items-center gap-2 rounded-md border border-accent bg-accent px-4 py-2 text-white duration-200 hover:bg-accent/90 disabled:pointer-events-none disabled:opacity-50"
                    >
                        {processing ? (
                            <>
                                <LoadingIndicator /> Signing...
                            </>
                        ) : (
                            "Confirm"
                        )}
                    </button>
                </div>
            </div>
        </ModalContainer>
    );
}
