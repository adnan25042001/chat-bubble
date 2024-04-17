"use client";

import * as z from "zod";
import { Member, MemberRole, Profile } from "@prisma/client";
import UserAvatar from "../UserAvatar";
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import ActionTooltip from "../ActionTooltip";
import axios from "axios";
import qs from "query-string";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useModalStore } from "@/hooks/useModalStore";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

interface ChatItemProps {
    id: string;
    content: string;
    member: Member & {
        profile: Profile;
    };
    timestamp: string;
    fileUrl: string | null;
    deleted: boolean;
    currentMember: Member;
    isUpdated: boolean;
    socketUrl: string;
    socketQuery: Record<string, string>;
}

const roleIconMap = {
    GUEST: null,
    MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
    ADMIN: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
};

const formSchema = z.object({
    content: z.string().min(1),
});

const ChatItem = ({
    content,
    currentMember,
    deleted,
    fileUrl,
    id,
    isUpdated,
    member,
    socketQuery,
    socketUrl,
    timestamp,
}: ChatItemProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const { onOpen } = useModalStore();
    const params = useParams();
    const router = useRouter();

    const handleOnMemberClick = () => {
        if (member.id === currentMember.id) return;

        router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape" || event.keyCode === 27) {
                setIsEditing(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: content,
        },
    });

    useEffect(() => {
        form.reset({
            content: content,
        });
    }, [content]);

    const isLoading = form.formState.isSubmitting;

    const handleOnSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: `${socketUrl}/${id}`,
                query: socketQuery,
            });

            await axios.patch(url, values);

            form.reset();
            setIsEditing(false);
        } catch (error) {
            console.log(error);
        }
    };

    const fileType = fileUrl?.split(".").pop();

    const isAdmin = currentMember.role === MemberRole.ADMIN;
    const isModerator = currentMember.role === MemberRole.MODERATOR;
    const isOwner = currentMember.id === member.id;

    const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
    const canEditMessage = !deleted && isOwner && !fileUrl;

    const isPdf = fileUrl && fileType === "pdf";
    const isImage = !isPdf && fileUrl;

    return (
        <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
            <div className="group flex gap-2 items-start w-full">
                <div
                    onClick={handleOnMemberClick}
                    className="cursor-pointer hover:drop-shadow-md transition"
                >
                    <UserAvatar src={member.profile.imageUrl} />
                </div>

                <div className="flex flex-col w-full">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center">
                            <p
                                onClick={handleOnMemberClick}
                                className="font-semibold text-sm hover:underline cursor-pointer"
                            >
                                {member.profile.name}
                            </p>

                            <ActionTooltip label={member.role}>
                                {roleIconMap[member.role]}
                            </ActionTooltip>
                        </div>

                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            {timestamp}
                        </span>
                    </div>

                    {isImage && (
                        <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferer"
                            className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
                        >
                            <Image
                                src={fileUrl}
                                alt={content}
                                fill
                                className="object-cover"
                            />
                        </a>
                    )}

                    {isPdf && (
                        <div className="relative flex items-center p-2 mt-2 rounded-md">
                            <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />

                            <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-2 text-xm text-indigo-500 dark:text-indigo-400 hover:underline"
                            >
                                PDF File
                            </a>
                        </div>
                    )}

                    {!fileUrl && !isEditing && (
                        <p
                            className={cn(
                                "text-sm text-zinc-600 dark:text-zinc-300",
                                deleted &&
                                    "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
                            )}
                        >
                            {content}
                            {isUpdated && !deleted && (
                                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                                    (edited)
                                </span>
                            )}
                        </p>
                    )}

                    {!fileUrl && isEditing && (
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(handleOnSubmit)}
                                className="flex items-center w-full gap-x-2 pt-2"
                            >
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <div className="relative w-full">
                                                    <Input
                                                        {...field}
                                                        disabled={isLoading}
                                                        placeholder="Edited message"
                                                        className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                                                    />
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    disabled={isLoading}
                                    size="sm"
                                    variant="primary"
                                >
                                    Save
                                </Button>
                            </form>

                            <span className="text-[10px] mt-1 text-zinc-400">
                                Press escape to cancel, enter to save
                            </span>
                        </Form>
                    )}
                </div>
            </div>

            {canDeleteMessage && (
                <div className="hidden group-hover:flex items-center gap-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
                    {canEditMessage && (
                        <ActionTooltip label="Edit">
                            <Edit
                                onClick={() => setIsEditing(true)}
                                className="h-4 w-4 cursor-pointer ml-auto text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                            />
                        </ActionTooltip>
                    )}

                    <ActionTooltip label="Delete">
                        <Trash
                            onClick={() =>
                                onOpen("deleteMessage", {
                                    apiUrl: `${socketUrl}/${id}`,
                                    query: socketQuery,
                                })
                            }
                            className="h-4 w-4 cursor-pointer ml-auto text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                        />
                    </ActionTooltip>
                </div>
            )}
        </div>
    );
};

export default ChatItem;
