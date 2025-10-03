import React, { useState } from "react";
import VitalsModal from "../modals/VitalsModal";

export default function VitalSignsButton({ patient, setPatient }) {
    const [modalOpen, setModalOpen] = useState(false);

    function updateVitals(newVitals) {
        setPatient((prev) => ({
            ...prev,
            vitals: { ...prev.vitals, ...newVitals },
        }));
    }

    return (
        <>
            <button
                onClick={() => setModalOpen(true)}
                className="p-1 duration-100 active:scale-90"
            >
                <img
                    src="/assets/icons/add-one-icon.svg"
                    alt="add one icon "
                    width={18}
                    height={18}
                />
            </button>

            <VitalsModal
                open={modalOpen}
                closeModal={() => setModalOpen(false)}
                patient={patient}
                updateVitals={updateVitals}
            />
        </>
    );
}
