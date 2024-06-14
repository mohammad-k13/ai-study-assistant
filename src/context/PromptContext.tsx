import { type ApiChatMessage } from "@/services/api";
import { FileData } from "@/types/data.types";
import { createContext, type ReactNode } from "react";

export type ContextType = {
    files: FileData[];
    selectedFile: FileData[];
    messages: ApiChatMessage[];
    setMessages: any;
    onPrompt: (prompt: string) => void;
};

//Contex for Files & onPromp function
export const PromptContext = createContext<ContextType>({
    files: [],
    messages: [],
    selectedFile: [],
    setMessages: null,
    onPrompt: () => null,
});

export const PromptContextProvider = ({
    children,
    payload,
}: {
    children: ReactNode;
    payload: ContextType;
}) => {
    return (
        <PromptContext.Provider value={{ ...payload }}>
            {children}
        </PromptContext.Provider>
    );
};
