import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { usePage } from "@inertiajs/react";
import FlashMessage from "@/Components/FlashMessage";
// import { Head, useForm, router } from '@inertiajs/react';

export default function CreateAppointment(props) {
    console.log(props);
    return null;
    const { flash } = usePage().props;
    //  const patient_id = flash?.id;
    const [appointmentDate, setAppointmentDate] = useState("");
    const [selectedService, setSelectedService] = useState("");
    const [serviceDetails, setServiceDetails] = useState(null);
    const [discount, setDiscount] = useState(0);
    const [status, setStatus] = useState("Waiting");
    const [queueNumbers, setQueueNumbers] = useState([]);
    const [selectedQueue, setSelectedQueue] = useState(null);
    const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const serviceDropdownRef = useRef(null);
    const statusDropdownRef = useRef(null);
    const [selectedDate, setSelectedDate] = useState("");

    // const patient_id = flash?.id?.id;
    // const age = flash?.id?.age
    const { data, setData, post, processing, errors } = useForm({
        patient_id: patient?.patient_id || "",
        appointment_date: "",
        service_type: "",
        status: "",
        queue_number: "",
    });

    const patient_id = patient?.patient_id;
    const age = patient?.age;

    // console.log('Patient ID:', patient_id);
    // console.log('Age:', age);

    function getAgeInYears(age) {
        if (!age) return 0;

        const unit = age.slice(-1).toUpperCase();
        const value = parseInt(age);

        switch (unit) {
            case "D":
                return value / 365;
            case "M":
                return value / 12;
            case "Y":
                return value;
            default:
                // Fallback if no unit — assume it's already in years (like "34")
                return value;
        }
    }

    // Usage:
    const numericAge = getAgeInYears(patient.age); // e.g., '12D', '5M', '34Y', or '34'

    const isSenior = numericAge >= 60;
    const headerText = isSenior
        ? "Create Appointment (Senior Age 60 and Above)"
        : "Create Appointment (Regular age 60 and below)";

    const serviceOptions = [
        { value: "", label: "Select service type" },
        { value: "regular", label: "Regular Check Up" },
        {
            value: "regular_cert",
            label: "Regular Check Up + Medical Certificate",
        },
        { value: "medical_cert", label: "Medical Certificate" },
        { value: "circumcision_above", label: "Circumcision (10 Above)" },
        { value: "circumcision_below", label: "Circumcision (10 Below)" },
    ];

    const statusOptions = [
        { value: "Waiting", label: "Waiting" },
        { value: "On Hold", label: "On Hold" },
    ];

    useEffect(() => {
        setData("status", status);
    }, [status]);
    useEffect(() => {
        fetchQueueNumbers();
        const handleClickOutside = (event) => {
            if (
                serviceDropdownRef.current &&
                !serviceDropdownRef.current.contains(event.target)
            ) {
                setIsServiceDropdownOpen(false);
            }
            if (
                statusDropdownRef.current &&
                !statusDropdownRef.current.contains(event.target)
            ) {
                setIsStatusDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        // Set minimum date to today
        const today = new Date().toISOString().split("T")[0];
        const dateInput = document.querySelector('input[type="date"]');
        if (dateInput) {
            dateInput.min = today;
        }
    }, []);

    // Effect to fetch service details when a service is selected
    useEffect(() => {
        if (selectedService) {
            const service = serviceTypes.find((s) => s.id === selectedService);
            if (service) {
                setServiceDetails(service);
            }
        } else {
            setServiceDetails(null);
        }
    }, [selectedService, serviceTypes]);

    // const fetchQueueNumbers = async () => {
    //     try {
    //         const response = await axios.get(`/queue-numbers/${age}`);
    //         setQueueNumbers(response.data);
    //     } catch (error) {
    //         console.error('Error fetching queue numbers:', error);
    //     }
    // };

    const handleBack = () => {
        window.history.back();
    };

    const handleSubmit = () => {
        // First, save the appointment data as before
        post(route("appointments.store"), {
            onSuccess: async () => {
                // If appointment is saved successfully, save the billing data
                if (serviceDetails) {
                    try {
                        // Format the service data similar to BillingModal.jsx
                        const selectedServices = [
                            {
                                id: serviceDetails.id,
                                name: serviceDetails.name,
                                price: serviceDetails.charge || 0,
                            },
                        ];

                        const total = serviceDetails.charge || 0;
                        const finalTotal = Math.max(
                            total - Number(discount),
                            0,
                        );

                        // Save to billing table
                        await axios.post("/billing", {
                            patient_id: patient.patient_id,
                            services: JSON.stringify(selectedServices),
                            total: total,
                            discount: Number(discount) || 0,
                            final_total: finalTotal,
                            paid: false,
                        });

                        // Navigate to appointments index
                        window.location.href = route("appointments.index");
                    } catch (error) {
                        console.error("Error saving billing data:", error);
                    }
                }
                // else {
                //     // If no service details, just navigate to appointments index
                //     // window.location.href = route('appointments.index');
                // }
            },
        });
    };

    const fetchQueueNumbers = async () => {
        try {
            const response = await axios.get(`/queue-numbers/${numericAge}`, {
                params: {
                    date: data.appointment_date,
                },
            });
            setQueueNumbers(response.data);
        } catch (error) {
            console.error("Error fetching queue numbers:", error);
        }
    };
    useEffect(() => {
        if (!data.appointment_date) {
            const today = new Date().toISOString().split("T")[0];
            setData("appointment_date", today);
            setSelectedDate(today);
        }
    }, []);

    useEffect(() => {
        console.log("aaaaaaaaaaaaaaaa", selectedDate);
        if (selectedDate) {
            fetchQueueNumbers();
        }
    }, [selectedDate]);

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Create Appointment
                </h2>
            }
        >
            <Head title="Create Appointment" />
            <FlashMessage />
            <div className="py-3">
                <div className="max-w-8xl main-screen-all-patients mx-8 bg-white px-4">
                    <div className="mx-auto h-full w-full">
                        <div className="h-full rounded-lg bg-white p-6">
                            {/* Header with back button */}
                            <div className="relative mb-6 flex items-center justify-between">
                                {/* <button 
                                    onClick={handleBack}
                                    className="flex items-center text-[#429ABF] hover:text-[#2B4E64] transition-colors duration-200"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                                        <path d="M15.7049 4.70504C16.0954 5.09557 16.0954 5.72544 15.7049 6.11597L9.82083 12L15.7049 17.884C16.0954 18.2746 16.0954 18.9044 15.7049 19.295C15.3144 19.6855 14.6845 19.6855 14.294 19.295L7.70492 12.7059C7.31439 12.3154 7.31439 11.6855 7.70492 11.295L14.294 4.70594C14.6845 4.31542 15.3144 4.31542 15.7049 4.70594V4.70504Z" fill="currentColor"/>
                                    </svg>
                                    <span className="text-[14px] font-semibold">Back</span>
                                </button> */}
                            </div>

                            <div className="grid h-full grid-cols-1 gap-8 lg:grid-cols-4">
                                {/* Left Column - Patient Info */}
                                <div className="border-gray-200 pr-6 lg:col-span-1 lg:border-r">
                                    <h2
                                        className={`mb-4 text-[24px] font-semibold ${
                                            isSenior
                                                ? "text-[#FF8000]"
                                                : "text-[#429ABF]"
                                        }`}
                                    >
                                        {headerText}
                                    </h2>
                                    <div className="mt-10 space-y-6">
                                        <div>
                                            <label className="block text-[14px] font-semibold text-[#429ABF]">
                                                Patient Name
                                            </label>
                                            <p className="text-[14px] text-[#A1A1A1]">
                                                {patient?.name ||
                                                    "Not specified"}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-[14px] font-semibold text-[#429ABF]">
                                                Patient Address
                                            </label>
                                            <p className="text-[14px] text-[#A1A1A1]">
                                                {patient?.address ||
                                                    "Not specified"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Appointment Form */}
                                <div className="lg:col-span-3 lg:pl-6">
                                    <div className="space-y-6">
                                        {/* Appointment Date */}
                                        <div>
                                            <label className="mb-1 block text-sm font-semibold text-[#429ABF]">
                                                Appointment Date{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <div className="relative w-full lg:w-1/2 xl:w-5/12 2xl:w-1/3">
                                                <input
                                                    type="date"
                                                    value={
                                                        data.appointment_date
                                                    }
                                                    // onChange={(e) => setData('appointment_date', e.target.value)}
                                                    onChange={(e) => {
                                                        const value =
                                                            e.target.value;
                                                        setData(
                                                            "appointment_date",
                                                            value,
                                                        ); // keep form data
                                                        setSelectedDate(value); // this is used to trigger useEffect reliably
                                                    }}
                                                    className="w-full cursor-pointer rounded-md border border-gray-300 p-2 text-sm focus:border-[#429ABF] focus:ring-[#429ABF]"
                                                    style={{
                                                        colorScheme: "light",
                                                        "::-webkit-calendar-picker-indicator":
                                                            {
                                                                cursor: "pointer",
                                                                filter: "invert(0.5)",
                                                            },
                                                    }}
                                                    placeholder="Select date"
                                                />
                                                <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 transform">
                                                    <svg
                                                        className="h-5 w-5 text-gray-400"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                            {errors.appointment_date && (
                                                <div className="mt-1 text-xs text-red-500">
                                                    {errors.appointment_date}
                                                </div>
                                            )}
                                        </div>

                                        {/* Service Type */}
                                        <div>
                                            <label className="mb-1 block text-sm font-semibold text-[#429ABF]">
                                                Service Type{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <div
                                                className="relative w-full lg:w-1/2 xl:w-5/12 2xl:w-1/3"
                                                ref={serviceDropdownRef}
                                            >
                                                <div
                                                    className="flex w-full cursor-pointer items-center justify-between rounded-md border border-gray-300 bg-white p-2 text-sm"
                                                    onClick={() =>
                                                        setIsServiceDropdownOpen(
                                                            !isServiceDropdownOpen,
                                                        )
                                                    }
                                                >
                                                    <span>
                                                        {serviceTypes.find(
                                                            (opt) =>
                                                                opt.id ===
                                                                selectedService,
                                                        )?.name ||
                                                            "Select service type"}
                                                    </span>
                                                    <svg
                                                        className="h-4 w-4 fill-current"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                                    </svg>
                                                </div>
                                                {isServiceDropdownOpen && (
                                                    <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg">
                                                        {serviceTypes.map(
                                                            (option) => (
                                                                <div
                                                                    key={
                                                                        option.id
                                                                    }
                                                                    className="cursor-pointer p-2 text-sm text-[#666666] hover:bg-[#CDCDCD]"
                                                                    onClick={() => {
                                                                        setSelectedService(
                                                                            option.id,
                                                                        );
                                                                        setIsServiceDropdownOpen(
                                                                            false,
                                                                        );
                                                                        setData(
                                                                            "service_type",
                                                                            option.id,
                                                                        );
                                                                    }}
                                                                >
                                                                    {
                                                                        option.name
                                                                    }
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            {errors.service_type && (
                                                <div className="mt-1 text-xs text-red-500">
                                                    {errors.service_type}
                                                </div>
                                            )}
                                        </div>

                                        {/* Status */}
                                        <div>
                                            <label className="mb-1 block text-sm font-semibold text-[#429ABF]">
                                                Status{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <div
                                                className="relative w-full lg:w-1/2 xl:w-5/12 2xl:w-1/3"
                                                ref={statusDropdownRef}
                                            >
                                                <div
                                                    className="flex w-full cursor-pointer items-center justify-between rounded-md border border-gray-300 bg-white p-2 text-sm"
                                                    value={data.status}
                                                    onClick={() =>
                                                        setIsStatusDropdownOpen(
                                                            !isStatusDropdownOpen,
                                                        )
                                                    }
                                                >
                                                    <span>{status}</span>
                                                    <svg
                                                        className="h-4 w-4 fill-current"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                                    </svg>
                                                </div>
                                                {isStatusDropdownOpen && (
                                                    <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg">
                                                        {statusOptions.map(
                                                            (option) => (
                                                                <div
                                                                    key={
                                                                        option.value
                                                                    }
                                                                    className="cursor-pointer p-2 text-sm text-[#666666] hover:bg-[#CDCDCD]"
                                                                    onClick={() => {
                                                                        setStatus(
                                                                            option.value,
                                                                        );
                                                                        setIsStatusDropdownOpen(
                                                                            false,
                                                                        );
                                                                        setData(
                                                                            "status",
                                                                            option.value,
                                                                        );
                                                                    }}
                                                                >
                                                                    {
                                                                        option.label
                                                                    }
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            {errors.status && (
                                                <div className="mt-1 text-xs text-red-500">
                                                    {errors.status}
                                                </div>
                                            )}
                                        </div>

                                        {/* Queue Numbers */}
                                        <div>
                                            <label className="mb-1 block text-[14px] font-semibold text-[#429ABF]">
                                                Assign Queue Number{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <div className="w-full rounded-lg border border-gray-200 p-4">
                                                <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12">
                                                    {queueNumbers.map(
                                                        (queue, index) => (
                                                            <button
                                                                key={index}
                                                                onClick={() => {
                                                                    setSelectedQueue(
                                                                        queue.number,
                                                                    );
                                                                    setData(
                                                                        "queue_number",
                                                                        queue.number,
                                                                    );
                                                                }}
                                                                className={`flex h-[25px] min-w-[38px] items-center justify-center rounded border p-1 text-[11px] font-bold ${
                                                                    selectedQueue ===
                                                                    queue.number
                                                                        ? "border-black bg-black text-white"
                                                                        : `border-[#CDCDCD] bg-white ${isSenior ? "text-[#FF8000]" : "text-[#429ABF]"} hover:bg-[#429ABF] hover:text-white`
                                                                }`}
                                                            >
                                                                {queue.number}
                                                            </button>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                            {errors.queue_number && (
                                                <div className="mt-1 text-xs text-red-500">
                                                    {errors.queue_number}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {/* Action Buttons */}
                                    <div className="mt-24 flex justify-end gap-4 text-end">
                                        <button
                                            onClick={handleBack}
                                            className="rounded-md border border-[#429ABF] px-4 py-2 text-sm font-medium text-[#429ABF] hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="rounded-md bg-[#429ABF] px-6 py-2 text-sm font-medium text-white hover:bg-[#3889ac]"
                                            onClick={handleSubmit}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
