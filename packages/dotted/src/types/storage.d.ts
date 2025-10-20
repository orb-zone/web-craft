import { DottedObject } from "../types.js";
export interface StorageProvider {
    load(path: string): Promise<DottedObject>;
    save(path: string, data: DottedObject): Promise<void>;
    exists(path: string): Promise<boolean>;
}
export declare class InMemoryStorage implements StorageProvider {
    private store;
    load(path: string): Promise<DottedObject>;
    save(path: string, data: DottedObject): Promise<void>;
    exists(path: string): Promise<boolean>;
    clear(): void;
    size(): number;
}
//# sourceMappingURL=storage.d.ts.map