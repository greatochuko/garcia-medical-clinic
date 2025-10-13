import React from "react";
import { Link } from "@inertiajs/react";
import ApplicationLogo from "../ApplicationLogo";
import PropTypes from "prop-types";
import MobileNavButton from "./MobileNavButton";
import UserDropdown from "./UserDropdown";

const userPropType = PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    role: PropTypes.string,
    profile_picture: PropTypes.string,
}).isRequired;

export const navLinks = [
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

export default function Header({ user }) {
    const pathname = window.location.pathname;

    function linkIsActive(linkHref) {
        if (linkHref === "/") {
            return pathname === "/" || pathname === "/dashboard";
        } else {
            return pathname.startsWith(linkHref);
        }
    }

    return (
        <header className="relative mt-4 flex items-center justify-between bg-accent py-4 pr-4 sm:justify-normal sm:pr-8">
            <Link
                href="/dashboard"
                className="absolute top-1/2 flex h-[93px] -translate-y-1/2 items-center justify-center overflow-hidden rounded-r-3xl border-2 border-l-0 border-white bg-accent"
            >
                <ApplicationLogo />
            </Link>
            <div className="w-56" />
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
            <div className="flex items-center gap-3">
                <UserDropdown user={user} />
                <MobileNavButton />
            </div>
        </header>
    );
}

Header.propTypes = {
    user: userPropType,
    setUser: PropTypes.func,
};
