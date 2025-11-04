import React, {
    useEffect,
    useRef,
    useState,
    useMemo,
    useCallback,
} from "react";
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
    const [chatBoxRef] = useClickOutside(() => closeChatBox(), buttonRef);

    const activeChat = chatList.find((chat) => chat.id === activeChatId);

    const closeChatBox = useCallback(() => {
        setChatBoxOpen(false);
        setTimeout(() => {
            setActiveChatId(null);
        }, 300);
    }, []);

    const toggleChatBox = useCallback(() => {
        chatBoxOpen ? closeChatBox() : setChatBoxOpen(true);
    }, [chatBoxOpen, closeChatBox]);

    useMessages(
        (newMessage) => {
            if (
                newMessage.receiver_id === auth.user.id ||
                newMessage.sender_id === auth.user.id
            ) {
                setMessages((prev) => {
                    // Update by ID
                    if (prev.some((msg) => msg.id === newMessage.id)) {
                        return prev.map((msg) =>
                            msg.id === newMessage.id ? newMessage : msg,
                        );
                    }
                    // Replace temp message
                    if (
                        prev.some((msg) => msg.temp_id === newMessage.temp_id)
                    ) {
                        return prev.map((msg) =>
                            msg.temp_id === newMessage.temp_id
                                ? newMessage
                                : msg,
                        );
                    }
                    // Add new message
                    return [...prev, newMessage];
                });
            }
        },
        (readEvent) => {
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.sender_id === readEvent.sender_id &&
                    msg.receiver_id === readEvent.receiver_id
                        ? { ...msg, is_read: true }
                        : msg,
                ),
            );
        },
    );

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

    const sendMessage = useCallback(async (data, tempMessageId) => {
        try {
            await axios.post(route("chat.create"), data);
        } catch (error) {
            console.error(
                error?.response?.data?.error ||
                    error.message ||
                    "Unknown error",
            );
            setMessages((prev) =>
                prev.filter((msg) => msg.id !== tempMessageId),
            );
        }
    }, []);

    const selectActiveChat = useCallback((id) => {
        setActiveChatId(id);
    }, []);

    const uniqueUnreadMessages = useMemo(() => {
        const seenSenders = new Set();
        return messages.filter((msg) => {
            if (
                msg.sender_id !== auth.user.id &&
                !msg.is_read &&
                !seenSenders.has(msg.sender_id)
            ) {
                seenSenders.add(msg.sender_id);
                return true;
            }
            return false;
        });
    }, [messages, auth.user.id]);

    return (
        <>
            <div
                ref={chatBoxRef}
                className={`fixed bottom-4 right-4 z-50 flex aspect-[0.7] w-72 -translate-x-16 flex-col overflow-hidden rounded-2xl shadow-md duration-200 sm:bottom-8 sm:right-8 sm:aspect-[0.8] sm:w-80 md:w-96 ${
                    chatBoxOpen ? "" : "invisible scale-90 opacity-0"
                }`}
            >
                {activeChat ? (
                    <MessageView
                        key={activeChatId}
                        chatUser={activeChat}
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
                aria-label="Open chat"
                className="fixed bottom-4 right-4 z-50 rounded-full border-[2.5px] border-white bg-gradient-to-br from-accent-500 to-accent p-3 text-white shadow-md shadow-black/50 duration-300 ease-in-out hover:scale-110 sm:bottom-8 sm:right-8"
            >
                <img
                    src="/assets/icons/duo-message-icon-light.svg"
                    alt="Messages icon"
                    width={20}
                    height={20}
                />
                {uniqueUnreadMessages.length > 0 && (
                    <div className="absolute right-0 top-0 flex h-6 w-6 -translate-y-1.5 translate-x-1.5 items-center justify-center rounded-full bg-accent-orange">
                        {uniqueUnreadMessages.length}
                    </div>
                )}
            </button>
        </>
    );
}
