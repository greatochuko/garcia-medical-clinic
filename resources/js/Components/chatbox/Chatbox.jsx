import React, { useEffect, useState } from "react";
import { route } from "ziggy-js";
import MessageView from "./MessageView";
import ChatListView from "./ChatListView";
import useMessages from "@/hooks/useMessages";
import { usePage } from "@inertiajs/react";
import axios from "axios";

export default function Chatbox() {
    const { auth } = usePage().props;

    const [chatBoxOpen, setChatBoxOpen] = useState(false);
    const [chatList, setChatList] = useState([]);
    const [messages, setMessages] = useState([]);
    const [activeChatId, setActiveChatId] = useState(null);

    const activeChat = chatList.find((chat) => chat.id === activeChatId);

    useMessages((newMessage) => {
        if (newMessage.receiver_id === auth.user.id) {
            setMessages((prev) => [...prev, newMessage]);
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

    async function sendMessage(data, dummyMessage) {
        try {
            const resData = await axios.post(route("chat.create"), data);
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === dummyMessage.id ? resData.data.data : msg,
                ),
            );
        } catch (error) {
            console.error(error?.response?.data?.error || error.message);
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

    return (
        <>
            <div
                className={`fixed bottom-4 right-4 z-50 flex aspect-[0.7] w-72 -translate-x-16 flex-col overflow-hidden rounded-2xl shadow-md duration-200 sm:bottom-8 sm:right-8 sm:aspect-[0.8] sm:w-80 md:w-96 ${chatBoxOpen ? "" : "invisible scale-90 opacity-0"}`}
            >
                {activeChat ? (
                    <MessageView
                        key={activeChatId}
                        user={activeChat}
                        setActiveChatId={setActiveChatId}
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
                        setActiveChatId={setActiveChatId}
                    />
                )}
            </div>
            <button
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
