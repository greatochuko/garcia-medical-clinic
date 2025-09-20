import React, { useState } from "react";
import { navLinks } from "./Header";
import { Link } from "@inertiajs/react";

export default function MobileNavButton() {
    const [isOpen, setIsOpen] = useState(false);

    const pathname = window.location.pathname;

    function linkIsActive(linkHref) {
        if (linkHref === "/" && pathname === "/dashboard") return true;
        return pathname === linkHref;
    }

    return (
        <>
            <button className="p-1 sm:hidden" onClick={() => setIsOpen(true)}>
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    width={28}
                    height={28}
                >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                        <path
                            d="M4 6H20M4 12H20M4 18H20"
                            stroke="#fff"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        ></path>
                    </g>
                </svg>
            </button>

            <div
                className={`fixed left-0 top-0 z-20 h-screen w-full bg-black/60 backdrop-blur duration-200 sm:hidden ${isOpen ? "" : "invisible opacity-0"}`}
                onClick={() => setIsOpen(false)}
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                    className={`absolute right-0 top-0 flex h-full w-1/2 min-w-fit flex-col gap-4 bg-white p-4 duration-200 ${isOpen ? "" : "translate-x-full"}`}
                >
                    <img src="/assets/logo/logo.svg" alt="Logo" />

                    <ul className="flex flex-col gap-2">
                        {navLinks.map((navLink) => (
                            <li key={navLink.href}>
                                <Link
                                    href={navLink.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-2 rounded-md p-2 text-sm duration-200 xl:px-4 ${linkIsActive(navLink.href) ? "bg-accent text-white" : "text-accent hover:bg-white/10"}`}
                                >
                                    <img
                                        src={
                                            linkIsActive(navLink.href)
                                                ? navLink.icon
                                                : navLink.activeIcon
                                        }
                                        alt={navLink.text + " icon"}
                                        className="h-5 w-5 xl:h-4 xl:w-4"
                                    />
                                    {navLink.text}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <button
                        className="mt-auto flex items-center justify-center gap-2 rounded-md border border-accent bg-accent-200 p-2 text-sm text-accent duration-200 hover:bg-accent-300"
                        onClick={() => setIsOpen(false)}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            width={20}
                            height={20}
                        >
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g
                                id="SVGRepo_tracerCarrier"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM8.96963 8.96965C9.26252 8.67676 9.73739 8.67676 10.0303 8.96965L12 10.9393L13.9696 8.96967C14.2625 8.67678 14.7374 8.67678 15.0303 8.96967C15.3232 9.26256 15.3232 9.73744 15.0303 10.0303L13.0606 12L15.0303 13.9696C15.3232 14.2625 15.3232 14.7374 15.0303 15.0303C14.7374 15.3232 14.2625 15.3232 13.9696 15.0303L12 13.0607L10.0303 15.0303C9.73742 15.3232 9.26254 15.3232 8.96965 15.0303C8.67676 14.7374 8.67676 14.2625 8.96965 13.9697L10.9393 12L8.96963 10.0303C8.67673 9.73742 8.67673 9.26254 8.96963 8.96965Z"
                                    className="fill-accent"
                                ></path>
                            </g>
                        </svg>
                        Close
                    </button>
                </div>
            </div>
        </>
    );
}
