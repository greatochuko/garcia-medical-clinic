import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React, { useMemo, useState } from "react";
import SettingsSidebar from "./SettingsSidebar";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { FaSort } from "react-icons/fa6";
import ToggleSwitch from "@/Components/ui/ToggleSwitch";
import useClickOutside from "@/hooks/useClickOutside";
import { Link } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import { route } from "ziggy-js";
import DeleteAccountModal from "@/Components/modals/DeleteAccountModal";

function getUserFullName(account) {
    return `${account.first_name} ${account.middle_initial ? `${account.middle_initial},` : ""} ${account.last_name}`;
}

export default function Accounts({ auth, accounts: accountList }) {
    const [accountToDelete, setAccountToDelete] = useState(null);
    const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);
    const [sortBy, setSortBy] = useState({ field: "date", type: "desc" });

    const accounts = useMemo(() => {
        const { field, type } = sortBy;
        if (!field) return [...accountList];

        return [...accountList].sort((a, b) => {
            let valA, valB;

            switch (field) {
                case "date":
                    valA = new Date(a.created_at);
                    valB = new Date(b.created_at);
                    break;

                case "name":
                    valA = getUserFullName(a).toLowerCase();
                    valB = getUserFullName(b).toLowerCase();
                    break;

                case "post-nominals":
                    valA = a.role === "doctor" ? 0 : 1;
                    valB = b.role === "doctor" ? 0 : 1;
                    break;

                case "role":
                    valA = a.role.toLowerCase();
                    valB = b.role.toLowerCase();
                    break;

                case "status":
                    valA = a.isActive ? 1 : 0;
                    valB = b.isActive ? 1 : 0;
                    break;

                default:
                    return 0;
            }

            if (valA < valB) return type === "asc" ? -1 : 1;
            if (valA > valB) return type === "asc" ? 1 : -1;
            return 0;
        });
    }, [accountList, sortBy]);

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

    function toggleAccountIsActive(accountId) {
        router.patch(
            route("settings.accounts.toggle_status", accountId),
            {},
            {
                onError: (err) => {
                    console.error(err);
                },
            },
        );
    }

    return (
        <>
            <AuthenticatedLayout pageTitle="Settings: User Accounts">
                <div className="flex max-w-full flex-1">
                    <SettingsSidebar userRole={auth.user.role} />
                    <div className="mx-[2.5%] mt-6 flex flex-1 flex-col overflow-hidden rounded-lg bg-white text-accent">
                        <div className="relative mb-2 flex flex-col items-center gap-1 border-b-2 border-accent-200 p-4 px-4 pb-6">
                            <h1 className="text-center text-sm font-bold sm:text-base">
                                USER ACCOUNT <br className="sm:hidden" />
                                (ADMIN ACCESS ONLY)
                            </h1>
                            <AddAccountButton />
                        </div>
                        <div className="flex flex-1 flex-col gap-4 p-4">
                            <p className="flex items-center gap-2 text-xs sm:text-sm">
                                <img
                                    src="/assets/icons/info-icon.svg"
                                    alt="info icon"
                                    width={14}
                                    height={14}
                                />
                                List of personalized access profile assigned to
                                an individual authorized to use the this system.
                            </p>

                            <div className="max-w-full overflow-auto">
                                <table className="w-full text-xs sm:text-sm">
                                    <thead className="whitespace-nowrap">
                                        <tr className="text-sm">
                                            <th className="w-[15%] p-4">
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
                                            <th className="w-[25%] p-4">
                                                <span
                                                    onClick={() =>
                                                        handleSortBy("name")
                                                    }
                                                    className="flex w-fit cursor-pointer items-center gap-2"
                                                >
                                                    Full Name
                                                    {sortBy.field === "name" ? (
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
                                            <th className="w-[15%] p-4">
                                                <span
                                                    onClick={() =>
                                                        handleSortBy(
                                                            "post-nominals",
                                                        )
                                                    }
                                                    className="flex cursor-pointer items-center gap-2"
                                                >
                                                    Post Nominals
                                                    {sortBy.field ===
                                                    "post-nominals" ? (
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
                                            <th className="w-[15%] p-4">
                                                <span
                                                    onClick={() =>
                                                        handleSortBy("role")
                                                    }
                                                    className="flex w-fit cursor-pointer items-center gap-2"
                                                >
                                                    Role
                                                    {sortBy.field === "role" ? (
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
                                            <th className="w-[15%] p-4">
                                                <span
                                                    onClick={() =>
                                                        handleSortBy("status")
                                                    }
                                                    className="flex w-fit cursor-pointer items-center gap-2"
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
                                            <th className="w-[15%] min-w-28 p-4">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {accounts.map((account) => (
                                            <tr key={account.id}>
                                                <td className="whitespace-nowrap p-4 capitalize">
                                                    {new Date(
                                                        account.created_at,
                                                    ).toLocaleDateString(
                                                        "us-en",
                                                        {
                                                            day: "numeric",
                                                            month: "long",
                                                            year: "numeric",
                                                        },
                                                    )}
                                                </td>
                                                <td className="whitespace-nowrap p-4 capitalize">
                                                    {getUserFullName(account)}
                                                </td>
                                                <td className="p-4">
                                                    {account.role === "doctor"
                                                        ? "MD"
                                                        : "-"}
                                                </td>
                                                <td className="p-4 capitalize">
                                                    {account.role}
                                                </td>
                                                <td className="p-4">
                                                    <ToggleSwitch
                                                        checked={
                                                            account.isActive
                                                        }
                                                        activeColor="#15475B"
                                                        onChange={() =>
                                                            toggleAccountIsActive(
                                                                account.id,
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Link
                                                            href={route(
                                                                "settings.accounts.update",
                                                                account.id,
                                                            )}
                                                            className="rounded-md border border-transparent p-2 duration-100 hover:border-accent-400 hover:bg-accent-300"
                                                        >
                                                            <img
                                                                src="/assets/icons/edit-icon.svg"
                                                                alt="Edit Icon"
                                                                width={14}
                                                                height={14}
                                                            />
                                                        </Link>
                                                        <button
                                                            onClick={() => {
                                                                setDeleteAccountModalOpen(
                                                                    true,
                                                                );
                                                                setAccountToDelete(
                                                                    account,
                                                                );
                                                            }}
                                                            hidden={
                                                                account.id ===
                                                                auth.user.id
                                                            }
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
                </div>
            </AuthenticatedLayout>

            <DeleteAccountModal
                closeModal={() => {
                    setDeleteAccountModalOpen(false);
                    setAccountToDelete(null);
                }}
                open={deleteAccountModalOpen}
                accountToDelete={accountToDelete}
            />
        </>
    );
}

function AddAccountButton() {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [dropdownRef] = useClickOutside(() => setDropdownOpen(false));

    return (
        <div
            ref={dropdownRef}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 sm:left-auto sm:right-4 sm:translate-x-0"
        >
            <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex w-fit items-center gap-2 whitespace-nowrap rounded-md border-2 border-dashed border-accent bg-accent-200 p-2 text-xs text-accent duration-200 hover:bg-accent-300 md:rounded-lg"
            >
                <img
                    src="/assets/icons/plus-icon.svg"
                    alt="plus icon"
                    width={14}
                    height={14}
                    className="h-3 w-3 sm:h-3.5 sm:w-3.5"
                />
                Add User Access
            </button>
            <div
                className={`absolute left-1/2 top-full z-10 flex w-48 -translate-x-1/2 flex-col divide-y divide-accent-200 overflow-hidden rounded-md bg-white text-xs shadow-md duration-200 sm:left-auto sm:right-0 sm:translate-x-0 ${dropdownOpen ? "" : "invisible translate-y-[0.3rem] opacity-0"} `}
            >
                {["doctor", "secretary", "admin"].map((role) => (
                    <Link
                        href={`/settings/accounts/new/${role}`}
                        key={role}
                        className="p-3 text-left capitalize duration-200 hover:bg-accent-300"
                    >
                        Create {role} Account
                    </Link>
                ))}
            </div>
        </div>
    );
}
