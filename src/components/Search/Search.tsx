import { AnimatedText } from "@/components/AnimatedText";
import { SearchBar } from "@/components/SearchBar";
import { FileData, FileType } from "@/types/data.types";
import { Button } from "@nextui-org/react";
import clsx from "clsx";
import {
    AudioSquare,
    Document,
    DocumentText1,
    Image as ImageIcon,
    VideoSquare,
} from "iconsax-react";
import React, { useEffect, useState } from "react";
import { SearchResult, SearchResultProps } from "../SearchResult";

export type SearchProps = {
    query?: string;
    onQueryChange?: (query: string) => void;

    searching?: boolean;
    results?: SearchResultProps["files"];
    onSearch?: (query: string) => void;

    selectedFiles?: SearchResultProps["selected"];
    onSelect?: SearchResultProps["onSelect"];

    compact?: boolean;
};

export const Search: React.FC<SearchProps> = ({
    query,
    onQueryChange,
    searching,
    results,
    onSearch,
    selectedFiles,
    onSelect,
    compact,
}) => {
    const [filesList, setFilesList] = useState<FileData[]>(results!);
    const [currentfilter, setCurrentfilter] = useState<FileType | null>(null);

    const filterList: {
        type: FileType;
        name: string;
        icon: React.ReactNode;
    }[] = [
        {
            type: "image",
            name: "Images",
            icon: <ImageIcon size="25" color="#ff8a65" variant="Bulk" />,
        },
        {
            type: "audio",
            name: "MP3/Audio",
            icon: <AudioSquare size="25" color="#FF8A65" variant="Bulk" />,
        },
        {
            type: "document",
            name: "Docs",
            icon: <Document size="25" color="#FF8A65" variant="Bulk" />,
        },
        {
            type: "pdf",
            name: "PDF",
            icon: <DocumentText1 size="25" color="#FF8A65" variant="Bulk" />,
        },
        {
            type: "video",
            name: "MP4/Video",
            icon: <VideoSquare size="25" color="#FF8A65" variant="Bulk" />,
        },
    ];

    const onFilter = (type: FileType) => {
        if (currentfilter === null) {
            //if NO filter selected
            setFilesList([...results!]);
        } else {
            const filteredFiles = filesList.filter(
                (file) => file.type === type,
            );
            setFilesList(filteredFiles);
        }
    };

    useEffect(() => {
        onFilter(currentfilter!);
    }, [currentfilter]);
    return (
        <div className="flex flex-col">
            <SearchBar
                className={clsx(
                    "transition",
                    "mb-10",
                    compact && ["opacity-0", "invisible", "h-0", "mb-0"],
                )}
                value={query}
                pending={searching}
                onChange={(e) => onQueryChange && onQueryChange(e.target.value)}
                onSubmit={() => {
                    onSearch && onSearch(query || "");
                }}
            />
            {!compact && (
                <section className="w-full flex items-center justify-center gap-5 my-3">
                    {filterList.map((item, index) => (
                        <Button
                            key={index}
                            onClick={() => {
                                onFilter(item.type);
                                setCurrentfilter((pv) =>
                                    pv === item.type ? null : item.type,
                                );
                            }}
                            variant="shadow"
                            className={clsx(
                                "bg-white font-light text-sm text-gray-500 border-[1px] border-transparent transition-all",
                                {
                                    "border-orange-400 bg-orange-50":
                                        item.type === currentfilter,
                                },
                            )}
                        >
                            {item.name}
                            {item.icon}
                        </Button>
                    ))}
                </section>
            )}

            <div>
                {typeof results !== "undefined" && (
                    <SearchResult
                        title={
                            <div className="flex flex-row items-center gap-2">
                                <AnimatedText
                                    maxTime={500}
                                    text={compact ? query! : "Search results"}
                                />
                            </div>
                        }
                        description={
                            <AnimatedText
                                maxTime={500}
                                text={
                                    compact
                                        ? `Ask me anything to help with your studies!`
                                        : `Select at least one file to start a new conversation.`
                                }
                            />
                        }
                        selected={selectedFiles}
                        onSelect={onSelect}
                        files={filesList}
                        hideList={compact}
                        compactOverview={compact}
                    />
                )}
            </div>
        </div>
    );
};
