import { ChannelType } from "@prisma/client";
import { Hash, Menu, Mic, Video } from "lucide-react";
import MobileToggle from "../MobileToggle";
import UserAvatar from "../UserAvatar";
import SocketIndicator from "../SocketIndicator";

interface ChatHeaderProps {
    serverId: string;
    name: string;
    type: "channel" | "conversation";
    channelType?: ChannelType;
    imageUrl?: string;
}

const channelIconMap = {
    [ChannelType.TEXT]: (
        <Hash className="h-5 w-5 text-zinc-500 dark:text-zinc-400 mr-2" />
    ),
    [ChannelType.AUDIO]: (
        <Mic className="h-5 w-5 text-zinc-500 dark:text-zinc-400 mr-2" />
    ),
    [ChannelType.VIDEO]: (
        <Video className="h-5 w-5 text-zinc-500 dark:text-zinc-400 mr-2" />
    ),
};

const ChatHeader = ({
    serverId,
    name,
    type,
    channelType,
    imageUrl,
}: ChatHeaderProps) => {
    const channelIcon = channelIconMap[channelType || ChannelType.TEXT];

    return (
        <div className="text-md font-semibold px-3 flex items-center h-12 border-b-2 border-neutral-200 dark:border-neutral-800">
            <MobileToggle serverId={serverId} />

            {type === "channel" && channelIcon}

            {type === "conversation" && (
                <UserAvatar
                    src={imageUrl}
                    className="h-8 w-8 md:h-8 md:w-8 mr-2"
                />
            )}

            <p className="font-semibold text-md text-black dark:text-white">
                {name}
            </p>

            <div className="ml-auto flex items-center">
                <SocketIndicator />
            </div>
        </div>
    );
};

export default ChatHeader;
