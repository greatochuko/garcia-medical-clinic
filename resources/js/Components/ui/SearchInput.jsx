import React, { useEffect, useState } from "react";
import Input from "../layout/Input";

export default function SearchInput({
    value = "",
    onChange,
    onSelect,
    options = [],
    className = "",
    containerClassName = "",
    dropdownClassName = "",
    position = "top", // default top
    ...props
}) {
    const [suggestions, setSuggestions] = useState([]);
    const [activeIndex, setActiveIndex] = useState(-1);

    const handleChange = (e) => {
        const inputValue = e.target.value;
        onChange(inputValue);

        if (inputValue.length > 0) {
            const filtered = options.filter((opt) =>
                (opt.label ?? opt)
                    .toLowerCase()
                    .includes(inputValue.toLowerCase()),
            );
            setSuggestions(filtered);
            setActiveIndex(-1);
        } else {
            setSuggestions([]);
            setActiveIndex(-1);
        }
    };

    const handleSelect = (value) => {
        onSelect?.(value);
        setSuggestions([]);
        setActiveIndex(-1);
    };

    const handleKeyDown = (e) => {
        if (suggestions.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((prev) => (prev + 1) % suggestions.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex(
                (prev) => (prev - 1 + suggestions.length) % suggestions.length,
            );
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (activeIndex >= 0) handleSelect(suggestions[activeIndex].value);
        }
    };

    useEffect(() => {
        if (activeIndex >= 0) {
            const items = document.querySelectorAll(".search-suggestion-item");
            if (items[activeIndex]) {
                items[activeIndex].scrollIntoView({
                    block: "nearest",
                    inline: "nearest",
                });
            }
        }
    }, [activeIndex]);

    return (
        <div
            onBlur={() => setSuggestions([])}
            className={"relative flex " + containerClassName}
        >
            <Input
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className={"w-0 flex-1 " + className}
                {...props}
            />
            {suggestions.length > 0 && (
                <ul
                    tabIndex={1}
                    className={`absolute left-0 right-0 z-10 max-h-36 overflow-y-auto rounded-lg border bg-white shadow ${position === "top" ? "bottom-full mb-1" : "top-full mt-1"} ${dropdownClassName}`}
                >
                    {suggestions.map((item, idx) => (
                        <li
                            key={idx}
                            onMouseDown={() => handleSelect(item.value)}
                            className={`search-suggestion-item cursor-pointer px-4 py-2 text-left ${
                                idx === activeIndex
                                    ? "bg-gray-200"
                                    : "hover:bg-gray-100"
                            }`}
                        >
                            {item.label ?? item}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
