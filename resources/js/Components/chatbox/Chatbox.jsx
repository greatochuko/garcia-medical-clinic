import React, { useEffect, useRef, useState } from "react";
import { route } from "ziggy-js";
import MessageView from "./MessageView";
import ChatListView from "./ChatListView";
import useMessages from "@/hooks/useMessages";
import { usePage } from "@inertiajs/react";
import axios from "axios";
import useClickOutside from "@/hooks/useClickOutside";

export default function Chatbox() {
    const { auth } = usePage().props;

    const [chatBoxOpen, setChatBoxOpen] = useState(false);
    const [chatList, setChatList] = useState([]);
    const [messages, setMessages] = useState([]);
    const [activeChatId, setActiveChatId] = useState(null);
    const buttonRef = useRef(null);

    const activeChat = chatList.find((chat) => chat.id === activeChatId);

    const [chatBoxRef] = useClickOutside(() => {
        setChatBoxOpen(false);
        setTimeout(() => {
            setActiveChatId(null);
        }, 300);
    }, buttonRef);

    useMessages((newMessage) => {
        if (
            newMessage.receiver_id === auth.user.id ||
            newMessage.sender_id === auth.user.id
        ) {
            setMessages((prev) => {
                // Update by ID (for acknowledgment or re-broadcast)
                if (prev.some((msg) => msg.id === newMessage.id)) {
                    return prev.map((msg) =>
                        msg.id === newMessage.id ? newMessage : msg,
                    );
                }

                // Replace temp message
                if (
                    prev.some(
                        (msg) =>
                            msg.temp_id && msg.temp_id === newMessage.temp_id,
                    )
                ) {
                    return prev.map((msg) =>
                        msg.temp_id === newMessage.temp_id ? newMessage : msg,
                    );
                }

                // Add new message
                return [...prev, newMessage];
            });
        }
    });

    useEffect(() => {
        async function getChatList() {
            try {
                const res = await fetch(route("chat.index"));
                const data = await res.json();
                setChatList(data.users);
                setMessages(data.messages);
            } catch (error) {
                console.error(error.message);
            }
        }

        getChatList();
    }, []);

    useEffect(() => {
        if (!messages.length) return;

        setChatList((prevChatList) => {
            const usersWithLatest = prevChatList.map((user) => {
                const userMessages = messages.filter(
                    (msg) =>
                        msg.sender_id === user.id ||
                        msg.receiver_id === user.id,
                );

                const latestMessage =
                    userMessages.sort(
                        (a, b) =>
                            new Date(b.created_at) - new Date(a.created_at),
                    )[0] || null;

                return { ...user, latest_message: latestMessage };
            });

            return usersWithLatest.sort((a, b) => {
                const aTime = a.latest_message
                    ? new Date(a.latest_message.created_at)
                    : 0;
                const bTime = b.latest_message
                    ? new Date(b.latest_message.created_at)
                    : 0;
                return bTime - aTime;
            });
        });
    }, [messages]);

    async function sendMessage(data, tempMessageId) {
        try {
            await axios.post(route("chat.create"), data);
        } catch (error) {
            console.error(error?.response?.data?.error || error.message);
            setMessages((prev) =>
                prev.filter((msg) => msg.id !== tempMessageId),
            );
        }
    }

    function toggleChatBox() {
        if (chatBoxOpen) {
            setChatBoxOpen(false);
            setTimeout(() => {
                setActiveChatId(null);
            }, 300);
        } else {
            setChatBoxOpen(true);
        }
    }

    async function markMessagesRead(senderId) {
        try {
            await axios.post(route("chat.mark_as_read"), {
                sender_id: senderId,
            });
        } catch (error) {
            console.error(error.response?.data || error.message);
        }
    }

    function selectActiveChat(id) {
        setActiveChatId(id);
        const unreadMessages = messages.filter(
            (msg) => msg.sender_id === id && !msg.is_read,
        );

        if (unreadMessages.length) {
            markMessagesRead(id);
        }
    }

    return (
        <>
            <div
                ref={chatBoxRef}
                className={`fixed bottom-4 right-4 z-50 flex aspect-[0.7] w-72 -translate-x-16 flex-col overflow-hidden rounded-2xl shadow-md duration-200 sm:bottom-8 sm:right-8 sm:aspect-[0.8] sm:w-80 md:w-96 ${chatBoxOpen ? "" : "invisible scale-90 opacity-0"}`}
            >
                {activeChat ? (
                    <MessageView
                        key={activeChatId}
                        user={activeChat}
                        setActiveChatId={selectActiveChat}
                        sendMessage={sendMessage}
                        messages={messages.filter(
                            (msg) =>
                                msg.receiver_id === activeChatId ||
                                msg.sender_id === activeChatId,
                        )}
                        setMessages={setMessages}
                        authUser={auth.user}
                    />
                ) : (
                    <ChatListView
                        chatList={chatList}
                        toggleChatBox={toggleChatBox}
                        setActiveChatId={selectActiveChat}
                        activeChatId={activeChatId}
                        authUser={auth.user}
                        messages={messages}
                    />
                )}
            </div>
            <button
                ref={buttonRef}
                onClick={toggleChatBox}
                className="fixed bottom-4 right-4 z-50 rounded-full border-2 border-white bg-gradient-to-br from-accent-500 to-accent p-3 text-white shadow-md shadow-black/50 duration-300 ease-in-out hover:scale-110 sm:bottom-8 sm:right-8"
            >
                <img
                    src="/assets/icons/duo-message-icon-light.svg"
                    alt="Messages icon"
                    width={20}
                    height={20}
                />
            </button>
        </>
    );
}
