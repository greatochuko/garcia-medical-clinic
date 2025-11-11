import React from "react";

export default function StaffList({ users }) {
    return (
        <div className="flex-1 divide-y-2 divide-accent-200 rounded-md bg-white shadow shadow-black/25">
            <h3 className="p-4 text-center text-sm font-bold">
                LIST OF STAFFS
            </h3>

            <ul className="flex max-h-72 flex-col gap-4 overflow-y-auto p-4">
                {users.map((user) => (
                    <li key={user.id} className="flex items-center gap-4">
                        <img
                            src={
                                user.avatar_url ||
                                "/images/placeholder-avatar.jpg"
                            }
                            alt={user.first_name + " profile picture"}
                            width={32}
                            height={32}
                            className="rounded-full border-2"
                        />
                        <div className="text-sm">
                            <h5 className="font-bold">
                                {user.first_name}{" "}
                                {user.middle_initial
                                    ? `${user.middle_initial.toUpperCase()}. `
                                    : ""}
                                {user.last_name}
                            </h5>
                            <p className="uppercase">
                                {user.role === "doctor"
                                    ? "GENERAL MEDICINE"
                                    : user.role === "admin"
                                      ? "CLINIC ADMIN"
                                      : "CLINIC SECRETARY"}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
