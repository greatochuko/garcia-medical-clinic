import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React, { useMemo, useState } from "react";
import { FaSort } from "react-icons/fa6";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";

export default function InventoryMedicationDetails({ medication }) {
    const [sortBy, setSortBy] = useState({
        field: "date",
        type: "desc",
    });

    const totalStocked = useMemo(() => {
        return medication.inventory_changes
            .filter((change) => change.quantity > 0)
            .reduce((sum, change) => sum + change.quantity, 0);
    }, [medication.inventory_changes]);

    const totalReleased = useMemo(() => {
        return medication.inventory_changes
            .filter((change) => change.quantity < 0)
            .reduce((sum, change) => sum + change.quantity, 0);
    }, [medication.inventory_changes]);

    const inventoryChanges = useMemo(() => {
        let filtered = medication.inventory_changes;

        filtered = [...filtered].sort((a, b) => {
            const { field, type } = sortBy;
            let valA, valB;

            const userNameA =
                a.user.first_name?.toLowerCase() +
                " " +
                a.user.last_name?.toLowerCase();
            const userNameB =
                b.user.first_name?.toLowerCase() +
                " " +
                b.user.last_name?.toLowerCase();

            switch (field) {
                case "date":
                    valA = new Date(a.created_at);
                    valB = new Date(b.created_at);
                    break;
                case "lastRunDate":
                    valA = new Date(a.lastRunDate);
                    valB = new Date(b.lastRunDate);
                    break;
                case "entryDetails":
                    valA = a.entryDetails.toLowerCase();
                    valB = b.entryDetails.toLowerCase();
                    break;
                case "quantity":
                    valA = a.quantity;
                    valB = b.quantity;
                    break;
                case "rem+res": {
                    valA = a.newTotal;
                    valB = b.newTotal;
                    break;
                }
                case "expiration":
                    valA = new Date(a.expirationDate);
                    valB = new Date(b.expirationDate);
                    break;
                case "user":
                    valA = userNameA;
                    valB = userNameB;
                    break;
                default:
                    return 0;
            }

            if (valA < valB) return type === "asc" ? -1 : 1;
            if (valA > valB) return type === "asc" ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [medication.inventory_changes, sortBy]);

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
        <AuthenticatedLayout pageTitle="Inventory">
            <div className="max-w-full flex-1 pt-6">
                <div className="mx-auto h-full w-[95%] max-w-screen-2xl rounded-lg bg-white text-accent">
                    <div className="flex flex-col items-center gap-1 border-b-2 border-accent-200 p-4 text-center">
                        <h1 className="text-center text-sm font-bold">
                            {medication.name}
                        </h1>
                    </div>
                    <div className="flex flex-wrap justify-between p-4 sm:gap-8">
                        <div className="flex flex-col gap-1 text-sm">
                            <h2 className="text-lg font-bold sm:text-xl">
                                {medication.name}
                            </h2>
                            <p className="font-semibold text-[#47778B]">
                                Price: {medication.price} PHP
                            </p>
                            <p className="font-semibold text-[#47778B]">
                                Actual Quantity: {medication.quantity}
                            </p>
                        </div>
                        <div className="flex max-w-60 flex-col gap-1 text-sm sm:flex-1">
                            <p className="font-semibold text-[#47778B]">
                                Total Sales: {medication.price} PHP
                            </p>
                            <p className="font-semibold text-[#47778B]">
                                Total Stocked: {totalStocked}
                            </p>
                            <p className="font-semibold text-[#47778B]">
                                Total Released: {totalReleased}
                            </p>
                        </div>
                    </div>
                    <table className="w-full text-xs sm:text-sm">
                        <thead>
                            <tr className="whitespace-nowrap text-sm">
                                <th className="min-w-40 p-4">
                                    <span
                                        onClick={() =>
                                            handleSortBy("lastRunDate")
                                        }
                                        className="flex w-fit cursor-pointer items-center gap-2"
                                    >
                                        Last Run
                                        {sortBy.field === "lastRunDate" ? (
                                            sortBy.type === "asc" ? (
                                                <TiArrowSortedUp size={16} />
                                            ) : (
                                                <TiArrowSortedDown size={16} />
                                            )
                                        ) : (
                                            <FaSort size={14} />
                                        )}
                                    </span>
                                </th>
                                <th className="min-w-48 p-4 text-left">
                                    Medication
                                </th>
                                <th className="min-w-36 p-4 text-left">
                                    <span
                                        onClick={() => handleSortBy("quantity")}
                                        className="flex w-fit cursor-pointer items-center gap-2"
                                    >
                                        Quantity
                                        {sortBy.field === "quantity" ? (
                                            sortBy.type === "asc" ? (
                                                <TiArrowSortedUp size={16} />
                                            ) : (
                                                <TiArrowSortedDown size={16} />
                                            )
                                        ) : (
                                            <FaSort size={14} />
                                        )}
                                    </span>
                                </th>
                                <th className="min-w-36 p-4 text-left">
                                    <span
                                        onClick={() =>
                                            handleSortBy("entry-details")
                                        }
                                        className="flex w-fit cursor-pointer items-center gap-2"
                                    >
                                        Entry Details
                                        {sortBy.field === "entry-details" ? (
                                            sortBy.type === "asc" ? (
                                                <TiArrowSortedUp size={16} />
                                            ) : (
                                                <TiArrowSortedDown size={16} />
                                            )
                                        ) : (
                                            <FaSort size={14} />
                                        )}
                                    </span>
                                </th>
                                <th className="p-4">
                                    <span
                                        onClick={() =>
                                            handleSortBy("expiration")
                                        }
                                        className="mx-auto flex w-fit cursor-pointer items-center gap-2"
                                    >
                                        Expiry Date
                                        {sortBy.field === "expiration" ? (
                                            sortBy.type === "asc" ? (
                                                <TiArrowSortedUp size={16} />
                                            ) : (
                                                <TiArrowSortedDown size={16} />
                                            )
                                        ) : (
                                            <FaSort size={14} />
                                        )}
                                    </span>
                                </th>
                                <th className="p-4">
                                    <span
                                        onClick={() => handleSortBy("user")}
                                        className="mx-auto flex w-fit cursor-pointer items-center gap-2"
                                    >
                                        User
                                        {sortBy.field === "user" ? (
                                            sortBy.type === "asc" ? (
                                                <TiArrowSortedUp size={16} />
                                            ) : (
                                                <TiArrowSortedDown size={16} />
                                            )
                                        ) : (
                                            <FaSort size={14} />
                                        )}
                                    </span>
                                </th>
                                <th className="p-4">
                                    <span
                                        onClick={() => handleSortBy("rem+res")}
                                        className="mx-auto flex w-fit cursor-pointer items-center gap-2"
                                    >
                                        Rem + Res
                                        {sortBy.field === "rem+res" ? (
                                            sortBy.type === "asc" ? (
                                                <TiArrowSortedUp size={16} />
                                            ) : (
                                                <TiArrowSortedDown size={16} />
                                            )
                                        ) : (
                                            <FaSort size={14} />
                                        )}
                                    </span>
                                </th>

                                <th className="p-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {inventoryChanges.map((change) => (
                                <tr
                                    key={change.id}
                                    className="border-t border-accent-200 hover:bg-accent-100"
                                >
                                    <td className="p-4">
                                        {new Date(
                                            change.created_at,
                                        ).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-left">
                                        {medication.name}
                                    </td>
                                    <td className="p-4 text-left">
                                        {change.quantity}
                                    </td>
                                    <td className="p-4 text-left">
                                        {change.entryDetails}
                                    </td>
                                    <td className="p-4 text-center">
                                        {change.expiryDate
                                            ? new Date(
                                                  change.expiryDate,
                                              ).toLocaleDateString()
                                            : "N/A"}
                                    </td>
                                    <td className="p-4 text-center">
                                        {change.user.first_name}
                                        {change.user.last_name}
                                    </td>
                                    <td className="p-4 text-center">
                                        {change.newTotal}
                                    </td>
                                    <td className="p-4 text-center"></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
