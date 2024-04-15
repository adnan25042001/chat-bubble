"use client";

import { Member } from "@prisma/client";

interface ChatMessagesProps {
    name: string;
    member: Member;
    chatId: string;
    apiUrl: string;
    socketUrl: string;
    socketQuery: Record<string, string>;
    paramKey: "channelId" | "conversationId";
    paramvalue: string;
    type: "channel" | "conversation";
}

const ChatMessages = ({
    name,
    member,
    chatId,
    apiUrl,
    socketUrl,
    socketQuery,
    paramKey,
    paramvalue,
    type,
}: ChatMessagesProps) => {
    return <div>ChatMessages</div>;
};

export default ChatMessages;
