import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import { useForm } from "@inertiajs/react";
import FlashMessage from "@/Components/FlashMessage";
import { useEffect } from "react";

export default function AllPatients({ auth, patient = null }) {
    const { data, setData, post, processing, errors } = useForm({
        patient_id: patient?.id || "",
        first_name: patient?.first_name || "",
        last_name: patient?.last_name || "",
        middle_initial: patient?.middle_initial || "",
        dob: patient?.dob || "",
        age: patient?.age || "",
        gender: patient?.gender?.toLowerCase() || "",
        patient_type: patient?.patient_type || "",
        phone: patient?.phone || "",
        address: patient?.address || "",
    });

    async function getNextPatientId() {
        try {
            const response = await fetch("/allpatients/serial_id");
            const data = await response.json();

            if (data) {
                const pidInput = document.getElementById("pid");
                if (pidInput) {
                    pidInput.value = "00" + data;
                    setData("patient_id", "00" + data);
                }
            } else {
                console.error("Invalid response:", data);
            }
        } catch (error) {
            console.error("Error fetching next patient id:", error);
        }
    }
    useEffect(() => {
        getNextPatientId();
    }, []);

    const handleSaveAndAddAppointment = () => {
        post("/allpatients/add/register");
    };

    let dob = document.getElementById("dob");
    if (dob) {
        // dob.value='1990-01-01';
    }

    function updateAge() {
        const dobInput = document.getElementById("dob");
        const ageInput = document.getElementById("age");
        const birthDate = new Date(dobInput.value);
        const today = new Date();

        if (isNaN(birthDate.getTime())) {
            ageInput.value = "";
            return;
        }

        const diffTime = today - birthDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        let displayAge = "";

        if (diffDays >= 365) {
            // Age in years
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            displayAge = `${age}Y`;
            setData("patient_type", age > 60 ? 1 : 0);
        } else if (diffDays >= 30) {
            // Age in months
            const months = Math.floor(diffDays / 30);
            displayAge = `${months}M`;
            setData("patient_type", 0);
        } else {
            // Age in days
            displayAge = `${diffDays}D`;
            setData("patient_type", 0);
        }
        console.log(displayAge);

        ageInput.value = displayAge;
        setData("age", displayAge);
        setData("dob", dobInput.value);
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    All Patients
                </h2>
            }
        >
            <Head title="All Patients" />
            <FlashMessage />
            <div className="py-3">
                <div className="max-w-8xl main-screen-all-patients mx-8 bg-white px-4">
                    <div className="-lg grid grid-cols-4 gap-4 rounded-lg p-10">
                        <div className="col-span-1">
                            <h2 className="mb-2 text-2xl font-bold text-[#429ABF]">
                                Register Patient
                            </h2>
                            <p className="mb-6 text-sm text-gray-600">
                                Fill in the field with accurate patient
                                information.
                            </p>
                            <div className="relative rounded-md bg-[#FAFBFF] p-4 text-sm">
                                <div className="relative w-full rounded-md bg-[#FAFBFF] bg-white p-6">
                                    <span className="absolute left-2 top-2 cursor-pointer text-gray-400">
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M10 0.00488281C4.48 0.00488281 0 4.48488 0 10.0049C0 15.5249 4.48 20.0049 10 20.0049C15.52 20.0049 20 15.5249 20 10.0049C20 4.48488 15.52 0.00488281 10 0.00488281ZM11 15.0049H9V13.0049H11V15.0049ZM11 11.0049H9V5.00488H11V11.0049Z"
                                                fill="#FF3B30"
                                            />
                                        </svg>
                                    </span>
                                    <span className="absolute right-2 top-2 cursor-pointer text-gray-400">
                                        <svg
                                            width="20"
                                            height="14"
                                            viewBox="0 0 14 14"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M14 1.41488L12.59 0.00488281L7 5.59488L1.41 0.00488281L0 1.41488L5.59 7.00488L0 12.5949L1.41 14.0049L7 8.41488L12.59 14.0049L14 12.5949L8.41 7.00488L14 1.41488Z"
                                                fill="#79808F"
                                            />
                                        </svg>
                                    </span>
                                    <p className="p-5 text-sm">
                                        By registering a patient, the patient
                                        understood the information provided
                                        above regarding the use of telemedicine.
                                        I am willing to undergo this innovative
                                        means to improve my care. I am prepared
                                        to ask questions and raise concerns
                                        regarding the diagnosis and treatment to
                                        be given to me by my physician. I hereby
                                        give my informed consent for the use of
                                        telemedicine and consultation through
                                        AnywhereTo-Consult, with full agreement
                                        to its Terms and Conditions and Privacy
                                        Policy, in my medical care.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-3 w-full gap-5 border-l border-gray-100 pl-6 pt-9">
                            <div className="col-span-1 mt-5 flex grid grid-cols-3 flex-row gap-5">
                                <div className="cols-span-1">
                                    <label className="font-light-blue block text-sm font-semibold">
                                        Patient ID
                                    </label>
                                    <input
                                        type="text"
                                        readOnly
                                        value={patient?.patient_id}
                                        className="mt-1 w-full rounded-md border border-gray-300 bg-gray-100 text-sm"
                                        id="pid"
                                    />
                                    {errors.patient_id && (
                                        <div className="mt-1 text-xs text-red-500">
                                            {errors.patient_id}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="mt-10 flex grid grid-cols-3 flex-row gap-5">
                                <div>
                                    <label className="font-light-blue block text-sm font-semibold">
                                        Patient First Name{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.first_name}
                                        className={`block w-full border ${errors.first_name ? "border-red-500" : "border-gray-300"} rounded-md text-sm`}
                                        onChange={(e) =>
                                            setData(
                                                "first_name",
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {errors.first_name && (
                                        <div className="mt-1 text-xs text-red-500">
                                            {errors.first_name}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="font-light-blue block text-sm font-semibold">
                                        Patient Last Name{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.last_name}
                                        className={`block w-full border ${errors.last_name ? "border-red-500" : "border-gray-300"} rounded-md p-2 text-sm`}
                                        onChange={(e) =>
                                            setData("last_name", e.target.value)
                                        }
                                    />
                                    {errors.last_name && (
                                        <div className="mt-1 text-xs text-red-500">
                                            {errors.last_name}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="font-light-blue block text-sm font-medium font-semibold">
                                        Patient Middle Initial
                                    </label>
                                    <input
                                        type="text"
                                        value={data.middle_initial}
                                        className={`block w-3/4 border ${errors.middle_initial ? "border-red-500" : "border-gray-300"} rounded-md p-2 text-sm`}
                                        onChange={(e) =>
                                            setData(
                                                "middle_initial",
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {errors.middle_initial && (
                                        <div className="mt-1 text-xs text-red-500">
                                            {errors.middle_initial}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="mt-10 flex w-full flex-row items-start gap-5">
                                {/* Date of Birth */}
                                <div className="w-1/3">
                                    <label className="font-light-blue block text-sm font-medium font-semibold">
                                        Date of Birth{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative w-full">
                                        <input
                                            type="date"
                                            id="dob"
                                            value={data.dob}
                                            className={`block w-full border ${errors.dob ? "border-red-500" : "border-gray-300"} appearance-none rounded-md p-2 text-sm`}
                                            onChange={updateAge}
                                        />

                                        {/* Your custom calendar SVG icon positioned on the right */}
                                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                            <svg
                                                width="26"
                                                height="26"
                                                viewBox="0 0 26 26"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M5.75 3H20.75C22.0761 3 23.3479 3.52678 24.2855 4.46447C25.2232 5.40215 25.75 6.67392 25.75 8V20.5C25.75 21.8261 25.2232 23.0979 24.2855 24.0355C23.3479 24.9732 22.0761 25.5 20.75 25.5H5.75C4.42392 25.5 3.15215 24.9732 2.21447 24.0355C1.27678 23.0979 0.75 21.8261 0.75 20.5V8C0.75 6.67392 1.27678 5.40215 2.21447 4.46447C3.15215 3.52678 4.42392 3 5.75 3ZM5.75 5.5C5.08696 5.5 4.45107 5.76339 3.98223 6.23223C3.51339 6.70107 3.25 7.33696 3.25 8V20.5C3.25 21.163 3.51339 21.7989 3.98223 22.2678C4.45107 22.7366 5.08696 23 5.75 23H20.75C21.413 23 22.0489 22.7366 22.5178 22.2678C22.9866 21.7989 23.25 21.163 23.25 20.5V8C23.25 7.33696 22.9866 6.70107 22.5178 6.23223C22.0489 5.76339 21.413 5.5 20.75 5.5H5.75Z"
                                                    fill="#8B8B8B"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M2 10.5C2 10.1685 2.1317 9.85054 2.36612 9.61612C2.60054 9.3817 2.91848 9.25 3.25 9.25H23.25C23.5815 9.25 23.8995 9.3817 24.1339 9.61612C24.3683 9.85054 24.5 10.1685 24.5 10.5C24.5 10.8315 24.3683 11.1495 24.1339 11.3839C23.8995 11.6183 23.5815 11.75 23.25 11.75H3.25C2.91848 11.75 2.60054 11.6183 2.36612 11.3839C2.1317 11.1495 2 10.8315 2 10.5ZM8.25 0.5C8.58152 0.5 8.89946 0.631696 9.13388 0.866116C9.3683 1.10054 9.5 1.41848 9.5 1.75V6.75C9.5 7.08152 9.3683 7.39946 9.13388 7.63388C8.89946 7.8683 8.58152 8 8.25 8C7.91848 8 7.60054 7.8683 7.36612 7.63388C7.1317 7.39946 7 7.08152 7 6.75V1.75C7 1.41848 7.1317 1.10054 7.36612 0.866116C7.60054 0.631696 7.91848 0.5 8.25 0.5ZM18.25 0.5C18.5815 0.5 18.8995 0.631696 19.1339 0.866116C19.3683 1.10054 19.5 1.41848 19.5 1.75V6.75C19.5 7.08152 19.3683 7.39946 19.1339 7.63388C18.8995 7.8683 18.5815 8 18.25 8C17.9185 8 17.6005 7.8683 17.3661 7.63388C17.1317 7.39946 17 7.08152 17 6.75V1.75C17 1.41848 17.1317 1.10054 17.3661 0.866116C17.6005 0.631696 17.9185 0.5 18.25 0.5Z"
                                                    fill="#8B8B8B"
                                                />
                                                <path
                                                    d="M8.25 14.25C8.25 14.5815 8.1183 14.8995 7.88388 15.1339C7.64946 15.3683 7.33152 15.5 7 15.5C6.66848 15.5 6.35054 15.3683 6.11612 15.1339C5.8817 14.8995 5.75 14.5815 5.75 14.25C5.75 13.9185 5.8817 13.6005 6.11612 13.3661C6.35054 13.1317 6.66848 13 7 13C7.33152 13 7.64946 13.1317 7.88388 13.3661C8.1183 13.6005 8.25 13.9185 8.25 14.25ZM8.25 19.25C8.25 19.5815 8.1183 19.8995 7.88388 20.1339C7.64946 20.3683 7.33152 20.5 7 20.5C6.66848 20.5 6.35054 20.3683 6.11612 20.1339C5.8817 19.8995 5.75 19.5815 5.75 19.25C5.75 18.9185 5.8817 18.6005 6.11612 18.3661C6.35054 18.1317 6.66848 18 7 18C7.33152 18 7.64946 18.1317 7.88388 18.3661C8.1183 18.6005 8.25 18.9185 8.25 19.25ZM14.5 14.25C14.5 14.5815 14.3683 14.8995 14.1339 15.1339C13.8995 15.3683 13.5815 15.5 13.25 15.5C12.9185 15.5 12.6005 15.3683 12.3661 15.1339C12.1317 14.8995 12 14.5815 12 14.25C12 13.9185 12.1317 13.6005 12.3661 13.3661C12.6005 13.1317 12.9185 13 13.25 13C13.5815 13 13.8995 13.1317 14.1339 13.3661C14.3683 13.6005 14.5 13.9185 14.5 14.25ZM14.5 19.25C14.5 19.5815 14.3683 19.8995 14.1339 20.1339C13.8995 20.3683 13.5815 20.5 13.25 20.5C12.9185 20.5 12.6005 20.3683 12.3661 20.1339C12.1317 19.8995 12 19.5815 12 19.25C12 18.9185 12.1317 18.6005 12.3661 18.3661C12.6005 18.1317 12.9185 18 13.25 18C13.5815 18 13.8995 18.1317 14.1339 18.3661C14.3683 18.6005 14.5 18.9185 14.5 19.25ZM20.75 14.25C20.75 14.5815 20.6183 14.8995 20.3839 15.1339C20.1495 15.3683 19.8315 15.5 19.5 15.5C19.1685 15.5 18.8505 15.3683 18.6161 15.1339C18.3817 14.8995 18.25 14.5815 18.25 14.25C18.25 13.9185 18.3817 13.6005 18.6161 13.3661C18.8505 13.1317 19.1685 13 19.5 13C19.8315 13 20.1495 13.1317 20.3839 13.3661C20.6183 13.6005 20.75 13.9185 20.75 14.25ZM20.75 19.25C20.75 19.5815 20.6183 19.8995 20.3839 20.1339C20.1495 20.3683 19.8315 20.5 19.5 20.5C19.1685 20.5 18.8505 20.3683 18.6161 20.1339C18.3817 19.8995 18.25 19.5815 18.25 19.25C18.25 18.9185 18.3817 18.6005 18.6161 18.3661C18.8505 18.1317 19.1685 18 19.5 18C19.8315 18 20.1495 18.1317 20.3839 18.3661C20.6183 18.6005 20.75 18.9185 20.75 19.25Z"
                                                    fill="#8B8B8B"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                {/* Age & Sex */}
                                <div className="flex w-2/3 flex-row items-start gap-4">
                                    {/* Age */}
                                    <div className="flex w-1/3 flex-col">
                                        <label className="font-light-blue block text-sm font-medium font-semibold">
                                            Age
                                        </label>
                                        <input
                                            type="text"
                                            name="age"
                                            id="age"
                                            value={data.age}
                                            readOnly
                                            className={`border bg-gray-100 ${errors.age ? "border-red-500" : "border-gray-300"} rounded-md p-2 text-sm text-gray-400`}
                                        />
                                        {errors.age && (
                                            <div className="mt-1 text-xs text-red-500">
                                                {errors.age}
                                            </div>
                                        )}
                                    </div>
                                    {/* Sex */}
                                    <div className="flex w-2/3 flex-col">
                                        <label className="font-light-blue block text-sm font-medium font-semibold">
                                            Sex{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <div className="mt-2 flex gap-4">
                                            <label className="flex items-center gap-2 text-sm">
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    value="male"
                                                    checked={
                                                        data.gender === "male"
                                                    }
                                                    className={`form-radio ${errors.gender ? "border-red-500" : ""} text-[#429ABF]`}
                                                    onChange={(e) =>
                                                        setData(
                                                            "gender",
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                Male
                                            </label>
                                            <label className="flex items-center gap-2 text-sm">
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    value="female"
                                                    checked={
                                                        data.gender === "female"
                                                    }
                                                    className={`form-radio ${errors.gender ? "border-red-500" : ""} text-[#429ABF]`}
                                                    onChange={(e) =>
                                                        setData(
                                                            "gender",
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                Female
                                            </label>
                                        </div>
                                        {errors.gender && (
                                            <div className="mt-1 text-xs text-red-500">
                                                {errors.gender}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-1 mt-10 flex grid grid-cols-3 flex-row gap-5">
                                <div className="col-span-1">
                                    <label className="font-light-blue block text-sm font-medium font-semibold">
                                        Mobile Number{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={data.phone}
                                        onChange={(e) => {
                                            const numericValue =
                                                e.target.value.replace(
                                                    /\D/g,
                                                    "",
                                                );
                                            setData("phone", numericValue);
                                        }}
                                        className={`mt-1 block w-full border ${errors.phone ? "border-red-500" : "border-gray-300"} rounded-md p-2 text-sm`}
                                    />
                                    {errors.phone && (
                                        <div className="mt-1 text-xs text-red-500">
                                            {errors.phone}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="col-span-3 mt-10 gap-5">
                                <div>
                                    <label className="font-light-blue block text-sm font-medium font-semibold">
                                        Home Address{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={data.address}
                                        onChange={(e) =>
                                            setData("address", e.target.value)
                                        }
                                        className={`block w-full border ${errors.address ? "border-red-500" : "border-gray-300"} rounded-md p-2 text-sm`}
                                    />
                                    {errors.address && (
                                        <div className="mt-1 text-xs text-red-500">
                                            {errors.address}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="save-section flex justify-end gap-4">
                                <button
                                    type="button"
                                    className="cancel-button rounded-md px-4 py-2 text-sm font-medium"
                                    onClick={() => window.history.back()}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveAndAddAppointment}
                                    disabled={processing}
                                    className={`save-button rounded-md px-6 py-2 text-sm font-medium text-white ${processing ? "bg-gray-400" : "bg-[#429ABF] hover:bg-[#39AAD9]"}`}
                                >
                                    {processing
                                        ? "Saving..."
                                        : "Save and Add Appointment"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
