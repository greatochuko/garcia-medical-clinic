import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import PropTypes from "prop-types";
import useClickOutside from "@/hooks/useClickOutside";
import { route } from "ziggy-js";
import { router } from "@inertiajs/react";
import { MdLogout, MdSettings } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { LuChartColumn } from "react-icons/lu";

const dropdownLinks = [
    {
        text: "Profile",
        href: "/profile",
        Icon: FaUser,
        allowedRoles: ["admin", "secretary", "doctor"],
    },
    {
        text: "Stats",
        href: "/stats",
        Icon: LuChartColumn,
        allowedRoles: ["admin", "doctor"],
    },
    {
        text: "Settings",
        href: "/settings",
        Icon: MdSettings,
        allowedRoles: ["admin", "secretary", "doctor"],
    },
];

export default function UserDropdown({ user }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [dropdownRef] = useClickOutside(() => setDropdownOpen(false));

    const userFullName = `${user?.first_name || ""} ${user?.middle_initial ? `${user.middle_initial}.` : ""} ${user?.last_name || ""}`;

    function handleLogout() {
        router.post(route("logout"), {
            onError: (errors) => {
                console.error(errors);
            },
        });
    }

    return (
        <div
            ref={dropdownRef}
            className="relative flex cursor-pointer items-center gap-2"
            onClick={() => setDropdownOpen((prev) => !prev)}
        >
            <div className="hidden flex-col items-end sm:flex">
                <h4 className="text-xs capitalize text-white">
                    {userFullName}
                </h4>
                <p
                    className={`text-[10px] ${user?.role === "admin" ? "text-accent-orange" : user?.role === "doctor" ? "text-white" : "text-[#429ABF]"}`}
                >
                    {user ? user?.role.toUpperCase() : ""}
                </p>
            </div>
            <img
                src={user?.avatar_url || "/images/placeholder-avatar.jpg"}
                alt={userFullName + " profile picture"}
                height={45}
                width={45}
                className={`overflow-hidden rounded-full border-2 object-cover ${user?.role === "admin" ? "border-accent-orange" : user?.role === "doctor" ? "border-white" : "border-[#429ABF]"}`}
            />

            <div
                className={`absolute bottom-0 right-0 z-10 flex w-40 flex-col divide-y divide-accent-200 overflow-hidden rounded-md bg-white text-xs shadow-md duration-200 ${dropdownOpen ? "translate-y-[calc(100%+.5rem)]" : "invisible translate-y-[calc(100%+.8rem)] opacity-0"} `}
            >
                {dropdownLinks.map((link, i) =>
                    link.allowedRoles.includes(user?.role) ? (
                        <Link
                            key={i}
                            href={link.href}
                            className="flex items-center gap-2 p-3 duration-200 hover:bg-accent-300"
                        >
                            <link.Icon size={14} />
                            {link.text}
                        </Link>
                    ) : null,
                )}
                <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2 p-3 text-left text-[#8D2310] duration-200 hover:bg-[#8D2310]/10"
                >
                    <MdLogout size={14} />
                    Logout
                </button>
            </div>
        </div>
    );
}

UserDropdown.propTypes = {
    user: PropTypes.shape({
        first_name: PropTypes.string,
        last_name: PropTypes.string,
        role: PropTypes.string,
        profile_picture: PropTypes.string,
    }).isRequired,
    setUser: PropTypes.func,
};
