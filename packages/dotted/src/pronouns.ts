export type Gender = "m" | "f" | "x";
export type PronounForm = "subject" | "object" | "possessive" | "reflexive";

export const PRONOUNS: Record<string, Record<Gender, Record<PronounForm, string>>> =
  {
    en: {
      m: {
        subject: "he",
        object: "him",
        possessive: "his",
        reflexive: "himself",
      },
      f: {
        subject: "she",
        object: "her",
        possessive: "her",
        reflexive: "herself",
      },
      x: {
        subject: "they",
        object: "them",
        possessive: "their",
        reflexive: "themselves",
      },
    },
  };

export function resolvePronoun(
  form: PronounForm,
  gender: Gender = "x",
  lang = "en"
): string {
  const langPronouns = PRONOUNS[lang] || PRONOUNS.en;
  if (!langPronouns) return "they";
  const genderPronouns = langPronouns[gender] || langPronouns.x;
  if (!genderPronouns) return "they";
  return genderPronouns[form] || "they";
}

export function isPronounPlaceholder(value: string): boolean {
  return /^:(subject|object|possessive|reflexive)$/.test(value);
}

export function extractPronounForm(placeholder: string): PronounForm | null {
  const match = placeholder.match(/^:(subject|object|possessive|reflexive)$/);
  return match ? (match[1] as PronounForm) : null;
}
