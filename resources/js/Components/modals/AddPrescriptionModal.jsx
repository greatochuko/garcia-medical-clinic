import React, { useState } from "react";
import XIcon from "../icons/XIcon";
import ModalContainer from "../layout/ModalContainer";
import { useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import PrescriptionTable from "../patient-visit-form/PrescriptionTable";
import toast from "react-hot-toast";

export default function AddPrescriptionModal({
    closeModal,
    open,
    patient,
    appointmentId,
    prescriptions: initialPrescriptions,
    inputOptions,
    patientVisitRecordId,
}) {
    const initialData = {
        medication: "",
        dosage: "",
        frequency: "",
        duration: "",
        amount: "",
        patient_id: patient.patient_id.toString(),
        appointment_id: appointmentId,
        patient_visit_record_id: patientVisitRecordId,
    };
    const [prescriptions, setPrescriptions] = useState(
        initialPrescriptions || [],
    );
    const { data, setData, processing, post } = useForm(initialData);
    const patientFullName = `${patient.first_name} ${patient.middle_initial || ""} ${patient.last_name}`;

    function closeVitalsModal() {
        closeModal();
    }

    function handleAddPrescription(e) {
        e.preventDefault();
        post(route("patientvisitform.patientprescriptionadd"), {
            onSuccess: (response) => {
                // setPrescriptions(response.props.prescriptions);
                setData(initialData);
            },
            onError: (errors) => {
                toast.error(Object.values(errors)[0]);
                console.error(errors);
            },
            preserveScroll: true,
        });
    }

    // const fieldVacant = true;

    return (
        <ModalContainer closeModal={closeVitalsModal} open={open}>
            <form
                onClick={(e) => e.stopPropagation()}
                onSubmit={handleAddPrescription}
                className={`flex h-[80%] max-h-[80%] w-[90%] max-w-6xl flex-col divide-y-2 divide-accent-200 overflow-y-auto rounded-lg bg-white text-sm duration-200 ${open ? "" : "translate-y-2"}`}
            >
                <div className="flex items-center justify-between px-4 py-2 pr-3">
                    <h5 className="font-semibold">ADD PRESCRIPTIONS</h5>
                    <button
                        type="button"
                        onClick={closeVitalsModal}
                        className="rounded-full p-2 duration-200 hover:bg-accent-200"
                    >
                        <XIcon size={20} />
                    </button>
                </div>
                <div className="flex flex-1 flex-col overflow-y-auto">
                    <div className="flex items-center gap-4 p-4">
                        <img
                            src="/images/patient.png"
                            alt="patient profile picture"
                            className="h-12 w-12 rounded-full shadow-md"
                        />
                        <div className="flex flex-col gap-1">
                            <h4 className="">{patientFullName}</h4>
                            <p className="text-xs">
                                {patient.age}, {patient.gender}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-1 flex-col overflow-x-auto">
                        <PrescriptionTable
                            data={data}
                            prescriptions={prescriptions}
                            inputOptions={inputOptions}
                            processing={processing}
                            setData={setData}
                            setPrescriptions={setPrescriptions}
                        />
                    </div>
                </div>
            </form>
        </ModalContainer>
    );
}
