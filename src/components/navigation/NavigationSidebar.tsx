import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import NavigationAction from "./NavigationAction";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import NavigationItem from "./NavigationItem";
import ThemeToggle from "../ThemeToggle";
import { UserButton } from "@clerk/nextjs";

const NavigationSidebar = async () => {
    const profile = await currentProfile();

    if (!profile) return redirect("/");

    const servers = await db.server.findMany({
        where: {
            members: {
                some: {
                    profileId: profile.id,
                },
            },
        },
    });

    return (
        <div className="space-y-4 flex flex-col items-center h-full w-full text-primary bg-[#E3E5E8] dark:bg-[#1E1F22] py-3">
            <NavigationAction />

            <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />

            <ScrollArea className="flex-1 w-full">
                {servers.map((server) => (
                    <div key={server.id} className="mb-4">
                        <NavigationItem
                            id={server.id}
                            name={server.name}
                            imageUrl={server.imageUrl}
                        />
                    </div>
                ))}
            </ScrollArea>

            <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
                <ThemeToggle />
                <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                        elements: {
                            avatarBox: "h-12 w-12",
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default NavigationSidebar;
