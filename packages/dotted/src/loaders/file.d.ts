import type { VariantContext } from "../types.js";
export interface AllowedVariants {
    lang?: string[];
    gender?: ("m" | "f" | "x")[];
    form?: string[];
    [key: string]: string[] | undefined;
}
export interface FileLoaderOptions {
    baseDir: string;
    extensions?: string[];
    allowedVariants?: AllowedVariants | true;
    cache?: boolean;
    encoding?: BufferEncoding;
}
export declare class FileLoader {
    private options;
    private fileCache;
    private availableFiles;
    constructor(options: FileLoaderOptions);
    private scanDirectory;
    load(path: string, variants?: VariantContext): Promise<Record<string, any>>;
    save(path: string, data: Record<string, any>, variants?: VariantContext): Promise<void>;
    clearCache(): void;
    private validateVariants;
    private parseContent;
    private removeExtension;
}
//# sourceMappingURL=file.d.ts.map