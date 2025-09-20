import { Link } from "@inertiajs/react";
import React from "react";

const footerLinks = [
    { text: "About Us", href: "#" },
    { text: "Release Notes", href: "#" },
    { text: "Privacy Policy", href: "#" },
    { text: "Terms of Use", href: "#" },
];

export default function Footer() {
    return (
        <div className="bg-accent-200 p-4 text-[#15475B70]">
            <div className="mx-auto flex w-[90%] max-w-screen-2xl flex-wrap items-center justify-center gap-6 gap-y-2 text-xs">
                <p>
                    Copyright {new Date().getFullYear()} &copy; Klinicare
                    Solutions
                </p>

                <ul className="flex flex-wrap items-center justify-center">
                    {footerLinks.map((link, i) => (
                        <li key={i}>
                            <Link
                                href={link.href}
                                className="block p-3 hover:underline"
                            >
                                {link.text}
                            </Link>
                        </li>
                    ))}
                </ul>
                <Link
                    href={"https://www.klinicaresolutions.com/help"}
                    className="flex items-center gap-2 py-2 hover:underline xl:ml-auto"
                >
                    <img
                        src="/assets/icons/help-desk-icon.svg"
                        alt="Help Desk Icon"
                        height={20}
                        width={20}
                    />
                    Help Desk - www.klinicaresolutions.com/help
                </Link>
            </div>
        </div>
    );
}
