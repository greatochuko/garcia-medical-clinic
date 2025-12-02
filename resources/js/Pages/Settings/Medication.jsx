import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React, { useMemo, useState } from "react";
import SettingsSidebar from "./SettingsSidebar";
import AddMedicineModal from "@/Components/modals/AddMedicineModal";
import DeleteMedicineModal from "@/Components/modals/DeleteMedicineModal";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { FaSort } from "react-icons/fa";

export default function Medication({ auth, medications: medicationList }) {
    const [medicineModalOpen, setMedicineModalOpen] = useState(false);
    const [deleteMedicineModalOpen, setDeleteMedicineModalOpen] =
        useState(false);
    const [medicineToEdit, setMedicineToEdit] = useState(null);
    const [medicineToDelete, setMedicineToDelete] = useState(null);
    const [sortBy, setSortBy] = useState({ field: "date", type: "desc" });

    const medications = useMemo(() => {
        let filtered = medicationList;

        filtered = [...filtered].sort((a, b) => {
            const { field, type } = sortBy;
            let valA, valB;

            switch (field) {
                case "date":
                    valA = new Date(a.created_at);
                    valB = new Date(b.created_at);
                    break;
                case "medication":
                    valA = a.name.toLowerCase();
                    valB = b.name.toLowerCase();
                    break;
                case "controlled":
                    valA = a.controlled;
                    valB = b.controlled;
                    break;
                case "stock":
                    valA = a.quantity;
                    valB = b.quantity;
                    break;
                case "status": {
                    const getStatusValue = (med) =>
                        med.quantity <= 0 ? 0 : med.quantity <= 10 ? 1 : 2;
                    valA = getStatusValue(a);
                    valB = getStatusValue(b);
                    break;
                }
                case "price":
                    valA = a.price;
                    valB = b.price;
                    break;
                default:
                    return 0;
            }

            if (valA < valB) return type === "asc" ? -1 : 1;
            if (valA > valB) return type === "asc" ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [medicationList, sortBy]);

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
            <AuthenticatedLayout pageTitle="Settings: Medication">
                <div className="flex max-w-full flex-1">
                    <SettingsSidebar userRole={auth.user.role} />
                    <div className="mx-[2.5%] mt-6 flex flex-1 flex-col overflow-hidden rounded-lg bg-white text-accent">
                        <div className="relative mb-2 flex flex-col items-center gap-1 border-b-2 border-accent-200 p-4 px-4 pb-6">
                            <h1 className="text-center text-sm font-bold sm:text-base">
                                MEDICATION
                            </h1>
                            <button
                                onClick={() => setMedicineModalOpen(true)}
                                className="absolute bottom-0 left-1/2 flex w-fit -translate-x-1/2 translate-y-1/2 items-center gap-2 rounded-md border-2 border-dashed border-accent bg-accent-200 p-2 text-xs text-accent duration-200 hover:bg-accent-300 sm:left-auto sm:right-4 sm:translate-x-0 md:rounded-lg"
                            >
                                <img
                                    src="/assets/icons/plus-icon.svg"
                                    alt="plus icon"
                                    width={14}
                                    height={14}
                                    className="h-3 w-3 sm:h-3.5 sm:w-3.5"
                                />
                                Add Medicine
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
                                Real-time display of all medications prescribed
                                to a patient, including active, discontinued,
                                and historical prescriptions.
                            </p>

                            <div className="flex-1 overflow-x-auto">
                                <table className="w-full text-xs sm:text-sm">
                                    <thead>
                                        <tr className="whitespace-nowrap text-sm">
                                            <th className="w-[10%] min-w-40 p-4">
                                                <span
                                                    onClick={() =>
                                                        handleSortBy("date")
                                                    }
                                                    className="flex w-fit cursor-pointer items-center gap-2"
                                                >
                                                    Date
                                                    {sortBy.field === "date" ? (
                                                        sortBy.type ===
                                                        "asc" ? (
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
                                            <th className="w-[20%] min-w-48 p-4 text-left">
                                                <span
                                                    onClick={() =>
                                                        handleSortBy(
                                                            "medication",
                                                        )
                                                    }
                                                    className="flex w-fit cursor-pointer items-center gap-2"
                                                >
                                                    Medication
                                                    {sortBy.field ===
                                                    "medication" ? (
                                                        sortBy.type ===
                                                        "asc" ? (
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
                                            <th className="w-[15%] min-w-36 p-4 text-left">
                                                <span
                                                    onClick={() =>
                                                        handleSortBy("category")
                                                    }
                                                    className="flex w-fit cursor-pointer items-center gap-2"
                                                >
                                                    Category
                                                    {sortBy.field ===
                                                    "category" ? (
                                                        sortBy.type ===
                                                        "asc" ? (
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
                                            <th className="w-[10%] p-4">
                                                <span
                                                    onClick={() =>
                                                        handleSortBy("stock")
                                                    }
                                                    className="mx-auto flex w-fit cursor-pointer items-center gap-2"
                                                >
                                                    Quantity
                                                    {sortBy.field ===
                                                    "stock" ? (
                                                        sortBy.type ===
                                                        "asc" ? (
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

                                            <th className="w-[10%] p-4">
                                                <span
                                                    onClick={() =>
                                                        handleSortBy("price")
                                                    }
                                                    className="mx-auto flex w-fit cursor-pointer items-center gap-2"
                                                >
                                                    Price (PHP)
                                                    {sortBy.field ===
                                                    "price" ? (
                                                        sortBy.type ===
                                                        "asc" ? (
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

                                            <th className="w-[10%] p-4">
                                                <span
                                                    onClick={() =>
                                                        handleSortBy(
                                                            "controlled",
                                                        )
                                                    }
                                                    className="mx-auto flex w-fit cursor-pointer items-center gap-2"
                                                >
                                                    Controlled
                                                    {sortBy.field ===
                                                    "controlled" ? (
                                                        sortBy.type ===
                                                        "asc" ? (
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

                                            <th className="w-[10%] p-4">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-black/10">
                                        {medications.map((med) => (
                                            <tr key={med.id}>
                                                <td className="p-4">
                                                    {new Date(
                                                        med.created_at,
                                                    ).toLocaleDateString(
                                                        "us-en",
                                                        {
                                                            day: "numeric",
                                                            month: "long",
                                                            year: "numeric",
                                                        },
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    {med.name}
                                                </td>
                                                <td className="p-4">
                                                    {med.category}
                                                </td>
                                                <td className="p-4 text-center">
                                                    {med.quantity}
                                                </td>
                                                <td className="p-4 text-center">
                                                    {med.price}
                                                </td>
                                                <td className="p-4 text-center">
                                                    {med.controlled
                                                        ? "Yes"
                                                        : "-"}
                                                </td>
                                                <td className="p-4 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setMedicineToEdit(
                                                                    med,
                                                                );
                                                                setMedicineModalOpen(
                                                                    true,
                                                                );
                                                            }}
                                                            className="rounded-md border border-transparent p-1.5 duration-100 hover:border-accent-400 hover:bg-accent-300"
                                                        >
                                                            <img
                                                                src="/assets/icons/edit-icon.svg"
                                                                alt="Edit Icon"
                                                                className="h-3.5 w-3.5 object-contain sm:h-4 sm:w-4"
                                                            />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setDeleteMedicineModalOpen(
                                                                    true,
                                                                );
                                                                setMedicineToDelete(
                                                                    med,
                                                                );
                                                            }}
                                                            className="rounded-md border border-transparent p-1.5 duration-100 hover:border-accent-400 hover:bg-accent-300"
                                                        >
                                                            <img
                                                                src="/assets/icons/delete-icon.svg"
                                                                alt="Edit Icon"
                                                                className="h-3.5 w-3.5 object-contain sm:h-4 sm:w-4"
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
                </div>
            </AuthenticatedLayout>

            <AddMedicineModal
                closeModal={() => {
                    setMedicineModalOpen(false);
                    setMedicineToEdit(null);
                }}
                open={medicineModalOpen}
                medicineToEdit={medicineToEdit}
            />

            <DeleteMedicineModal
                closeModal={() => {
                    setDeleteMedicineModalOpen(false);
                    setMedicineToDelete(null);
                }}
                open={deleteMedicineModalOpen}
                medicineToDelete={medicineToDelete}
            />
        </>
    );
}
