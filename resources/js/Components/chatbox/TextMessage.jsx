import React from "react";
import { CheckCheckIcon, CheckIcon, ClockIcon } from "lucide-react";

export default function TextMessage({ message, isSender }) {
    return (
        <div
            className={`flex w-fit max-w-[70%] items-end gap-2 divide-accent-200 rounded-xl p-2 ${isSender ? "self-end bg-gradient-to-br from-accent-500 to-accent text-white" : "self-start bg-white text-accent"}`}
        >
            <p className="text-sm">{message.content}</p>
            {isSender && (
                <span className="text-white/50">
                    {message.notDelivered ? (
                        <ClockIcon size={12} />
                    ) : message.is_read ? (
                        <CheckCheckIcon size={12} />
                    ) : (
                        <CheckIcon size={12} />
                    )}
                </span>
            )}
        </div>
    );
}
