import React from "react";

export default function ToggleSwitch({ checked, onChange, label }) {
    return (
        <div className="flex items-center gap-2">
            {label && <span className="text-sm font-medium">{label}</span>}
            <button
                onClick={() => onChange(!checked)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    checked ? "bg-[#429ABF]" : "bg-gray-300"
                }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        checked ? "translate-x-6" : "translate-x-1"
                    }`}
                />
            </button>
        </div>
    );
}
