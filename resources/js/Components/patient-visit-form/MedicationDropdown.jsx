import React from "react";

export default function MedicationDropdown({
    medications,
    medicationInput,
    setMedicationInput,
}) {
    const filteredMedications = medications.filter((med) =>
        med.name.toLowerCase().includes(medicationInput.toLowerCase()),
    );

    return (
        <div className="absolute bottom-full w-full">
            <ul className="max-h-40 overflow-y-auto rounded-lg border bg-white text-start text-sm shadow-md">
                {filteredMedications.length > 0 ? (
                    filteredMedications.map((med) => (
                        <li
                            key={med.id}
                            onClick={() => setMedicationInput(med.name)}
                            className="block cursor-pointer p-3 duration-200 hover:bg-accent-200"
                        >
                            {med.name}
                        </li>
                    ))
                ) : (
                    <p className="p-3 text-accent-500">
                        No record found for search &ldquo;
                        {medicationInput}
                        &rdquo;
                    </p>
                )}
            </ul>
        </div>
    );
}
