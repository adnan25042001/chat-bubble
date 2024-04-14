"use client";

import { ChannelType, MemberRole } from "@prisma/client";
import { ServerWithMembersWithProfiles } from "@/types";
import ActionTootip from "../ActionTootip";
import { Plus, Settings } from "lucide-react";
import { useModalStore } from "@/hooks/useModalStore";

interface ServerSectionProps {
    label: String;
    role?: MemberRole;
    sectionType: "channels" | "members";
    channelType?: ChannelType;
    server?: ServerWithMembersWithProfiles;
}

const ServerSection = ({
    label,
    role,
    sectionType,
    channelType,
    server,
}: ServerSectionProps) => {
    const { onOpen } = useModalStore();

    return (
        <div className="flex items-center justify-between py-2">
            <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
                {label}
            </p>
            {role !== MemberRole.GUEST && sectionType === "channels" && (
                <ActionTootip label="Create Channel" side="top">
                    <button
                        onClick={() => onOpen("createChannel", { channelType })}
                        className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                </ActionTootip>
            )}

            {role === MemberRole.ADMIN && sectionType === "members" && (
                <ActionTootip label="Manage Members" side="top">
                    <button
                        onClick={() => onOpen("members", { server })}
                        className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                    >
                        <Settings className="h-4 w-4" />
                    </button>
                </ActionTootip>
            )}
        </div>
    );
};

export default ServerSection;
