import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessages from "@/components/chat/ChatMessages";
import MediaRoom from "@/components/MediaRoom";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface MemberIdPageProps {
    params: {
        memberId: string;
        serverId: string;
    };
    searchParams: {
        video?: boolean;
    };
}

const MemberIdPage = async ({ params, searchParams }: MemberIdPageProps) => {
    const profile = await currentProfile();

    if (!profile) return redirectToSignIn();

    const currentMember = await db.member.findFirst({
        where: {
            serverId: params.serverId,
            profileId: profile.id,
        },
        include: {
            profile: true,
        },
    });

    if (!currentMember) return redirect("/");

    const conversation = await getOrCreateConversation(
        currentMember.id,
        params.memberId
    );

    if (!conversation) return redirect(`/servers/${params.serverId}`);

    const { memberOne, memberTwo } = conversation;

    const otherMember =
        memberOne.profileId === profile.id ? memberTwo : memberOne;

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader
                serverId={params.serverId}
                name={otherMember.profile.name}
                imageUrl={otherMember.profile.imageUrl}
                type="conversation"
            />

            {!searchParams.video && (
                <>
                    <ChatMessages
                        member={currentMember}
                        name={otherMember.profile.name}
                        chatId={conversation.id}
                        type="conversation"
                        apiUrl="/api/direct-messages"
                        paramKey="conversationId"
                        paramValue={conversation.id}
                        socketUrl="/api/socket/direct-messages"
                        socketQuery={{
                            conversationId: conversation.id,
                        }}
                    />

                    <ChatInput
                        apiUrl="/api/socket/direct-messages"
                        name={otherMember.profile.name}
                        type="conversation"
                        query={{
                            conversationId: conversation.id,
                        }}
                    />
                </>
            )}

            {searchParams.video && (
                <MediaRoom audio={true} video={true} chatId={conversation.id} />
            )}
        </div>
    );
};

export default MemberIdPage;
