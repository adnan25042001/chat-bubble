"use client";

import { cn } from "@/lib/utils";
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ModalType, useModalStore } from "@/hooks/useModalStore";
import ActionTooltip from "../ActionTooltip";

interface ServerChannelProps {
    channel: Channel;
    server: Server;
    role?: MemberRole;
}

const iconMap = {
    [ChannelType.TEXT]: Hash,
    [ChannelType.AUDIO]: Mic,
    [ChannelType.VIDEO]: Video,
};

const ServerChannel = ({ channel, server, role }: ServerChannelProps) => {
    const { onOpen } = useModalStore();
    const params = useParams();
    const router = useRouter();

    const Icon = iconMap[channel.type];

    const onAction = (e: React.MouseEvent, action: ModalType) => {
        e.stopPropagation();
        onOpen(action, { channel, server });
    };

    return (
        <button
            onClick={() => {
                router.push(
                    `/servers/${params?.serverId}/channels/${channel.id}`
                );
            }}
            className={cn(
                "group p-2 rounded-md flex items-center gap-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
                params?.channelId === channel.id &&
                    "bg-zinc-700/20 dark:bg-zinc-700"
            )}
        >
            <Icon className="flex-shrink-0 h-5 w-5 text-zinc-500 dark:text-zinc-400" />

            <p
                className={cn(
                    "line-clamp-1 fonr-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 text-left",
                    params?.channelId === channel.id &&
                        "text-primary dark:text-zinc-200 dark:group-hover:text-white"
                )}
            >
                {channel.name}
            </p>

            {channel.name !== "general" && role !== MemberRole.GUEST && (
                <div className="ml-auto flex items-center gap-2">
                    <ActionTooltip label="Edit">
                        <Edit
                            onClick={(e) => {
                                onAction(e, "editChannel");
                            }}
                            className="h-4 w-4 hidden group-hover:block text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
                        />
                    </ActionTooltip>

                    <ActionTooltip label="Delete">
                        <Trash
                            onClick={(e) => {
                                onAction(e, "deleteChannel");
                            }}
                            className="h-4 w-4 hidden group-hover:block text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
                        />
                    </ActionTooltip>
                </div>
            )}

            {channel.name === "general" && (
                <Lock className="h-4 w-4 ml-auto text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300" />
            )}
        </button>
    );
};

export default ServerChannel;
