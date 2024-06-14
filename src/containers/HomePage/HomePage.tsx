import { ChatMessages } from "@/components/ChatMessages";
import { MessageBar } from "@/components/MessageBar";
import { Search } from "@/components/Search";
import { PromptContextProvider } from "@/context/PromptContext";
import { ChatLayout } from "@/layouts/ChatLayout/Chat.layout";
import { useSearch } from "@/queries/useSearch";
import { ApiChatMessage, chatApi } from "@/services/api";
import { FileData } from "@/types/data.types";
import { populateDirs } from "@/utils/populateDirs.util";
import React, { useEffect, useMemo, useState } from "react";

export type HomePageProps = React.HTMLProps<HTMLDivElement>;

const testFilesData: FileData[] = [
    {
        id: "1",
        name: "Document 1",
        type: "document",
        excerpt: "Lorem ipsum dolor sit amet",
        tags: ["tag1", "tag2"],
        path: ["documents", "file1"],
        extension: "pdf",

        metadata: {
            id: "metadata1",
            __typename: "metadata",
        },
    },
    {
        id: "2",
        name: "Image 1",
        type: "image",
        excerpt: "Consectetur adipiscing elit",
        tags: ["tag3", "tag4"],
        path: ["images", "file2"],
        extension: "png",

        metadata: {
            id: "metadata2",
            __typename: "metadata",
        },
    },
    {
        id: "3",
        name: "Video 1",
        type: "video",
        excerpt: "Sed do eiusmod tempor incididunt",
        tags: ["tag5", "tag6"],
        path: ["videos", "file3"],
        extension: "mp4",

        metadata: {
            id: "metadata3",
            __typename: "metadata",
        },
    },
];

export const HomePage: React.FC<HomePageProps> = ({ className, ...props }) => {
    const [query, setQuery] = useState("");
    const [prompt, setPrompt] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [messages, setMessages] = useState<ApiChatMessage[]>([]);
    const [generating, setGenerating] = useState(false);

    const search = useSearch(
        { query },
        {
            cacheTime: 0,
            enabled: false,
            keepPreviousData: true,
            refetchOnWindowFocus: false,
        },
    );

    const fileList = useMemo(
        () => populateDirs(search.data?.files || []),
        [search.data],
    );

    const onSearch = async () => {
        search.refetch();
    };

    const onPrompt = async (prompt: string) => {
        setGenerating(true);

        setMessages((value: any) => [
            ...value,
            {
                role: "user",
                message: prompt,
            },
        ]);

        const { message } = await chatApi({
            prompt,
            files: fileList.filter((f) => selectedFiles.includes(f.id)),
            history: messages,
        });

        setGenerating(false);
        setMessages((value: any) => [...value, message]);
        setPrompt("");
    };

    useEffect(() => {
        setSelectedFiles([]);
    }, [search.data]);

    useEffect(() => {
        onSearch();
    }, []);

    return (
        <PromptContextProvider
            payload={{
                files: testFilesData,
                setMessages: setMessages,
                onPrompt: onPrompt,
                messages: messages,
                selectedFile: testFilesData.filter((f) =>
                    selectedFiles.includes(f.id),
                ),
            }}
        >
            <ChatLayout
                messageBar={
                    <MessageBar
                        hide={selectedFiles.length === 0}
                        prompt={prompt}
                        onPromptChange={setPrompt}
                        onSubmit={(prompt) => onPrompt(prompt)}
                        loading={generating}
                        disabled={generating}
                    />
                }
            >
                <Search
                    compact={messages.length > 0}
                    searching={search.isFetching}
                    query={query}
                    onQueryChange={(v) => setQuery(v)}
                    onSearch={onSearch}
                    results={testFilesData}
                    onSelect={(selected) => setSelectedFiles(selected)}
                    selectedFiles={selectedFiles}
                />
                <ChatMessages
                    className="py-[20px]"
                    data={messages.map((msg) => ({
                        role: msg.role,
                        message: msg.message,
                    }))}
                />
            </ChatLayout>
        </PromptContextProvider>
    );
};
