import React, { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { route } from "ziggy-js";
import axios from "axios";

export default function ReceiptMessage({ message, isSender }) {
    const [processing, setLoading] = useState(false);

    async function handleAcknoledge() {
        try {
            setLoading(true);
            await axios.patch(route("chat.acknowledge_receipt", message.id));
        } catch (error) {
            console.error(error?.response?.data?.error || error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            className={`flex w-[70%] flex-col divide-y divide-accent-200 rounded-xl ${isSender ? "divide-[#F5F5F540] self-end bg-gradient-to-br from-accent-500 to-accent text-white" : "divide-[#EDEDED] self-start bg-white text-accent"}`}
        >
            <p
                className={`p-2.5 py-1.5 text-[10px] ${isSender ? "" : "text-[#666666]"}`}
            >
                Acknowledgement Receipt
            </p>
            <div className="flex flex-col p-2.5 text-sm font-bold">
                <p>
                    {message.transaction.queue_type}
                    {message.transaction.queue_number} {" - "}
                    {message.transaction.patient_name}
                    {isSender ? "Is sender" : " not sender"}
                </p>
                <p className="text-xs">Total: {message.transaction.total}</p>
                <p className="text-xs">
                    Amount Paid: {message.transaction.amount_paid}
                </p>
                <p className="text-accent-orange">
                    Change:{" "}
                    {message.transaction.amount_paid -
                        message.transaction.total}
                </p>
                <button
                    disabled={processing || message.isAcknowledged || isSender}
                    onClick={handleAcknoledge}
                    className="flex w-fit items-center gap-1 self-end p-1 pb-0 text-xs underline disabled:pointer-events-none"
                >
                    {message.isAcknowledged ? (
                        <>
                            <img
                                src="/assets/icons/circle-check-icon.svg"
                                alt="circle check icon"
                                width={14}
                                height={14}
                            />
                            Acknowledged
                        </>
                    ) : (
                        <>
                            {processing && (
                                <Loader2Icon
                                    size={14}
                                    className="animate-spin"
                                />
                            )}
                            Acknowledge
                        </>
                    )}
                </button>
            </div>
            <p
                className={`p-2.5 py-1.5 text-[10px] italic ${isSender ? "" : "text-[#666666]"}`}
            >
                This message is automated.
            </p>
        </div>
    );
}
