import React from "react";
import { Link } from "@inertiajs/react";

const sideNav = [
    {
        label: "Medication",
        href: "medication",
        icon: "pill-icon.svg",
        activeIcon: "pill-icon-active.svg",
    },
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
        label: "Physical Exam",
        href: "physical-exam",
        icon: "physical-exam-icon.png",
        activeIcon: "physical-exam-icon-active.png",
    },
    {
        label: "Users",
        href: "accounts",
        icon: "folder-admin-icon.svg",
        activeIcon: "folder-admin-icon-active.svg",
    },
];

export default function SettingsSidebar({ userRole }) {
    const pathname = window.location.pathname;

    function linkIsActive(href) {
        return (
            pathname.includes(href) ||
            (pathname === "/settings" && href === "medication")
        );
    }

    return (
        <div className="bg-[#082D3C] p-2 pt-10">
            <div className="sticky top-6 flex flex-col gap-6">
                {sideNav.map((nav) => (
                    <Link
                        key={nav.href}
                        href={`/settings/${nav.href}`}
                        className={`flex-col items-center justify-center gap-2 rounded-lg p-2 text-xs duration-200 ${linkIsActive(nav.href) ? "bg-white text-[#082D3C]" : "text-white hover:bg-white/10"} ${nav.href === "accounts" && userRole !== "admin" ? "hidden" : "flex"}`}
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
        </div>
    );
}
