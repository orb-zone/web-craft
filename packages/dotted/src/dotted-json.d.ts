import type { GetOptions, SetOptions, HasOptions } from "./types.js";
import type { DottedOptions, VariantContext } from "./types.js";
export declare class DottedJson {
    private data;
    private options;
    private variantResolver;
    private cache;
    private maxEvaluationDepth;
    private availablePaths;
    constructor(data?: Record<string, any>, options?: DottedOptions & {
        variant?: string | string[];
        default?: any;
    });
    private mergeData;
    private updateAvailablePaths;
    private resolveVariant;
    get(path: string, options?: GetOptions): Promise<any>;
    set(path: string, value: any, _options?: SetOptions): Promise<void>;
    has(path: string, options?: HasOptions): Promise<boolean>;
    delete(path: string): void;
    allKeys(path?: string): string[];
    toJSON(): Record<string, any>;
    setVariant(variant: VariantContext | string | string[]): void;
    clearCache(): void;
}
//# sourceMappingURL=dotted-json.d.ts.map