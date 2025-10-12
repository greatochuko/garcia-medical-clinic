import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React, { useState } from "react";
import SettingsSidebar from "./SettingsSidebar";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { FaSort } from "react-icons/fa6";
import AddServiceModal from "@/Components/modals/AddServiceModal";
import DeleteServiceModal from "@/Components/modals/DeleteServiceModal";

export default function Services({ auth, services }) {
    const [user, setUser] = useState(auth.user);
    const [sortBy, setSortBy] = useState({ field: "", type: "" });
    const [serviceModalOpen, setServiceModalOpen] = useState(false);
    const [serviceToEdit, setServiceToEdit] = useState(null);
    const [deleteServiceModalOpen, setDeleteServiceModalOpen] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState(null);

    function handleSortBy(field) {
        setSortBy((prev) => {
            if (prev.field === field) {
                return {
                    ...prev,
                    type: prev.type === "asc" ? "desc" : "asc",
                };
            }
            return { field, type: "asc" };
        });
    }

    return (
        <>
            <AuthenticatedLayout
                pageTitle="Settings: Services"
                user={user}
                setUser={setUser}
            >
                <div className="flex max-w-full flex-1">
                    <SettingsSidebar />
                    <div className="mx-[2.5%] mt-6 flex flex-1 flex-col rounded-lg bg-white text-accent">
                        <div className="relative mb-2 flex flex-col items-center gap-1 border-b-2 border-accent-200 p-4 px-4 pb-6">
                            <h1 className="text-center text-sm font-bold sm:text-base">
                                SERVICES
                            </h1>
                            <button
                                onClick={() => setServiceModalOpen(true)}
                                className="absolute bottom-0 left-1/2 flex w-fit -translate-x-1/2 translate-y-1/2 items-center gap-2 rounded-md border-2 border-dashed border-accent bg-accent-200 p-2 text-xs text-accent duration-200 hover:bg-accent-300 sm:left-auto sm:right-4 sm:translate-x-0 md:rounded-lg"
                            >
                                <img
                                    src="/assets/icons/plus-icon.svg"
                                    alt="plus icon"
                                    width={14}
                                    height={14}
                                    className="h-3 w-3 sm:h-3.5 sm:w-3.5"
                                />
                                Add Services
                            </button>
                        </div>
                        <div className="flex flex-1 flex-col gap-4 p-4">
                            <p className="flex items-center gap-2 text-xs sm:text-sm">
                                <img
                                    src="/assets/icons/info-icon.svg"
                                    alt="info icon"
                                    width={14}
                                    height={14}
                                />
                                Below are the clinic medical and healthcare
                                offerings provided in the system by licensed
                                professionals.
                            </p>

                            <table className="w-full text-xs sm:text-sm">
                                <thead>
                                    <tr className="whitespace-nowrap text-sm">
                                        <th className="w-2/6 min-w-32 p-4 sm:min-w-36">
                                            <span
                                                onClick={() =>
                                                    handleSortBy("service")
                                                }
                                                className="flex w-fit cursor-pointer items-center gap-2"
                                            >
                                                Service Name
                                                {sortBy.field === "service" ? (
                                                    sortBy.type === "asc" ? (
                                                        <TiArrowSortedUp
                                                            size={16}
                                                        />
                                                    ) : (
                                                        <TiArrowSortedDown
                                                            size={16}
                                                        />
                                                    )
                                                ) : (
                                                    <FaSort size={14} />
                                                )}
                                            </span>
                                        </th>
                                        <th className="w-1/6 min-w-48 p-4 text-left">
                                            <span
                                                onClick={() =>
                                                    handleSortBy("patient")
                                                }
                                                className="flex w-fit cursor-pointer items-center gap-2"
                                            >
                                                Patient Type
                                                {sortBy.field === "patient" ? (
                                                    sortBy.type === "asc" ? (
                                                        <TiArrowSortedUp
                                                            size={16}
                                                        />
                                                    ) : (
                                                        <TiArrowSortedDown
                                                            size={16}
                                                        />
                                                    )
                                                ) : (
                                                    <FaSort size={14} />
                                                )}
                                            </span>
                                        </th>
                                        <th className="w-1/6 min-w-36 p-4 text-left">
                                            <span
                                                onClick={() =>
                                                    handleSortBy("price")
                                                }
                                                className="flex w-fit cursor-pointer items-center gap-2"
                                            >
                                                Price
                                                {sortBy.field === "price" ? (
                                                    sortBy.type === "asc" ? (
                                                        <TiArrowSortedUp
                                                            size={16}
                                                        />
                                                    ) : (
                                                        <TiArrowSortedDown
                                                            size={16}
                                                        />
                                                    )
                                                ) : (
                                                    <FaSort size={14} />
                                                )}
                                            </span>
                                        </th>
                                        <th className="w-1/6 min-w-36 p-4">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {services.map((serv) => (
                                        <tr key={serv.id}>
                                            <td className="p-4">{serv.name}</td>
                                            <td className="p-4">
                                                {serv.patient_type}
                                            </td>
                                            <td className="p-4">
                                                {serv.charge}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setServiceModalOpen(
                                                                true,
                                                            );
                                                            setServiceToEdit(
                                                                serv,
                                                            );
                                                        }}
                                                        className="rounded-md border border-transparent p-2 duration-100 hover:border-accent-400 hover:bg-accent-300"
                                                    >
                                                        <img
                                                            src="/assets/icons/edit-icon.svg"
                                                            alt="Edit Icon"
                                                            width={14}
                                                            height={14}
                                                        />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setDeleteServiceModalOpen(
                                                                true,
                                                            );
                                                            setServiceToDelete(
                                                                serv,
                                                            );
                                                        }}
                                                        className="rounded-md border border-transparent p-2 duration-100 hover:border-accent-400 hover:bg-accent-300"
                                                    >
                                                        <img
                                                            src="/assets/icons/delete-icon.svg"
                                                            alt="Edit Icon"
                                                            width={14}
                                                            height={14}
                                                        />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>

            <AddServiceModal
                open={serviceModalOpen}
                closeModal={() => {
                    setServiceModalOpen(false);
                    setServiceToEdit(null);
                }}
                serviceToEdit={serviceToEdit}
            />

            <DeleteServiceModal
                closeModal={() => {
                    setDeleteServiceModalOpen(false);
                    setServiceToDelete(null);
                }}
                open={deleteServiceModalOpen}
                serviceToDelete={serviceToDelete}
            />
        </>
    );
}
