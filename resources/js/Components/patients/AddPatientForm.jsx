import { router } from "@inertiajs/react";
import { useForm } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { route } from "ziggy-js";
import LoadingIndicator from "../layout/LoadingIndicator";

const formFields = [
    {
        id: "patient_id",
        label: "Patient ID",
        disabled: true,
        type: "text",
        required: true,
    },
    { id: "first_name", label: "First Name", type: "text", required: true },
    { id: "last_name", label: "Last Name", type: "text", required: true },
    {
        id: "middle_initial",
        label: "Middle Initial",
        type: "text",
    },
    {
        id: "dob",
        label: "Date of Birth",
        type: "date",
        required: true,
        icon: "/assets/icons/calendar-icon-2.svg",
    },
    { id: "age", label: "Age", type: "number", disabled: true, required: true },
    {
        id: "gender",
        label: "Gender",
        type: "option",
        required: true,
        options: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
        ],
    },
    {
        id: "phone",
        label: "Mobile Number",
        type: "text",
        required: true,
        numbersOnly: true,
    },
    { id: "address", label: "Home Address", type: "text", required: true },
];

export default function AddPatientForm({ patientId }) {
    const { data, setData, post, processing } = useForm({
        patient_id: patientId.toString(),
        first_name: "",
        last_name: "",
        middle_initial: "",
        dob: "2000-01-01",
        age: "",
        gender: "",
        patient_type: 1,
        phone: "",
        address: "",
    });
    const [validationErrors, setValidationErrors] = useState([]);
    const [currentStage, setCurrentStage] = useState("form");
    const [termsAccepted, setTermsAccepted] = useState(false);

    useEffect(() => {
        if (!data.dob) return;

        const dob = new Date(data.dob);
        const today = new Date();

        const age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        const dayDiff = today.getDate() - dob.getDate();

        const patientAge =
            monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

        setData("age", patientAge);
    }, [data.dob]);

    function handleBack() {
        setCurrentStage("form");
    }

    function handleNext() {
        const errorList = validateFields();

        if (errorList.length > 0) {
            setValidationErrors(errorList);
            return;
        } else {
            setValidationErrors([]);
        }

        setCurrentStage("terms");
    }

    function acceptTerms() {
        setTermsAccepted(true);
        setCurrentStage("form");
    }

    function validateFields() {
        const errorList = [];

        if (!data.first_name.trim()) {
            errorList.push("First name is required.");
        }

        if (!data.last_name.trim()) {
            errorList.push("Last name is required.");
        }

        if (!data.dob) {
            errorList.push("Date of birth is required.");
        }

        if (!data.gender) {
            errorList.push("Please select a gender.");
        }

        if (!data.phone.trim()) {
            errorList.push("Phone number is required.");
        } else if (!/^[0-9]+$/.test(data.phone)) {
            errorList.push("Phone number must contain digits only.");
        }

        if (!data.address.trim()) {
            errorList.push("Address is required.");
        }

        return errorList;
    }

    function handleRegisterPatient(e) {
        e.preventDefault();

        const errorList = validateFields();

        if (errorList.length > 0) {
            setValidationErrors(errorList);
            return;
        }

        post(route("patients.register"), {
            onError: (serverErrors) => {
                setValidationErrors(Object.values(serverErrors));
            },
            onSuccess: () => {
                toast("Patient Registered successfully");
            },
        });
    }

    if (currentStage === "form")
        return (
            <>
                <div className="flex flex-col items-center gap-6 border-b-2 border-accent-200 py-10 text-center">
                    <p className="text-sm">
                        Through this registration, patient have acknowledged,
                        understood and agreed to be bound by website&apos;s
                        Terms and Conditions and Privacy Policy.
                    </p>

                    <div className="flex w-[90%] max-w-sm flex-col gap-4 text-left">
                        {formFields.map((field) => (
                            <div key={field.id} className="flex flex-col gap-2">
                                {field.type === "option" ? (
                                    <>
                                        <h4 className="text-sm">
                                            {field.label}{" "}
                                            {field.required && (
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            )}
                                        </h4>
                                        <div className="flex items-center gap-4">
                                            {field.options.map(
                                                (fieldOption) => (
                                                    <label
                                                        key={fieldOption.value}
                                                        htmlFor={
                                                            fieldOption.value
                                                        }
                                                        className="flex items-center gap-2"
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={field.id}
                                                            id={
                                                                fieldOption.value
                                                            }
                                                            onClick={() =>
                                                                setData(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        gender: fieldOption.value,
                                                                    }),
                                                                )
                                                            }
                                                            className="accent-accent focus:ring-0"
                                                        />
                                                        {fieldOption.label}
                                                    </label>
                                                ),
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <label
                                            htmlFor={field.id}
                                            className="text-sm"
                                        >
                                            {field.label}{" "}
                                            {field.required && (
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            )}
                                        </label>
                                        <div
                                            className={`relative flex ${field.disabled ? "max-w-[12rem]" : ""}`}
                                        >
                                            <input
                                                type={field.type}
                                                name={field.id}
                                                id={field.id}
                                                value={data[field.id]}
                                                onChange={(e) =>
                                                    setData((prev) => ({
                                                        ...prev,
                                                        [field.id]:
                                                            e.target.value,
                                                    }))
                                                }
                                                className="w-0 flex-1 rounded-md border-[#dfdfdf] p-2 px-3 text-sm focus:border-inherit focus:ring-accent disabled:bg-[#E4E4E4]"
                                                required={field.required}
                                                disabled={
                                                    field.disabled || processing
                                                }
                                            />
                                            {field.icon && (
                                                <img
                                                    src={field.icon}
                                                    alt={field.label + " icon"}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                                />
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                        <ul className="list-inside list-disc">
                            {validationErrors.map((error, i) => (
                                <li key={i} className="text-sm text-red-500">
                                    {error}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-4 px-4 py-4 sm:py-6 md:px-0">
                    <button
                        disabled={processing}
                        onClick={() =>
                            router.visit("/appointments/select-patient")
                        }
                        className="rounded-md border border-accent px-4 py-2 text-sm duration-200 hover:bg-accent-200"
                    >
                        Back
                    </button>
                    <button
                        disabled={processing}
                        onClick={
                            termsAccepted ? handleRegisterPatient : handleNext
                        }
                        className="flex items-center gap-2 rounded-md border border-accent bg-accent px-4 py-2 text-sm text-white duration-200 hover:bg-accent/90"
                    >
                        {termsAccepted ? (
                            processing ? (
                                <>
                                    <LoadingIndicator /> Registering...
                                </>
                            ) : (
                                "Register"
                            )
                        ) : (
                            "Next"
                        )}
                    </button>
                </div>
            </>
        );

    return (
        <div className="flex h-[calc(100%-4.5rem)] p-6">
            <div className="flex-1 bg-accent-200 p-6">
                <h3 className="text-center text-sm font-bold">
                    Terms & Conditions
                </h3>
                <div className="flex flex-col gap-2 overflow-y-auto text-sm">
                    <div className="flex flex-col gap-1">
                        <p>Effective Date: July 15, 2025</p>
                        <p>
                            The Garcia Medical Clinic {`"we", "our", "us"`}. By
                            registering on our website or using our services,
                            you agree to be bound by these Terms and Conditions.
                        </p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h5 className="font-semibold">
                            1. Acceptance of Terms
                        </h5>
                        <p>
                            By using the services of Garcia Medical Clinic, you
                            acknowledge that you have read, understood, and
                            agree to be bound by these Terms and Conditions and
                            our Privacy Policy. If you do not agree, please do
                            not use our services.
                        </p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h5 className="font-semibold">2. Services Provided</h5>
                        <p>
                            Garcia Medical Clinic provides secure online storage
                            and access to medical and personal health
                            information for our patients and clients. This
                            service is offered for informational purposes and is
                            not a substitute for direct consultation with a
                            licensed medical professional.
                        </p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h5 className="font-semibold">
                            3. Privacy and Data Protection
                        </h5>
                        <p>
                            We are committed to protecting your personal
                            information in compliance with the Data Privacy Act
                            of 2012 (Republic Act No. 10173) of the Philippines.
                            We collect, store, and manage personal and medical
                            information only with your consent. Your data will
                            be kept confidential and used solely for medical and
                            administrative purposes. We implement appropriate
                            security measures to protect your information from
                            unauthorized access, alteration, or disclosure.
                            Please review our Privacy Policy for more
                            information on how we collect and handle personal
                            data.
                        </p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h5 className="font-semibold">4. Use of the Service</h5>
                        <p>
                            You agree to use the service only for lawful
                            purposes and in accordance with these Terms. Do not
                            upload or transmit any material that infringes on
                            the rights of others or is unlawful, threatening, or
                            harmful.
                        </p>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-4 px-4 py-4 sm:py-6 md:px-0">
                    <button
                        disabled={processing}
                        onClick={handleBack}
                        className="rounded-md border border-accent px-4 py-2 text-sm duration-200 hover:bg-accent-300"
                    >
                        Back
                    </button>
                    <button
                        disabled={processing}
                        onClick={acceptTerms}
                        className="flex items-center gap-2 rounded-md border border-accent bg-accent px-4 py-2 text-sm text-white duration-200 hover:bg-accent/90 disabled:pointer-events-none disabled:opacity-50"
                    >
                        Agree
                    </button>
                </div>
            </div>
        </div>
    );
}
