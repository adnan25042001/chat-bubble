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
import { useRouter } from "next/navigation";

const LeaveServerModal = () => {
  const router = useRouter();

  const { isOpen, onClose, type, data } = useModalStore();
  const [isLoading, setIsLoading] = useState(false);

  const isModalOpen = isOpen && type === "leaveServer";
  const { server } = data;

  const handleLeaveServer = async () => {
    try {
      setIsLoading(true);

      await axios.patch(`/api/servers/${server?.id}/leave`);

      onClose();
      router.push("/");
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
            Leave Server
          </DialogTitle>

          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to leave{" "}
            <span className="font-semibold text-indigo-500">
              {server?.name}
            </span>
            ?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} onClick={onClose} variant="ghost">
              Cancel
            </Button>

            <Button
              disabled={isLoading}
              onClick={handleLeaveServer}
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

export default LeaveServerModal;
