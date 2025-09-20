import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import ApplicationLogo from "../ApplicationLogo";
import PropTypes from "prop-types";

const navLinks = [
    {
        href: "/",
        text: "Dashboard",
        icon: "/assets/icons/dashboard-icon-white.svg",
        activeIcon: "/assets/icons/dashboard-icon-active.svg",
    },
    {
        href: "/appointments",
        text: "Appointments",
        icon: "/assets/icons/appointments-icon-white.svg",
        activeIcon: "/assets/icons/appointments-icon-active.svg",
    },
    {
        href: "/medical-records",
        text: "Medical Records",
        icon: "/assets/icons/medical-records-icon-white.svg",
        activeIcon: "/assets/icons/medical-records-icon-active.svg",
    },
    // {
    //     href: "/all-patients",
    //     text: "All Patients",
    //     icon: "/assets/icons/all-patients-icon-white.svg",
    //     activeIcon: "/assets/icons/all-patients-icon-active.svg",
    // },
    {
        href: "/billing-records",
        text: "Billing Records",
        icon: "/assets/icons/billing-records-icon-white.svg",
        activeIcon: "/assets/icons/billing-records-icon-active.svg",
    },
    {
        href: "/inventory",
        text: "Inventory",
        icon: "/assets/icons/inventory-icon-white.svg",
        activeIcon: "/assets/icons/inventory-icon-active.svg",
    },
];

export default function Header({ user, setUser }) {
    const pathname = window.location.pathname;

    function linkIsActive(linkHref) {
        if (linkHref === "/" && pathname === "/dashboard") return true;
        return pathname === linkHref;
    }

    return (
        <header className="relative mt-4 flex items-center justify-between bg-accent py-4 pr-4 sm:justify-normal sm:pr-8">
            <Link
                href="/dashboard"
                className="absolute top-1/2 flex h-[93px] -translate-y-1/2 items-center justify-center overflow-hidden rounded-r-3xl border-2 border-l-0 border-white bg-accent"
            >
                <ApplicationLogo />
            </Link>
            <div className="w-60" />
            <ul className="mx-auto hidden items-center gap-4 text-sm text-white sm:flex xl:ml-0">
                {navLinks.map((navLink) => (
                    <li key={navLink.href}>
                        <Link
                            href={navLink.href}
                            className={`flex items-center gap-2 rounded-md p-2 duration-200 xl:px-4 ${linkIsActive(navLink.href) ? "bg-white text-accent" : "hover:bg-white/10"}`}
                        >
                            <img
                                src={
                                    linkIsActive(navLink.href)
                                        ? navLink.activeIcon
                                        : navLink.icon
                                }
                                alt={navLink.text + " icon"}
                                className="h-5 w-5 xl:h-4 xl:w-4"
                            />
                            <span className="hidden xl:inline">
                                {navLink.text}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
            <UserDropdown user={user} setUser={setUser} />
        </header>
    );
}

export const userPropType = PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    role: PropTypes.string,
    profile_picture: PropTypes.string,
}).isRequired;

Header.propTypes = {
    user: userPropType,
    setUser: PropTypes.func,
};

const dropdownLinks = [
    { text: "Reports", href: "#" },
    { text: "Settings", href: "#" },
    { text: "Logout", href: "#" },
];

function UserDropdown({ user, setUser }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const userFullName = user.first_name + " " + (user.last_name || "");

    return (
        <div
            className="relative flex cursor-pointer items-center gap-2"
            onClick={() => setDropdownOpen((prev) => !prev)}
        >
            <div className="flex flex-col items-end">
                <h4 className="text-xs text-white">{userFullName}</h4>
                <p className="text-[10px] text-accent-orange">
                    {user.role.toUpperCase()}
                </p>
            </div>
            <img
                src={
                    user.profile_picture || "/images/admin-profile-picture.jpg"
                }
                alt={userFullName + " profile picture"}
                height={45}
                width={45}
                className={`overflow-hidden rounded-full border-2 object-cover ${user.role !== "secretary" ? "border-accent-orange" : "border-white"}`}
            />

            <div
                className={`absolute bottom-0 right-0 z-10 flex w-40 flex-col divide-y divide-accent-200 overflow-hidden rounded-md bg-white text-xs shadow-md duration-200 ${dropdownOpen ? "translate-y-[calc(100%+.5rem)]" : "invisible translate-y-[calc(100%+.8rem)] opacity-0"} `}
            >
                {dropdownLinks.map((link, i) => (
                    <Link
                        key={i}
                        href={link.href}
                        className="p-3 duration-200 hover:bg-accent-300"
                    >
                        {link.text}
                    </Link>
                ))}

                {["admin", "doctor", "secretary"]
                    .filter((role) => role !== user.role)
                    .map((role) => (
                        <button
                            key={role}
                            className="p-3 text-left duration-200 hover:bg-accent-300"
                            onClick={() =>
                                setUser((prev) => ({
                                    ...prev,
                                    role,
                                }))
                            }
                        >
                            Switch to {role}
                        </button>
                    ))}
            </div>
        </div>
    );
}

UserDropdown.propTypes = {
    user: userPropType,
    setUser: PropTypes.func,
};
