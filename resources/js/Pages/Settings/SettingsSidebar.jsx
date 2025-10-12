import React from "react";
import { Link } from "@inertiajs/react";

const sideNav = [
    {
        label: "Services",
        href: "services",
        icon: "medical-services-icon.svg",
        activeIcon: "medical-services-icon-active.svg",
    },
    {
        label: "Frequency",
        href: "frequency",
        icon: "time-icon.svg",
        activeIcon: "time-icon-active.svg",
    },
    {
        label: "Plan",
        href: "plan",
        icon: "todo-list-icon.svg",
        activeIcon: "todo-list-icon-active.svg",
    },
    {
        label: "Users",
        href: "accounts",
        icon: "folder-admin-icon.svg",
        activeIcon: "folder-admin-icon-active.svg",
    },
];

export default function SettingsSidebar() {
    const pathname = window.location.pathname;

    function linkIsActive(href) {
        return (
            pathname.includes(href) ||
            (pathname === "/settings" && href === "services")
        );
    }

    return (
        <div className="flex h-full flex-col gap-6 bg-[#082D3C] p-2 pt-10">
            {sideNav.map((nav) => (
                <Link
                    key={nav.href}
                    href={`/settings/${nav.href}`}
                    className={`flex flex-col items-center justify-center gap-2 rounded-lg p-2 text-xs duration-200 ${linkIsActive(nav.href) ? "bg-white text-[#082D3C]" : "text-white hover:bg-white/10"}`}
                >
                    <img
                        width={24}
                        height={24}
                        className="h-4 w-4 object-cover sm:h-6 sm:w-6"
                        src={`/assets/icons/${linkIsActive(nav.href) ? nav.activeIcon : nav.icon}`}
                        alt={nav.label + " icon"}
                    />
                    {nav.label}
                </Link>
            ))}
        </div>
    );
}
