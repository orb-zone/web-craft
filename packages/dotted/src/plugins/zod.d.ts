import { Plugin } from "../types.js";
export interface ZodPluginOptions {
    schema: any;
    strict?: boolean;
}
export declare function withZod(schema: any, options?: ZodPluginOptions): Plugin;
//# sourceMappingURL=zod.d.ts.map