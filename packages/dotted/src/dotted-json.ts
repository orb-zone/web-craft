import { getProperty as dotGet } from "dot-prop";
import type { GetOptions, SetOptions, HasOptions } from "./types.js";
import { createExpressionEvaluator } from "./expression-evaluator.js";
import { VariantResolver, resolveVariantPath, getAvailablePaths } from "./variant-resolver.js";
import type { DottedOptions, VariantContext } from "./types.js";

export class DottedJson {
  private data: Record<string, any>;
  private options: DottedOptions;
  private variantResolver: VariantResolver;
  private cache: Map<string, { value: any; timestamp: number }> = new Map();
  private maxEvaluationDepth: number;
  private availablePaths: string[] = [];

  constructor(
    data: Record<string, any> = {},
    options: DottedOptions = {}
  ) {
    this.options = options;
    this.data = this.mergeData(data, options.initial || {});
    this.maxEvaluationDepth = options.maxEvaluationDepth ?? 100;
    this.variantResolver = new VariantResolver(options.variant);
    this.updateAvailablePaths();
  }

  private mergeData(
    schema: Record<string, any>,
    initial: Record<string, any>
  ): Record<string, any> {
    const result = structuredClone(schema);

    for (const [key, value] of Object.entries(initial)) {
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        result[key] = { ...(result[key] || {}), ...value };
      } else {
        result[key] = value;
      }
    }

    return result;
  }

  private updateAvailablePaths(): void {
    this.availablePaths = getAvailablePaths(this.data);
  }

   private async resolveVariant(path: string): Promise<string> {
     // Create a temporary expression evaluator to access tree-walking
     const evaluator = createExpressionEvaluator(
       this.data,
       this.options.resolvers ?? {},
       [],
       this.options
     );

     // Build variant context from tree-walked values
     const variants: VariantContext = {};

     // Well-known variant dimensions
     const lang = evaluator.resolveTreeWalkingValue?.("lang");
     const form = evaluator.resolveTreeWalkingValue?.("form");
     const gender = evaluator.resolveTreeWalkingValue?.("gender");

     if (lang !== undefined && typeof lang === "string") variants.lang = lang;
     if (form !== undefined && typeof form === "string") variants.form = form;
     if (
       gender !== undefined &&
       typeof gender === "string" &&
       ["m", "f", "x"].includes(gender)
     ) {
       variants.gender = gender as "m" | "f" | "x";
     }

     // Custom variant dimensions
     const potentialVariants = [
       "region",
       "theme",
       "platform",
       "device",
       "style",
       "context",
       "environment",
       "tone",
       "dialect",
       "source",
     ];
     for (const prop of potentialVariants) {
       const value = evaluator.resolveTreeWalkingValue?.(prop);
       if (value !== undefined && typeof value === "string") {
         variants[value] = value;
       }
     }

     // If no variants found, return original path
     if (Object.keys(variants).length === 0) {
       return path;
     }

     // Use existing variant resolution logic
     return resolveVariantPath(path, variants, this.availablePaths);
   }

   async get(path: string, options?: GetOptions): Promise<any> {
     if (!path) {
       return undefined;
     }

     const cacheKey = path;
     if (!options?.fresh) {
       const cached = this.cache.get(cacheKey);
       if (cached) {
         return cached.value;
       }
     }

     try {
       // Resolve variant path based on context (e.g., name → name:es)
       const resolvedPath = await this.resolveVariant(path);

       let value: any;
       let expressionPath: string | null = null;

       if (resolvedPath.startsWith(".")) {
         // Direct expression path like ".departmentName"
         value = this.data[resolvedPath];
         if (value === undefined) {
           value = dotGet(this.data, resolvedPath);
         }
         expressionPath = resolvedPath;
       } else {
         // First try normal dot-path
         value = dotGet(this.data, resolvedPath);

         // If not found, try with leading dot (expression properties)
         if (value === undefined) {
           const exprPath = "." + resolvedPath.split(".").pop();
           const parentPath = resolvedPath
             .split(".")
             .slice(0, -1)
             .join(".");
           if (parentPath) {
             const parent = dotGet(this.data, parentPath);
             if (parent && exprPath in parent) {
               value = parent[exprPath];
               expressionPath = resolvedPath;
             }
           }
         }
       }

       // If it's an expression (is a string with template or function call), evaluate it
       if (
         typeof value === "string" &&
         (value.includes("${") || /\([^)]*\)/.test(value))
       ) {
         // Extract context path: the path to the parent object
         const pathSegments = resolvedPath.split(".").filter((s) => s);
         const contextPath = pathSegments.slice(0, -1);

         const evaluator = createExpressionEvaluator(
           this.data,
           this.options.resolvers ?? {},
           contextPath,
           this.options,
           path,
           this
         );

         const evaluated = await evaluator.evaluate(value);
         this.cache.set(cacheKey, { value: evaluated, timestamp: Date.now() });
         return evaluated;
       }

       // If value is still undefined, check for fallback
       if (value === undefined) {
         const fallback = options?.fallback ?? this.options.fallback;
         if (fallback !== undefined) {
           return typeof fallback === "function" ? await fallback() : fallback;
         }
       }

       this.cache.set(cacheKey, { value, timestamp: Date.now() });
       return value;
     } catch (error) {
       if (this.options.onError) {
         const result = this.options.onError(error as Error, path);
         if (result === "throw") {
           throw error;
         }
         if (result === "fallback") {
           const fallback = this.options.fallback;
           return typeof fallback === "function" ? await fallback() : fallback;
         }
         return result;
       }

       const fallback = options?.fallback ?? this.options.fallback;
       if (fallback !== undefined) {
         return typeof fallback === "function" ? await fallback() : fallback;
       }

       throw error;
     }
   }

   async set(path: string, value: any, _options?: SetOptions): Promise<void> {
     const keys = path.split(".");
     let current: any = this.data;

     for (let i = 0; i < keys.length - 1; i++) {
       const key = keys[i];
       if (!(key in current) || typeof current[key] !== "object") {
         current[key] = {};
       }
       current = current[key];
     }

     const lastKey = keys[keys.length - 1];
     current[lastKey] = value;

     this.cache.clear();
     this.updateAvailablePaths();
   }

  async has(path: string, options?: HasOptions): Promise<boolean> {
    try {
      const value = await this.get(path, options);
      return value !== undefined;
    } catch {
      return false;
    }
  }

   delete(path: string): void {
     const keys = path.split(".");
     let current: any = this.data;

     for (let i = 0; i < keys.length - 1; i++) {
       const key = keys[i];
       if (!(key in current) || typeof current[key] !== "object") {
         return;
       }
       current = current[key];
     }

     const lastKey = keys[keys.length - 1];
     if (lastKey in current) {
       delete current[lastKey];
       this.cache.clear();
       this.updateAvailablePaths();
     }
   }

  allKeys(path?: string): string[] {
    const obj = path ? dotGet(this.data, path) : this.data;
    if (obj && typeof obj === "object") {
      return Object.keys(obj);
    }
    return [];
  }

  toJSON(): Record<string, any> {
    return structuredClone(this.data);
  }

  setVariant(variant: VariantContext | string | string[]): void {
    if (typeof variant === "string" || Array.isArray(variant)) {
      this.variantResolver = new VariantResolver(variant);
    }
    this.cache.clear();
  }

  clearCache(): void {
    this.cache.clear();
  }
}
