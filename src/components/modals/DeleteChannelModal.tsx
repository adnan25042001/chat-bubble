"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { useModalStore } from "@/hooks/useModalStore";
import { useState } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import qs from "query-string";
import { useParams, useRouter } from "next/navigation";

const DeleteChannelModal = () => {
    const router = useRouter();

    const { isOpen, onClose, type, data } = useModalStore();
    const [isLoading, setIsLoading] = useState(false);

    const isModalOpen = isOpen && type === "deleteChannel";
    const { server, channel } = data;

    const handleDeleteChannel = async () => {
        try {
            setIsLoading(true);

            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: {
                    serverId: server?.id,
                },
            });

            await axios.delete(url);

            onClose();
            router.push(`/servers/${server?.id}`);
            router.refresh();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Delete Channel
                    </DialogTitle>

                    <DialogDescription className="text-center text-zinc-500">
                        Are you sure you want to do this? <br />
                        <span className="font-semibold text-indigo-500">
                            #{channel?.name}
                        </span>{" "}
                        will be permanently deleted.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="bg-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                        <Button
                            disabled={isLoading}
                            onClick={onClose}
                            variant="ghost"
                        >
                            Cancel
                        </Button>

                        <Button
                            disabled={isLoading}
                            onClick={handleDeleteChannel}
                            variant="primary"
                        >
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteChannelModal;
