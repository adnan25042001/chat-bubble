import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { ChannelType } from "@prisma/client";
import { channel } from "diagnostics_channel";
import { redirect } from "next/navigation";
import ServerHeader from "./ServerHeader";

interface ServerSidebarProps {
    serverId: string;
}

const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
    const profile = await currentProfile();

    if (!profile) return redirect("/");

    const server = await db.server.findUnique({
        where: {
            id: serverId,
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: "asc",
                },
            },
            members: {
                include: {
                    profile: true,
                },
                orderBy: {
                    role: "asc",
                },
            },
        },
    });

    if (!server) return redirect("/");

    const textChannels = server.channels.filter(
        (channel) => channel.type === ChannelType.TEXT
    );

    const AudioChannels = server.channels.filter(
        (channel) => channel.type === ChannelType.AUDIO
    );

    const VideoChannels = server.channels.filter(
        (channel) => channel.type === ChannelType.VIDEO
    );

    const members = server.members.filter(
        (member) => member.profileId !== profile.id
    );

    const role = server.members.find(
        (member) => member.profileId === profile.id
    )?.role;

    return (
        <div className="flex flex-col h-full w-full text-primary bg-[#F2F3f5] dark:bg-[#2B2D31]">
            <ServerHeader server={server} role={role} />
        </div>
    );
};

export default ServerSidebar;
