/**
 * File Loader with i18n Example - v2.0
 *
 * Demonstrates loading translated content from variant-aware files.
 */

import { FileLoader } from "../packages/dotted/src/loaders/file.js";
import { dotted } from "../packages/dotted/src/index.js";
import { mkdir, writeFile, rm } from "fs/promises";
import { join } from "path";

const TEMP_DIR = "/tmp/dotted-example-i18n";

async function setupExampleFiles() {
  // Create temporary directory with example files
  await rm(TEMP_DIR, { recursive: true, force: true });
  await mkdir(TEMP_DIR, { recursive: true });

  // Base English strings
  await writeFile(
    join(TEMP_DIR, "strings.json"),
    JSON.stringify(
      {
        welcome: "Welcome to our app",
        goodbye: "Goodbye",
        hello: "Hello, {name}!",
      },
      null,
      2
    )
  );

  // Spanish translation
  await writeFile(
    join(TEMP_DIR, "strings:es.json"),
    JSON.stringify(
      {
        welcome: "Bienvenido a nuestra aplicación",
        goodbye: "Adiós",
        hello: "¡Hola, {name}!",
      },
      null,
      2
    )
  );

  // Spanish formal translation
  await writeFile(
    join(TEMP_DIR, "strings:es:formal.json"),
    JSON.stringify(
      {
        welcome: "Le damos la bienvenida a nuestra aplicación",
        goodbye: "Hasta luego",
        hello: "Buenos días, {name}",
      },
      null,
      2
    )
  );

  // French translation
  await writeFile(
    join(TEMP_DIR, "strings:fr.json"),
    JSON.stringify(
      {
        welcome: "Bienvenue dans notre application",
        goodbye: "Au revoir",
        hello: "Bonjour, {name}!",
      },
      null,
      2
    )
  );

  // German translation
  await writeFile(
    join(TEMP_DIR, "strings:de.json"),
    JSON.stringify(
      {
        welcome: "Willkommen in unserer App",
        goodbye: "Auf Wiedersehen",
        hello: "Hallo, {name}!",
      },
      null,
      2
    )
  );
}

async function main() {
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  File Loader with i18n Examples - @orb-zone/dotted v2.0.0");
  console.log(
    "═══════════════════════════════════════════════════════════\n"
  );

  try {
    // Setup example files
    await setupExampleFiles();
    console.log(`✅ Created example files in ${TEMP_DIR}\n`);

    // Create file loader with allowed variants
    const loader = new FileLoader({
      baseDir: TEMP_DIR,
      allowedVariants: {
        lang: ["en", "es", "fr", "de", "ja"],
        form: ["casual", "formal"],
      },
    });

    // Example 1: Load base English strings
    console.log("Example 1: Load base English strings");
    const enStrings = await loader.load("strings");
    console.log("English:", enStrings.welcome);

    // Example 2: Load Spanish translation
    console.log("\nExample 2: Load Spanish translation");
    const esStrings = await loader.load("strings", { lang: "es" });
    console.log("Spanish:", esStrings.welcome);

    // Example 3: Load Spanish formal translation
    console.log("\nExample 3: Load Spanish formal translation");
    const esFormalStrings = await loader.load("strings", {
      lang: "es",
      form: "formal",
    });
    console.log("Spanish (Formal):", esFormalStrings.welcome);

    // Example 4: Load French translation
    console.log("\nExample 4: Load French translation");
    const frStrings = await loader.load("strings", { lang: "fr" });
    console.log("French:", frStrings.welcome);

    // Example 5: Fallback to base when variant not found
    console.log(
      "\nExample 5: Fallback to base when lang variant not found"
    );
    const itStrings = await loader.load("strings", { lang: "en" });
    console.log("Italian (falls back to English):", itStrings.welcome);

    // Example 6: Save new translations
    console.log("\nExample 6: Save new translations");
    const japaneseStrings = {
      welcome: "私たちのアプリへようこそ",
      goodbye: "さようなら",
      hello: "こんにちは、{name}!",
    };
    await loader.save("strings", japaneseStrings, { lang: "ja" });
    console.log("✅ Saved Japanese translation to strings:ja.json");

    // Verify saved file
    const savedJaStrings = await loader.load("strings", { lang: "ja" });
    console.log("Loaded back:", savedJaStrings.welcome);

    // Example 7: Using with dotted() for expressions
    console.log("\nExample 7: Combining File Loader with dotted expressions");

    const appConfig = dotted({
      lang: "es",
      form: "formal",
      ".title": "Spanish Formal App",
      ".welcome": "This app is internationalized",
    });

    console.log("Config:", await appConfig.get(".welcome"));
    console.log("Lang:", await appConfig.get("lang"));
    console.log("Form:", await appConfig.get("form"));

    console.log("\n✅ All file loader examples completed successfully!");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Cleanup
    await rm(TEMP_DIR, { recursive: true, force: true });
  }
}

main();
