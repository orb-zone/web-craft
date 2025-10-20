/**
 * Variant System Examples - v2.0
 *
 * Demonstrates language variants, gender-aware pronouns, and multi-dimensional
 * content adaptation using the @orb-zone/dotted variant system.
 */

import { dotted } from "../packages/dotted/src/index.js";

async function main() {
  console.log(
    "═══════════════════════════════════════════════════════════"
  );
  console.log("  Variant System Examples - @orb-zone/dotted v2.0.0");
  console.log(
    "═══════════════════════════════════════════════════════════\n"
  );

  // ========================================================================
  // Example 1: Basic Language Variants with Automatic Resolution
  // ========================================================================
  console.log("Example 1: Basic Language Variants with Automatic Resolution\n");

  // Store language as a regular data property, variants are resolved automatically
  const greetingsEN = dotted({
    lang: "en",
    ".greeting": "Hello, World!",
    ".greeting:es": "¡Hola, Mundo!",
    ".greeting:fr": "Bonjour, le Monde!",
    ".greeting:de": "Hallo, Welt!",
  });

  console.log("English:", await greetingsEN.get(".greeting"));

  // Spanish version - just change the lang property
  const greetingsES = dotted({
    lang: "es",
    ".greeting": "Hello, World!",
    ".greeting:es": "¡Hola, Mundo!",
    ".greeting:fr": "Bonjour, le Monde!",
    ".greeting:de": "Hallo, Welt!",
  });

  console.log("Spanish:", await greetingsES.get(".greeting"));

  // French version
  const greetingsFR = dotted({
    lang: "fr",
    ".greeting": "Hello, World!",
    ".greeting:es": "¡Hola, Mundo!",
    ".greeting:fr": "Bonjour, le Monde!",
    ".greeting:de": "Hallo, Welt!",
  });

  console.log("French:", await greetingsFR.get(".greeting"));

  // ========================================================================
  // Example 2: Gender-Aware Pronouns with Automatic Resolution
  // ========================================================================
  console.log(
    "\n\nExample 2: Gender-Aware Pronouns with Automatic Resolution\n"
  );

  // Store gender as regular data property, variants resolved automatically
  const profilesDefault = dotted({
    gender: "m",
    ".bio": "${name} is a ${role}. ${:subject} loves coding.",
    ".bio:f":
      "${name} is a ${role}. ${:subject} loves coding.",
    name: "Alex",
    role: "developer",
  });

  console.log("Default (male) pronouns:", await profilesDefault.get(".bio"));

  const profilesFemale = dotted({
    gender: "f",
    ".bio": "${name} is a ${role}. ${:subject} loves coding.",
    ".bio:f":
      "${name} is a ${role}. ${:subject} loves coding.",
    name: "Alice",
    role: "engineer",
  });

  console.log("Female pronouns:", await profilesFemale.get(".bio"));

  // ========================================================================
  // Example 3: Combined Language + Gender Variants
  // ========================================================================
  console.log(
    "\n\nExample 3: Combined Language + Gender Variants\n"
  );

  const titles = dotted({
    lang: "es",
    gender: "f",
    ".title": "Autor",
    ".title:es": "Autora",
    ".title:es:f": "Autora",
    ".title:es:m": "Autor",
    ".title:en": "Author",
    ".title:en:f": "Authoress",
    ".title:en:m": "Author",
  });

  console.log("Spanish Female Title:", await titles.get(".title"));

  const titlesEnMale = dotted({
    lang: "en",
    gender: "m",
    ".title": "Autor",
    ".title:es": "Autora",
    ".title:es:f": "Autora",
    ".title:es:m": "Autor",
    ".title:en": "Author",
    ".title:en:f": "Authoress",
    ".title:en:m": "Author",
  });

  console.log("English Male Title:", await titlesEnMale.get(".title"));

  // ========================================================================
  // Example 4: Custom Variant Dimensions (beyond lang/gender/form)
  // ========================================================================
  console.log("\n\nExample 4: Custom Variant Dimensions\n");

  const cloudProviders = dotted({
    provider: "aws",
    ".endpoint": "https://api.example.com",
    ".endpoint:aws": "https://aws.example.com",
    ".endpoint:gcp": "https://gcp.example.com",
    ".endpoint:azure": "https://azure.example.com",
  });

  console.log("AWS Endpoint:", await cloudProviders.get(".endpoint"));

  const gcpProviders = dotted({
    provider: "gcp",
    ".endpoint": "https://api.example.com",
    ".endpoint:aws": "https://aws.example.com",
    ".endpoint:gcp": "https://gcp.example.com",
    ".endpoint:azure": "https://azure.example.com",
  });

  console.log("GCP Endpoint:", await gcpProviders.get(".endpoint"));

  // ========================================================================
  // Example 5: Variant Fallback and Cascading
  // ========================================================================
  console.log("\n\nExample 5: Variant Fallback and Cascading\n");

  // If :de not available, falls back to base
  const messageDe = dotted({
    lang: "de",
    ".message": "Default message",
    ".message:es": "Mensaje en español",
    ".message:fr": "Message en français",
  });

  console.log("German message (falls back to default):",
    await messageDe.get(".message")
  );

  console.log("\n✅ All variant examples completed successfully!");
}

main().catch(console.error);
