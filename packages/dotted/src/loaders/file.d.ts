import { DottedObject } from "../types.js";
export interface FileLoaderOptions {
    encoding?: BufferEncoding;
}
export declare class FileLoader {
    private encoding;
    constructor(options?: FileLoaderOptions);
    load(filePath: string): Promise<DottedObject>;
    save(filePath: string, data: DottedObject): Promise<void>;
    exists(filePath: string): Promise<boolean>;
    loadMultiple(filePaths: string[]): Promise<DottedObject[]>;
    saveMultiple(filePaths: string[], dataArray: DottedObject[]): Promise<void>;
}
//# sourceMappingURL=file.d.ts.map