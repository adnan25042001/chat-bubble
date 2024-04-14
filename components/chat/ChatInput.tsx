"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Plus } from "lucide-react";
import { Input } from "../ui/input";

interface ChatInputProps {
    apiUrl: string;
    query: Record<string, any>;
    name: string;
    type: "channel" | "conversation";
}

const formSchema = z.object({
    content: z.string().min(1),
});

const ChatInput = ({ apiUrl, name, query, type }: ChatInputProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: "",
        },
    });

    const isLoading = form.formState.isSubmitting;

    const handleOnSubmit = async (value: z.infer<typeof formSchema>) => {
        console.log(value);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleOnSubmit)}>
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="relative p-4 pb-6">
                                    <button
                                        type="button"
                                        onClick={() => {}}
                                        className="absolute top-7 left-8 h-6 w-6 bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-66 dark:hover:bg-zinc-300"
                                    >
                                        <Plus className="text-white dark:text-[#313338]" />
                                    </button>

                                    <Input/>
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
};

export default ChatInput;
