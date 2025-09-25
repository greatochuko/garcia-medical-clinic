import React from "react";
import { twMerge } from "tailwind-merge";

export default function Input({
    type = "text",
    value,
    onChange,
    className = "",
    placeholder = "",
    name = "",
    id = "",
    disabled = false,

    ...props
}) {
    return (
        <input
            type={type}
            name={name}
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={twMerge(
                "rounded-md border-accent-400 bg-accent-200 p-2 px-4 text-sm outline-none outline-0 duration-200 focus:border-accent-500 focus:ring-2 focus:ring-[#089bab]/50 disabled:cursor-not-allowed disabled:bg-[#E4E4E4]",
                className,
            )}
            {...props}
        />
    );
}
