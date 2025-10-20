export type Gender = "m" | "f" | "x";
export type PronounForm = "subject" | "object" | "possessive" | "reflexive";
export declare const PRONOUNS: Record<string, Record<Gender, Record<PronounForm, string>>>;
export declare function resolvePronoun(form: PronounForm, gender?: Gender, lang?: string): string;
export declare function isPronounPlaceholder(value: string): boolean;
export declare function extractPronounForm(placeholder: string): PronounForm | null;
//# sourceMappingURL=pronouns.d.ts.map