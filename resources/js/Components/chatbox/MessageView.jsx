import { CircleXIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Input from "../layout/Input";
import { CheckCheckIcon } from "lucide-react";
import { ClockIcon } from "lucide-react";

export default function MessageView({
    user,
    setActiveChatId,
    messages,
    sendMessage,
    setMessages,
    authUser,
}) {
    const userFullName = `${user.first_name} ${user.middle_initial ? `${user.middle_initial.toUpperCase()}.` : ""} ${user.last_name}`;
    const [firstLoading, setFirstLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [data, setData] = useState({
        content: "",
        receiver_id: user.id,
        type: "text",
    });
    const messageAreaRef = useRef(null);

    useEffect(() => {
        if (messageAreaRef.current) {
            messageAreaRef.current.scrollTo({
                top: messageAreaRef.current.scrollHeight,
                behavior: firstLoading ? undefined : "smooth",
            });
        }
        if (firstLoading) {
            setFirstLoading(false);
        }
    }, [firstLoading, messages]);

    async function handleSendMessage(e) {
        e.preventDefault();

        setProcessing(true);
        const dummyMessage = {
            id: new Date().getTime(),
            sender_id: authUser.id,
            receiver_id: data.receiver_id,
            type: "text",
            content: data.content,
            transaction: null,
            created_at: new Date().toISOString(),
            notDelivered: true,
        };
        setMessages((prev) => [...prev, dummyMessage]);
        setData((prev) => ({ ...prev, content: "" }));
        setProcessing(false);

        await sendMessage(data, dummyMessage);
    }

    return (
        <>
            <div className="flex items-center justify-between bg-gradient-to-br from-accent-500 to-accent p-4 text-white">
                <div className="relative flex items-center gap-4">
                    <img
                        src={
                            user.avatar_url || "/images/placeholder-avatar.jpg"
                        }
                        alt="patient profile picture"
                        className={`h-10 w-10 rounded-full border-2 shadow-md sm:h-[58px] sm:w-[58px] ${user.role === "admin" ? "border-accent-orange" : user.role === "doctor" ? "border-[#429ABF]" : "border-[#D5B013]"}`}
                        width={58}
                        height={58}
                    />
                    <div className="flex flex-1 flex-col gap-1">
                        <h3 className="text-sm font-bold capitalize">
                            Clinic{" "}
                            {user.role === "doctor"
                                ? "MD"
                                : user.role === "admin"
                                  ? "Admin"
                                  : "Secretary"}
                        </h3>
                        <p className="flex items-center gap-1.5 text-[10px] text-[#E9F9FF]">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#27D01E]" />
                            <span className="flex-1">{userFullName}</span>
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setActiveChatId(null)}
                    className="rounded-full p-2 outline-none ring-[#089bab]/50 ring-offset-1 duration-200 hover:bg-white/10 focus-visible:ring"
                >
                    <CircleXIcon size={24} />
                </button>
            </div>
            <div className="flex flex-1 flex-col overflow-hidden bg-[#EFF7F8] p-2">
                <button
                    onClick={() => setActiveChatId(null)}
                    className="flex w-fit items-center gap-2 p-1 text-xs outline-none ring-[#089bab]/50 ring-offset-1 duration-200 hover:bg-accent-300 focus-visible:ring"
                >
                    <img
                        src="/assets/icons/back-icon.svg"
                        alt="back icon"
                        width={14}
                        height={14}
                    />
                    All Chat
                </button>
                <div
                    ref={messageAreaRef}
                    className="flex flex-1 flex-col gap-4 overflow-y-auto p-2"
                >
                    {messages.map((msg) =>
                        msg.type === "text" ? (
                            <div
                                key={msg.id}
                                className={`flex w-fit max-w-[70%] items-end gap-2 divide-accent-200 rounded-lg p-2 ${msg.sender_id === user.id ? "self-start bg-white text-accent" : "self-end bg-gradient-to-br from-accent-500 to-accent text-white"}`}
                            >
                                <p className="text-sm">{msg.content}</p>
                                <span className="text-white/50">
                                    {msg.notDelivered ? (
                                        <ClockIcon size={12} />
                                    ) : (
                                        <CheckCheckIcon size={12} />
                                    )}
                                </span>
                            </div>
                        ) : (
                            <div
                                key={msg.id}
                                className={`max-w-[60%] divide-y divide-accent-200 rounded-xl bg-gradient-to-br from-accent-500 to-accent p-2 text-white ${msg.sender_id === user.id ? "self-start" : "self-end"}`}
                            >
                                <p className="text-sm">{msg.content}</p>
                            </div>
                        ),
                    )}
                </div>
                <form onSubmit={handleSendMessage} className="flex gap-3 p-1">
                    <div className="relative flex flex-1">
                        <Input
                            disabled={processing}
                            type="text"
                            value={data.content}
                            onChange={(e) =>
                                setData((prev) => ({
                                    ...prev,
                                    content: e.target.value,
                                }))
                            }
                            placeholder="Type your message here"
                            className="w-0 flex-1 rounded-xl border-none bg-white p-4 pr-10 text-sm"
                        />
                        <img
                            src="/assets/icons/smily-face-icon.svg"
                            alt="Smily face icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex aspect-square h-[50px] w-[50px] items-center justify-center rounded-full bg-[#429ABF] outline-none ring-[#089bab]/50 ring-offset-1 duration-200 hover:opacity-90 focus-visible:ring disabled:opacity-50"
                    >
                        <img
                            src="/assets/icons/send-icon.svg"
                            alt="Send icon"
                            className=""
                            height={26}
                            width={26}
                        />
                    </button>
                </form>
            </div>
        </>
    );
}
