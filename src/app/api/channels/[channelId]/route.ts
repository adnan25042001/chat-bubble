import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export const DELETE = async (
    req: Request,
    { params }: { params: { channelId: string } }
) => {
    try {
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId");

        if (!serverId)
            return new NextResponse("Server ID missing", { status: 400 });

        if (!params.channelId)
            return new NextResponse("Channel ID missing", { status: 400 });

        const profile = await currentProfile();

        if (!profile) return new NextResponse("unauthorized", { status: 401 });

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR],
                        },
                    },
                },
            },
            data: {
                channels: {
                    delete: {
                        id: params.channelId,
                        name: {
                            not: "general",
                        },
                    },
                },
            },
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log("CHANNEL_ID_DELETE", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};
