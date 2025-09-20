import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Link } from "@inertiajs/react";
import React, { useState } from "react";

const patients = [
    { id: "1", first_name: "John", last_name: "Doe" },
    { id: "2", first_name: "Emily", last_name: "Clark" },
    { id: "3", first_name: "Michael", last_name: "Smith" },
    { id: "4", first_name: "Sophia", last_name: "Brown" },
    { id: "5", first_name: "Daniel", last_name: "Johnson" },
    { id: "6", first_name: "Olivia", last_name: "Martinez" },
    { id: "7", first_name: "James", last_name: "Wilson" },
    { id: "8", first_name: "Ava", last_name: "Taylor" },
    { id: "9", first_name: "Ethan", last_name: "Anderson" },
    { id: "10", first_name: "Isabella", last_name: "Thomas" },
];

export default function SelectPatient() {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredPatients = patients.filter(
        (patient) =>
            patient.first_name
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            patient.last_name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <AuthenticatedLayout pageTitle={"Select Patient"}>
            <div className="flex-1">
                <div className="max-w-8xl mx-auto mt-6 h-full w-[95%] bg-white text-accent md:px-6">
                    <h1 className="border-b-2 border-accent-200 py-2 text-center font-bold">
                        CREATE APPOINTMENT (SELECT PATIENT)
                    </h1>
                    <div className="flex flex-col items-center gap-6 border-b-2 border-accent-200 py-12 text-center">
                        <p className="text-sm">
                            Search here to check if patient has record or is
                            already registered in your clinic.
                        </p>
                        <div className="relative flex w-[90%] max-w-sm">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-0 flex-1 rounded-[10px] border-accent-300 bg-accent-200 p-2 px-4 pr-10 text-sm duration-200 focus:border-inherit focus:ring-accent"
                                placeholder="Start typing..."
                            />
                            <img
                                src="/assets/icons/search-icon.svg"
                                alt="Search Icon"
                                width={18}
                                height={18}
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                            />

                            {searchQuery && (
                                <div className="absolute left-1/2 top-full w-full -translate-x-1/2 translate-y-1">
                                    <ul className="max-h-40 overflow-y-auto rounded-lg border bg-white text-start text-sm shadow-md">
                                        {filteredPatients.length > 0 ? (
                                            filteredPatients.map((patient) => (
                                                <li key={patient.id}>
                                                    <Link
                                                        href="/appointments/create"
                                                        key={patient.id}
                                                        className="block p-3 duration-200 hover:bg-accent-200"
                                                    >
                                                        {patient.first_name}{" "}
                                                        {patient.last_name}
                                                    </Link>
                                                </li>
                                            ))
                                        ) : (
                                            <p className="p-3 text-accent-500">
                                                No record found for search
                                                &ldquo;{searchQuery}&rdquo;
                                            </p>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-6 border-b-2 border-accent-200 py-12 text-center">
                        <p className="text-sm">
                            No records found? Click the button to register
                            patient and create appointment.
                        </p>
                        <Link
                            href="/allpatients/add"
                            className="flex w-fit items-center gap-2 rounded-[10px] border-2 border-dashed border-accent bg-accent-200 p-2 text-xs text-accent duration-200 hover:bg-accent-300"
                        >
                            <img
                                src="/assets/icons/plus-icon.svg"
                                alt="plus icon"
                                width={14}
                                height={14}
                            />
                            Register Patient
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
