import { Minimize2Icon } from "lucide-react";
import React from "react";

export default function ChatListView({
    chatList,
    toggleChatBox,
    setActiveChatId,
    authUser,
    messages,
}) {
    return (
        <>
            <div className="flex items-center justify-between bg-gradient-to-br from-accent-500 to-accent p-4 text-white">
                <div className="relative flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md sm:h-[58px] sm:w-[58px]">
                        <img
                            src="/assets/icons/duo-message-icon.svg"
                            alt="message icon"
                            className="h-6 w-6 sm:h-8 sm:w-8"
                        />
                    </div>
                    <div className="flex flex-1 flex-col gap-1">
                        <h3 className="text-sm font-bold capitalize">
                            Messages
                        </h3>
                        <p className="flex items-center gap-1.5 text-[10px] text-[#E9F9FF]">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#27D01E]" />
                            <span className="flex-1">
                                GARCIA MEDICAL CLINIC ACCOUNTS
                            </span>
                        </p>
                    </div>
                </div>
                <button
                    onClick={toggleChatBox}
                    className="rounded-full p-2 duration-200 hover:bg-white/10"
                >
                    <Minimize2Icon size={24} />
                </button>
            </div>
            <div className="flex-1 overflow-hidden bg-[#EFF7F8] p-1">
                <ul className="flex h-full flex-col gap-3 overflow-y-auto p-2">
                    {chatList.map((user) => (
                        <ChatListItem
                            chatUser={user}
                            key={user.id}
                            setActiveChatId={setActiveChatId}
                            chatMessages={messages.filter(
                                (msg) =>
                                    msg.receiver_id === user.id ||
                                    msg.sender_id === user.id,
                            )}
                            authUser={authUser}
                        />
                    ))}
                </ul>
            </div>
        </>
    );
}

function ChatListItem({ chatUser, setActiveChatId, chatMessages, authUser }) {
    const unreadMessages = chatMessages.filter(
        (msg) => msg.sender_id !== authUser.id && !msg.is_read,
    );

    return (
        <li
            onClick={() => setActiveChatId(chatUser.id)}
            className="relative cursor-pointer rounded-xl bg-[#C2C2C226] p-2 pr-6 duration-200 hover:bg-accent-300"
        >
            <div className="relative flex items-center gap-4">
                <img
                    src={
                        chatUser.avatar_url || "/images/placeholder-avatar.jpg"
                    }
                    alt="patient profile picture"
                    className={`h-4 w-4 rounded-full border-2 shadow-md sm:h-8 sm:w-8 ${chatUser.role === "admin" ? "border-accent-orange" : chatUser.role === "doctor" ? "border-[#429ABF]" : "border-[#D5B013]"}`}
                />
                <div className="flex flex-1 flex-col gap-1 text-accent">
                    <h3 className="text-xs font-bold capitalize">
                        {chatUser.first_name}{" "}
                        {chatUser.middle_initial
                            ? `${chatUser.middle_initial}.`
                            : ""}{" "}
                        {chatUser.last_name}
                    </h3>
                    <p className="flex items-center gap-1.5 text-[10px] italic">
                        <span className="h-[5px] w-[5px] rounded-full bg-[#27D01E]" />
                        <span className="flex-1">online now</span>
                    </p>
                </div>
                <p
                    className={`text-[10px] font-medium uppercase ${chatUser.role === "admin" ? "text-accent-orange" : chatUser.role === "doctor" ? "text-[#429ABF]" : "text-[#D5B013]"}`}
                >
                    {chatUser.role}
                </p>
            </div>
            {unreadMessages.length > 0 && (
                <span className="absolute right-0 top-0 flex h-[22px] w-[22px] -translate-y-1 translate-x-1 items-center justify-center rounded-full bg-accent-orange text-xs text-white">
                    {unreadMessages.length}
                </span>
            )}
        </li>
    );
}
