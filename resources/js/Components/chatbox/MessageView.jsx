import { CircleXIcon } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Input from "../layout/Input";
import { v4 as uuidv4 } from "uuid";
import TextMessage from "./TextMessage";
import ReceiptMessage from "./ReceiptMessage";
import axios from "axios";
import { route } from "ziggy-js";
import { getUserFullName } from "@/utils/getUserFullname";

export default function MessageView({
    chatUser,
    setActiveChatId,
    messages,
    sendMessage,
    setMessages,
    authUser,
}) {
    const userFullName = getUserFullName(chatUser);
    const [firstLoading, setFirstLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        content: "",
        receiver_id: chatUser.id,
        type: "text",
    });
    const messageAreaRef = useRef(null);

    const markMessagesRead = useCallback(
        async (senderId) => {
            try {
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.sender_id === senderId &&
                        msg.receiver_id === authUser.id
                            ? { ...msg, is_read: true }
                            : msg,
                    ),
                );
                await axios.post(route("chat.mark_as_read"), {
                    sender_id: senderId,
                });
            } catch (error) {
                console.error(error?.response?.data || error.message);
            }
        },
        [authUser.id, setMessages],
    );

    useEffect(() => {
        if (messageAreaRef.current) {
            messageAreaRef.current.scrollTo({
                top: messageAreaRef.current.scrollHeight,
                behavior: firstLoading ? "instant" : "smooth",
            });
        }

        // Only mark as read once per unread batch
        const unreadMessages = messages.filter(
            (msg) => !msg.is_read && msg.sender_id === chatUser.id,
        );

        if (unreadMessages.length > 0) {
            // Prevent re-triggering while marking as read
            markMessagesRead(chatUser.id);
        }

        if (firstLoading) setFirstLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages.length, chatUser.id]);

    async function handleSendMessage(e) {
        e.preventDefault();

        setLoading(true);
        const messageTempId = uuidv4();
        const tempMessage = {
            id: new Date().getTime(),
            temp_id: messageTempId,
            sender_id: authUser.id,
            receiver_id: data.receiver_id,
            type: "text",
            content: data.content,
            transaction: null,
            created_at: new Date().toISOString(),
            notDelivered: true,
        };
        setMessages((prev) => [...prev, tempMessage]);
        setData((prev) => ({ ...prev, content: "" }));
        setLoading(false);

        await sendMessage({ ...data, temp_id: messageTempId }, tempMessage.id);
    }

    return (
        <>
            <div className="flex items-center justify-between bg-gradient-to-br from-accent-500 to-accent p-4 text-white">
                <div className="relative flex items-center gap-4">
                    <img
                        src={
                            chatUser.avatar_url ||
                            "/images/placeholder-avatar.jpg"
                        }
                        alt="patient profile picture"
                        className={`h-10 w-10 rounded-full border-2 shadow-md sm:h-[58px] sm:w-[58px] ${chatUser.role === "admin" ? "border-accent-orange" : chatUser.role === "doctor" ? "border-[#429ABF]" : "border-[#D5B013]"}`}
                        width={58}
                        height={58}
                    />
                    <div className="flex flex-1 flex-col gap-0.5">
                        <h3 className="text-sm font-bold capitalize">
                            Clinic{" "}
                            {chatUser.role === "doctor"
                                ? "MD"
                                : chatUser.role === "admin"
                                  ? "Admin"
                                  : "Secretary"}
                        </h3>
                        <p className="flex items-center gap-1.5 text-[12px] text-[#E9F9FF]">
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
                            <TextMessage
                                key={msg.id}
                                message={msg}
                                isSender={msg.sender_id === authUser.id}
                            />
                        ) : (
                            <ReceiptMessage
                                isSender={msg.sender_id === authUser.id}
                                message={msg}
                                key={msg.id}
                            />
                        ),
                    )}
                </div>
                <form onSubmit={handleSendMessage} className="flex gap-3 p-1">
                    <div className="relative flex flex-1">
                        <Input
                            disabled={loading}
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
                        disabled={loading}
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
