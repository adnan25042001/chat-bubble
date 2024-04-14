import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface ChannelIdPageProps {
    params: {
        serverId: string;
        channelId: string;
    };
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
    const { serverId, channelId } = params;

    const profile = await currentProfile();

    if (!profile) return redirectToSignIn();

    const channel = await db.channel.findUnique({
        where: {
            id: params.channelId,
        },
    });

    const member = await db.member.findFirst({
        where: {
            serverId: params.serverId,
            profileId: profile.id,
        },
    });

    if (!channel || !member) redirect("/");

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader
                serverId={channel.serverId}
                name={channel.name}
                type="channel"
                channelType={channel.type}
            />

            <div className="flex-1">Future Messages</div>

            <ChatInput
                apiUrl="/api/socket/messages"
                name={channel.name}
                type="channel"
                query={{
                    channelId: channel.id,
                    serverId: channel.serverId,
                }}
            />
        </div>
    );
};

export default ChannelIdPage;
