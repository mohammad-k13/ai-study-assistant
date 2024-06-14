import { Avatar, Button } from "@nextui-org/react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { Edit } from "iconsax-react";
import React, { FormEvent, useState } from "react";

//Local
import { chatApi } from "@/services/api";
import { useGlobalStore } from "@/store";
import { useAnimatedText } from "../AnimatedText";

export type ChatMessageProps = Omit<React.HTMLProps<HTMLDivElement>, "role"> & {
    message: string;
    role: "user" | "assistant";
    disableAnimation?: boolean;
};

export const ChatMessage: React.FC<ChatMessageProps> = ({
    message,
    role,
    disableAnimation = false,
    ...props
}) => {
    const [content, setContent] = useState(message);
    const [newCommand, setNewCommand] = useState(message);
    const [isEditing, setIsEditing] = useState(false);

    //store Data
    const { chatHistory, selectedFile, onPrompt } = useGlobalStore((state) => ({
        selectedFile: state.selectedFile,
        chatHistory: state.messages,
        onPrompt: state.onPrompt,
    }));

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const response = await chatApi({
            prompt: newCommand,
            files: selectedFile,
        });

        // Update the content with the new message
        setContent(response.message.message);

        // Call onPrompt with the new command
        onPrompt(newCommand);

        // Find the index of the object with the matching message
        // const targetIndex = chatHistory.findIndex(
        //     (obj) => obj.message === message,
        // );

        // if (targetIndex !== -1) {
        //     // Filter out all objects that come after the target object
        //     chatHistory.filter((_, index) => index >= targetIndex);
        // }
        console.log(chatHistory);

        // Exit edit mode
        setIsEditing(false);
    };

    // Use the animated text for the initial content if it's not being edited
    const animatedContent = useAnimatedText(content, {
        maxTime: 1000,
        disabled: role === "user" || disableAnimation,
    });

    return (
        <div {...props} className={clsx("", props.className)}>
            <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="flex flex-row gap-4 items-start"
            >
                <Avatar
                    className="flex-shrink-0"
                    showFallback
                    color={role === "assistant" ? "primary" : "default"}
                    name={role === "assistant" ? "A" : ""}
                    classNames={{
                        name: "text-[16px]",
                    }}
                />
                <div className="h-fit flex-grow flex justify-between items-center border border-gray-200 rounded-lg p-3 text-md bg-white shadow-sm mt-[-4px] transition-all">
                    <div className="w-4/5">
                        {role === "user" ? (
                            <form
                                className="w-full flex flex-col gap-3 items-start"
                                onSubmit={onSubmit}
                            >
                                {isEditing ? (
                                    <input
                                        name="userCommand"
                                        defaultValue={newCommand}
                                        value={newCommand}
                                        onChange={(e) =>
                                            setNewCommand(e.target.value)
                                        }
                                        className={clsx(
                                            "w-full ring-2 ring-transparent border-none outline-none rounded-md py-1 px-3 transition-all focus-visible:text-[#005fee90]",
                                            {
                                                "!ring-[#006fee]": isEditing,
                                            },
                                        )}
                                    />
                                ) : (
                                    <p className="py-1 px-3">
                                        {newCommand === message
                                            ? message
                                            : newCommand}
                                    </p>
                                )}
                                <AnimatePresence
                                    // this tag will keep unmounted element in DOM until their animations done
                                    mode="wait"
                                >
                                    {isEditing && (
                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: 20, opacity: 0 }}
                                            transition={{
                                                type: "keyframes",
                                                duration: 0.25,
                                            }}
                                            className="flex gap-3 items-center"
                                        >
                                            <Button
                                                variant="shadow"
                                                color="default"
                                                size="sm"
                                                type="button"
                                                onClick={() =>
                                                    setIsEditing((pv) => !pv)
                                                }
                                            >
                                                Cancle
                                            </Button>
                                            <Button
                                                variant="shadow"
                                                color="primary"
                                                size="sm"
                                                type="submit"
                                            >
                                                Submit
                                            </Button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </form>
                        ) : (
                            <p className="py-1 px-3">{animatedContent}</p>
                        )}
                    </div>
                    {role === "user" && (
                        <Edit
                            variant="Outline"
                            size={20}
                            onClick={() => setIsEditing((prev) => !prev)}
                            className="size-[30px] p-[5px] hover:rounded-lg hover:bg-black/25 cursor-pointer transition-all"
                        />
                    )}
                </div>
            </motion.div>
        </div>
    );
};
