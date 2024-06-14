import { FileData } from "@/types/data.types";

export const populateDirs = (data: FileData[]): FileData[] => {
    const list: FileData[] = [];
    const directories: Record<string, FileData> = {};

    data.forEach((file) => {
        const { path } = file;

        list.push(file);
        if (path.length === 0) return;

        const dir = path[0];
        const directory = directories[dir] || {
            id: dir,
            name: dir,
            metadata: {
                id: dir,
                __typename: "",
            },
            path: [dir],
            type: "folder",
            children: [],
        };
        directory.children!.push(file);
        directories[dir] = directory;
    });

    return [...list, ...Object.values(directories)];
};
