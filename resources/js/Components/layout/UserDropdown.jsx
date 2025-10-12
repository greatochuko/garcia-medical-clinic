import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import PropTypes from "prop-types";
import useClickOutside from "@/hooks/useClickOutside";

const dropdownLinks = [
    { text: "Reports", href: "#" },
    { text: "Settings", href: "/settings" },
    { text: "Logout", href: "#" },
];

export default function UserDropdown({ user, setUser }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [dropdownRef] = useClickOutside(() => setDropdownOpen(false));

    const userFullName = user.first_name + " " + (user.last_name || "");

    return (
        <div
            ref={dropdownRef}
            className="relative flex cursor-pointer items-center gap-2"
            onClick={() => setDropdownOpen((prev) => !prev)}
        >
            <div className="hidden flex-col items-end sm:flex">
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
    user: PropTypes.shape({
        first_name: PropTypes.string,
        last_name: PropTypes.string,
        role: PropTypes.string,
        profile_picture: PropTypes.string,
    }).isRequired,
    setUser: PropTypes.func,
};
