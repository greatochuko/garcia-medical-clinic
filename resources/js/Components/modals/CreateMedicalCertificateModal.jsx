import React from "react";
import ModalContainer from "../layout/ModalContainer";
import XIcon from "../icons/XIcon";
import LoadingIndicator from "../layout/LoadingIndicator";
import { useForm } from "@inertiajs/react";
import Input from "../layout/Input";
import { route } from "ziggy-js";

export default function CreateMedicalCertificateModal({
    open,
    closeModal,
    patientId,
    appointmentId,
    medicalCertificate,
    patientVisitRecordId,
}) {
    const { processing, data, setData, post } = useForm(
        medicalCertificate || {
            civilStatus: "Married",
            diagnosis: "",
            comments: "",
            patient_id: patientId,
            appointment_id: appointmentId,
            patient_visit_record_id: patientVisitRecordId,
        },
    );

    function handleCreateCertificate(e) {
        e.preventDefault();
        post(route("medical-certificate.store"), {
            onSuccess: () => {
                closeModal();
            },
            onError: (errors) => {
                console.error(errors);
            },
            preserveScroll: true,
            preserveState: false,
        });
    }

    const fieldEmpty =
        !data.civilStatus.trim() ||
        !data.diagnosis.trim() ||
        !data.comments.trim();

    return (
        <ModalContainer closeModal={closeModal} open={open}>
            <form
                onClick={(e) => e.stopPropagation()}
                onSubmit={handleCreateCertificate}
                className={`flex max-h-[85%] w-[90%] max-w-xl flex-col divide-y-2 divide-accent-200 overflow-y-auto rounded-lg bg-white text-sm duration-200 ${open ? "" : "translate-y-2"}`}
            >
                <div className="relative flex items-center justify-between px-4 py-2.5 pr-3">
                    <h5 className="font-semibold">
                        Create Medical Certificate
                    </h5>
                    <button
                        type="button"
                        onClick={closeModal}
                        className="rounded-md border border-transparent p-1 duration-200 hover:border-accent-400 hover:bg-accent-200"
                    >
                        <XIcon strokeWidth={4} size={16} />
                    </button>
                </div>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="civil-status">
                            Civil Status <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="civil-status"
                            id="civil-status"
                            value={data.civilStatus}
                            onChange={(e) =>
                                setData((prev) => ({
                                    ...prev,
                                    civilStatus: e.target.value,
                                }))
                            }
                            className="max-w-48 cursor-pointer rounded-md border-accent-400 bg-accent-200 p-2 px-3 text-sm outline-0 duration-200 focus:border-accent-500 focus:ring-2 focus:ring-[#089bab]/50 disabled:cursor-not-allowed disabled:bg-[#E4E4E4] disabled:text-gray-500"
                        >
                            <option value="Married">Married</option>
                            <option value="Single">Single</option>
                            <option value="Widowed">Widowed</option>
                            <option value="Divorced">Divorced</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="diagnosis">
                            Diagnosis <span className="text-red-500">*</span>
                        </label>
                        <Input
                            id="diagnosis"
                            name="diagnosis"
                            value={data.diagnosis}
                            onChange={(e) =>
                                setData((prev) => ({
                                    ...prev,
                                    diagnosis: e.target.value,
                                }))
                            }
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="comments">
                            Comments <span className="text-red-500">*</span>
                        </label>
                        <Input
                            id="comments"
                            name="comments"
                            value={data.comments}
                            onChange={(e) =>
                                setData((prev) => ({
                                    ...prev,
                                    comments: e.target.value,
                                }))
                            }
                        />
                    </div>
                </div>
                <div className="flex items-center justify-end gap-4 p-4 text-xs">
                    <button
                        type="button"
                        onClick={closeModal}
                        disabled={processing}
                        className="btn rounded-md border border-accent px-4 py-2 duration-200 hover:bg-accent-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={processing || fieldEmpty}
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
            </form>
        </ModalContainer>
    );
}
