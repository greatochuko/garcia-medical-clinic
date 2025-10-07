import Input from "@/Components/layout/Input";
import AddMedicineModal from "@/Components/modals/AddMedicineModal";
import DeleteMedicineModal from "@/Components/modals/DeleteMedicineModal";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React, { useMemo, useState } from "react";
import { FaSort } from "react-icons/fa6";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";

const allCategories = [
    "Pain Relief",
    "Antibiotic",
    "Diabetes",
    "Gastrointestinal",
    "Cardiovascular",
    "CNS",
    "Antifungal",
    "Antiviral",
    "Respiratory",
    "Allergy",
    "Dermatological",
    "Vitamins & Supplements",
    "Hormonal",
    "Ophthalmic",
    "ENT (Ear, Nose & Throat)",
    "Musculoskeletal",
    "Oncology",
    "Renal",
    "Immunological",
    "Psychiatric",
    "Anesthetic",
    "Antiseptic",
    "Antimalarial",
    "Anti-inflammatory",
    "Antihypertensive",
];

export default function Inventory({ auth, medications: medicationList }) {
    const [user, setUser] = useState(auth.user);
    const [medicineModalOpen, setMedicineModalOpen] = useState(false);
    const [deleteMedicineModalOpen, setDeleteMedicineModalOpen] =
        useState(false);
    const [medicineToEdit, setMedicineToEdit] = useState(null);
    const [medicineToDelete, setMedicineToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [sortBy, setSortBy] = useState({ field: "date", type: "desc" });

    const medications = useMemo(() => {
        let filtered = searchQuery
            ? medicationList.filter(
                  (med) =>
                      med.name
                          .toLowerCase()
                          .includes(searchQuery.trim().toLowerCase()) ||
                      med.category
                          .toLowerCase()
                          .includes(searchQuery.trim().toLowerCase()),
              )
            : medicationList;

        if (selectedCategory)
            filtered = filtered.filter(
                (med) => med.category === selectedCategory,
            );

        if (selectedStatus === "in-stock")
            filtered = filtered.filter((med) => med.quantity > 10);
        else if (selectedStatus === "low-supply")
            filtered = filtered.filter(
                (med) => med.quantity > 0 && med.quantity <= 10,
            );
        else if (selectedStatus === "out-of-stock")
            filtered = filtered.filter((med) => med.quantity <= 0);

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
                case "category":
                    valA = a.category.toLowerCase();
                    valB = b.category.toLowerCase();
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
    }, [medicationList, searchQuery, selectedCategory, selectedStatus, sortBy]);

    const { inventoryStats } = useMemo(() => {
        const uniqueCategories = [
            ...new Set(medicationList.map((med) => med.category)),
        ];

        return {
            inventoryStats: [
                {
                    name: "Total Medications",
                    value: medicationList.length,
                    icon: "medicine-box-icon.svg",
                },
                {
                    name: "Categories",
                    value: uniqueCategories.length,
                    icon: "search-category-icon.svg",
                },
                {
                    name: "Low Stock",
                    value: medicationList.filter((med) => med.quantity <= 10)
                        .length,
                    icon: "box-alert-icon.svg",
                },
                {
                    name: "Out of Stock",
                    value: medicationList.filter((med) => med.quantity < 1)
                        .length,
                    icon: "box-alert-icon-outline.svg",
                },
                // { name: "Expiring Soon", value: 0, icon: "expiring-icon.svg" },
            ],
            uniqueCategories,
        };
    }, [medicationList]);

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
                pageTitle="Inventory"
                user={user}
                setUser={setUser}
            >
                <div className="max-w-full flex-1 pt-6">
                    <div className="mx-auto h-full w-[95%] max-w-screen-2xl rounded-lg bg-white text-accent">
                        <div className="relative mb-2 flex flex-col items-center gap-1 border-b-2 border-accent-200 p-4 px-4 pb-6 text-center">
                            <h1 className="text-center text-sm font-bold">
                                INVENTORY OVERVIEW
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
                        <div className="grid grid-cols-2 gap-4 border-b-8 border-accent-200 p-4 sm:grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] sm:gap-6 lg:gap-8">
                            {inventoryStats.map((stat) => (
                                <div
                                    key={stat.name}
                                    className="flex items-center gap-2 rounded-lg bg-accent-200 p-3 px-4 sm:gap-4 sm:p-4 sm:px-6"
                                >
                                    <img
                                        src={`/assets/icons/${stat.icon}`}
                                        alt={stat.name + "icon"}
                                        height={24}
                                        width={24}
                                        className="h-6 w-6 object-contain"
                                    />
                                    <div className="flex-1">
                                        <h5 className="text-xs font-bold">
                                            {stat.name}
                                        </h5>
                                        <p className="text-sm">{stat.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col items-center gap-4 p-4 sm:flex-row">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                    }}
                                    className="relative flex w-full max-w-xs flex-1"
                                >
                                    <Input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="w-0 flex-1 pr-10"
                                        placeholder="Type here to search"
                                    />
                                    <img
                                        src="/assets/icons/search-icon.svg"
                                        alt="Search Icon"
                                        width={18}
                                        height={18}
                                        className="absolute right-3 top-1/2 -translate-y-1/2"
                                    />
                                </form>
                                <div className="flex items-center gap-4">
                                    <select
                                        name="category"
                                        id="category"
                                        value={selectedCategory}
                                        onChange={(e) =>
                                            setSelectedCategory(e.target.value)
                                        }
                                        className="cursor-pointer rounded-lg border-accent p-2.5 pr-6 text-xs outline-none focus:border-accent-500 focus:ring-2 focus:ring-[#089bab]/50 disabled:cursor-not-allowed disabled:bg-[#E4E4E4] disabled:text-gray-500"
                                    >
                                        <option value="">All Categories</option>
                                        {allCategories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        name="status"
                                        id="status"
                                        value={selectedStatus}
                                        onChange={(e) =>
                                            setSelectedStatus(e.target.value)
                                        }
                                        className="cursor-pointer rounded-lg border-accent p-2.5 pr-6 text-xs outline-none focus:border-accent-500 focus:ring-2 focus:ring-[#089bab]/50 disabled:cursor-not-allowed disabled:bg-[#E4E4E4] disabled:text-gray-500"
                                    >
                                        <option value="">All Status</option>
                                        <option value="in-stock">
                                            In Stock
                                        </option>
                                        <option value="out-of-stock">
                                            Out of Stock
                                        </option>
                                        <option value="low-supply">
                                            Low Supply
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-xs sm:text-sm">
                                    <thead>
                                        <tr className="whitespace-nowrap text-sm">
                                            <th className="w-[10%] min-w-32 p-4 sm:min-w-36">
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
                                                    Stock
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
                                                        handleSortBy("status")
                                                    }
                                                    className="mx-auto flex w-fit cursor-pointer items-center gap-2"
                                                >
                                                    Status
                                                    {sortBy.field ===
                                                    "status" ? (
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
                                                <td className="flex items-center justify-center p-4 text-center text-xs">
                                                    {med.quantity > 10 ? (
                                                        <span className="block w-24 rounded-md bg-accent p-1 text-white">
                                                            In Stock
                                                        </span>
                                                    ) : med.quantity > 0 ? (
                                                        <span className="block w-24 rounded-md border border-dashed border-accent bg-white p-1 text-accent">
                                                            Low Supply
                                                        </span>
                                                    ) : (
                                                        <span className="block w-24 rounded-md bg-[#8D2310] p-1 text-white">
                                                            Out of Stock
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-4 text-center">
                                                    {med.price}
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
