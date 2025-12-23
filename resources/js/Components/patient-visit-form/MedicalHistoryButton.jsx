import React, { useState } from "react";
import MedicalHistoryModal from "../modals/MedicalHistoryModal";

export default function MedicalHistoryButton({
    patientId,
    setMedicalHistory,
    medicalHistory,
}) {
    const [modalOpen, setModalOpen] = useState(false);

    function updateMedicalHistory(newMedicalHistory) {
        setMedicalHistory(newMedicalHistory);
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

            <MedicalHistoryModal
                open={modalOpen}
                closeModal={() => setModalOpen(false)}
                patientId={patientId}
                updateMedicalHistory={updateMedicalHistory}
                medicalHistory={medicalHistory}
            />
        </>
    );
}
