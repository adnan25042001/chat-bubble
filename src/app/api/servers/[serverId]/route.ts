import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const PATCH = async (
    req: Request,
    { params }: { params: { serverId: string } }
) => {
    try {
        const { name, imageUrl } = await req.json();

        const profile = await currentProfile();

        if (!profile) return new NextResponse("Unauthorized", { status: 401 });

        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: profile.id,
            },
            data: {
                name,
                imageUrl,
            },
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log("SERVER_ID_PATCH", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};
