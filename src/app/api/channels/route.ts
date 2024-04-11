import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    try {
        const { name, type } = await req.json();
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);

        const serverId = searchParams.get("serverId");

        if (!profile) return new NextResponse("Unauthorized", { status: 401 });

        if (!serverId)
            return new NextResponse("Server ID missing", { status: 400 });

        if (name === "general")
            return new NextResponse("name cannot be 'general'", {
                status: 400,
            });

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
                    create: {
                        profileId: profile.id,
                        name,
                        type,
                    },
                },
            },
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log("CHANNEL_POST", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
};
