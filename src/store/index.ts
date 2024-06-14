import { ApiChatMessage } from "@/services/api";
import { FileData } from "@/types/data.types";
import { create } from "zustand";

export type StoreState = {
    files: FileData[];
    selectedFile: FileData[];
    messages: ApiChatMessage[];
    onPrompt: (prompt: string) => Promise<void> | null;
};

export type StoreActions = {
    setFiles: (files: FileData[]) => void;
    setSelectedFiles: (selectedFile: FileData[]) => void;
    setMessages: (messages: ApiChatMessage[]) => void;
    setOnPromptFunction: (onPrompt: (prompt: string) => Promise<void>) => void;
};

export const useGlobalStore = create<StoreActions & StoreState>((set) => ({
    files: [],
    messages: [],
    selectedFile: [],
    onPrompt: () => null,
    setFiles: (files) => set((state) => ({ ...state, files })),
    setMessages: (messages) => set((state) => ({ ...state, messages })),
    setOnPromptFunction: (onPrompt) => set((state) => ({ ...state, onPrompt })),
    setSelectedFiles: (selectedFile) =>
        set((state) => ({ ...state, selectedFile })),
}));
