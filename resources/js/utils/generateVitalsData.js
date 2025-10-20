export function generateVitalsData(patient) {
    return {
        patient_id: patient.patient_id,
        blood_diastolic_pressure:
            patient.vitals?.blood_diastolic_pressure || "",
        blood_systolic_pressure: patient.vitals?.blood_systolic_pressure || "",
        heart_rate: patient.vitals?.heart_rate || "",
        o2saturation: patient.vitals?.o2saturation || "",
        temperature: parseInt(patient.vitals?.temperature) || "",
        height_ft: patient.vitals?.height_ft || "",
        height_in: patient.vitals?.height_in || "",
        weight: parseInt(patient.vitals?.weight) || "",
    };
}
