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
            <div className="max-w-8xl mx-auto flex w-[90%] flex-wrap items-center gap-6 text-xs">
                <p>
                    Copyright {new Date().getFullYear()} &copy; Klinicare
                    Solutions
                </p>

                <ul className="flex">
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
                    className="ml-auto block py-2 hover:underline"
                >
                    Help Desk - www.klinicaresolutions.com/help
                </Link>
            </div>
        </div>
    );
}
