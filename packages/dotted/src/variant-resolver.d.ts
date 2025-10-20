/**
 * Variant resolution for localization and conditional content
 *
 * Supports flexible variant dimensions:
 * - Well-known: lang (ISO codes), gender (m/f/x), form (formality levels)
 * - Custom: dialect, tone, source, etc.
 *
 * @module @orb-zone/dotted-json/variant-resolver
 */
import type { VariantContext } from "./types.js";
export declare class VariantResolver {
    private preferredVariants;
    constructor(variant?: string | string[]);
    getPreferred(): string[];
    setPreferred(variant: string | string[]): void;
    selectVariant(availableVariants: string[]): string | null;
}
/**
 * Parsed variant information from a property path
 */
export interface ParsedVariants {
    base: string;
    variants: VariantContext;
}
/**
 * Parse a property path into base name and variant dimensions
 *
 * @example
 * ```typescript
 * parseVariantPath('.bio:es:f:formal')
 * // → { base: '.bio', variants: { lang: 'es', gender: 'f', formal: 'formal' } }
 *
 * parseVariantPath('.greeting:en:surfer')
 * // → { base: '.greeting', variants: { lang: 'en', surfer: 'surfer' } }
 * ```
 */
export declare function parseVariantPath(path: string): ParsedVariants;
/**
 * Serialize base name and variants into a colon-separated path
 *
 * Creates order-independent, deterministic file names from variant context.
 *
 * @param baseName - Base file name (without variants)
 * @param variants - Variant context (lang, gender, form, custom)
 * @returns Colon-separated path (e.g., 'strings:es:formal')
 *
 * @example
 * ```typescript
 * serializeVariantPath('strings', { lang: 'es', form: 'formal' })
 * // → 'strings:es:formal'
 *
 * serializeVariantPath('strings', { form: 'formal', lang: 'es' })
 * // → 'strings:es:formal' (same order, deterministic)
 * ```
 */
export declare function serializeVariantPath(baseName: string, variants?: VariantContext): string;
/**
 * Score how well a set of path variants matches the context
 *
 * Higher score = better match
 *
 * Scoring weights:
 * - lang match: 1000 points (highest - language is primary)
 * - gender match: 100 points (high - affects pronouns)
 * - form match: 50 points (medium - affects formality/honorifics)
 * - custom variant match: 10 points each (lower - domain-specific)
 */
export declare function scoreVariantMatch(pathVariants: VariantContext, contextVariants: VariantContext): number;
/**
 * Find the best matching property path from available candidates
 *
 * @param basePath - Base property name (e.g., '.bio')
 * @param context - Current variant context
 * @param availablePaths - All property paths in the data
 * @returns Best matching path, or basePath if no better match
 *
 * @example
 * ```typescript
 * const context = { lang: 'es', gender: 'f' };
 * const available = ['.bio', '.bio:es', '.bio:f', '.bio:es:f'];
 *
 * resolveVariantPath('.bio', context, available);
 * // → '.bio:es:f' (best match: lang + gender)
 * ```
 */
export declare function resolveVariantPath(basePath: string, context: VariantContext, availablePaths: string[]): string;
/**
 * Get all available property paths from data object
 *
 * Recursively collects all property paths including nested ones
 */
export declare function getAvailablePaths(data: Record<string, any>, prefix?: string): string[];
//# sourceMappingURL=variant-resolver.d.ts.map