import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import { FileLoader } from "../../src/loaders/file.js";
import { join } from "path";
import { mkdir, writeFile, rmdir } from "fs/promises";
import { rm } from "fs/promises";

const TEST_DIR = "/tmp/dotted-file-loader-test";

async function setupTestFiles() {
  await mkdir(TEST_DIR, { recursive: true });

  const fixtures: Record<string, Record<string, any>> = {
    "strings.json": { welcome: "Welcome", greeting: "Hello" },
    "strings:es.json": { welcome: "Bienvenido", greeting: "Hola" },
    "strings:es:formal.json": {
      welcome: "Bienvenido señor/señora",
      greeting: "Buenos días",
    },
    "strings:ja:polite.json": { welcome: "いらっしゃいませ" },
    "profile:f.json": { title: "Ms.", pronoun: "she" },
    "profile:m.json": { title: "Mr.", pronoun: "he" },
  };

  for (const [filename, data] of Object.entries(fixtures)) {
    const filepath = join(TEST_DIR, filename);
    await writeFile(filepath, JSON.stringify(data, null, 2));
  }
}

async function cleanupTestFiles() {
  try {
    await rm(TEST_DIR, { recursive: true, force: true });
  } catch {
    // Ignore cleanup errors
  }
}

describe("FileLoader", () => {
  let loader: FileLoader;

  beforeEach(async () => {
    await setupTestFiles();
    loader = new FileLoader({
      baseDir: TEST_DIR,
      allowedVariants: {
        lang: ["en", "es", "ja"],
        gender: ["m", "f", "x"],
        form: ["casual", "polite", "formal"],
      },
      cache: true,
    });
  });

  afterEach(async () => {
    await cleanupTestFiles();
  });

  describe("Basic file loading", () => {
    test("loads base file when no variants specified", async () => {
      const data = await loader.load("strings");
      expect(data.welcome).toBe("Welcome");
    });

    test("loads base file when variants is empty object", async () => {
      const data = await loader.load("strings", {});
      expect(data.welcome).toBe("Welcome");
    });

    test("throws error for non-existent file", async () => {
      await expect(loader.load("nonexistent")).rejects.toThrow(
        /File not found/
      );
    });
  });

  describe("Language variant resolution", () => {
    test("loads language-specific file", async () => {
      const data = await loader.load("strings", { lang: "es" });
      expect(data.welcome).toBe("Bienvenido");
    });

    test("throws when language not in allowed list", async () => {
      await expect(loader.load("strings", { lang: "fr" })).rejects.toThrow(
        /not in allowed/
      );
    });
  });

  describe("Form (formality) variant resolution", () => {
    test("loads lang + form combination", async () => {
      const data = await loader.load("strings", {
        lang: "es",
        form: "formal",
      });
      expect(data.welcome).toBe("Bienvenido señor/señora");
    });

    test("loads Japanese polite form", async () => {
      const data = await loader.load("strings", { lang: "ja", form: "polite" });
      expect(data.welcome).toBe("いらっしゃいませ");
    });

    test("falls back to lang when form not available", async () => {
      const data = await loader.load("strings", {
        lang: "es",
        form: "casual",
      });
      expect(data.welcome).toBe("Bienvenido");
    });
  });

  describe("Gender variant resolution", () => {
    test("loads female profile", async () => {
      const data = await loader.load("profile", { gender: "f" });
      expect(data.title).toBe("Ms.");
      expect(data.pronoun).toBe("she");
    });

    test("loads male profile", async () => {
      const data = await loader.load("profile", { gender: "m" });
      expect(data.title).toBe("Mr.");
      expect(data.pronoun).toBe("he");
    });
  });

  describe("Security - Variant validation", () => {
    test("rejects path traversal in variant values", async () => {
      await expect(
        loader.load("strings", { lang: "../../../etc/passwd" })
      ).rejects.toThrow(/path traversal|not in allowed/);
    });

    test("rejects invalid variants when allowedVariants is strict", async () => {
      await expect(
        loader.load("strings", { lang: "invalid-lang" })
      ).rejects.toThrow(/not in allowed/);
    });

    test("rejects all variants when allowedVariants undefined", async () => {
      const strictLoader = new FileLoader({
        baseDir: TEST_DIR,
      });
      await expect(
        strictLoader.load("strings", { lang: "es" })
      ).rejects.toThrow(/not allowed/);
    });
  });

  describe("Permissive mode", () => {
    test("allows any variant when allowedVariants is true", async () => {
      const permissiveLoader = new FileLoader({
        baseDir: TEST_DIR,
        allowedVariants: true,
      });
      // Should allow custom variant (no validation error)
      // Falls back to base file if custom variant not found
      const data = await permissiveLoader.load("strings", { lang: "custom-lang" });
      expect(data.welcome).toBe("Welcome"); // Falls back to base
    });
  });

  describe("Caching", () => {
    test("caches loaded files", async () => {
      const data1 = await loader.load("strings");
      const data2 = await loader.load("strings");
      expect(data1).toBe(data2); // Same object reference (cached)
    });

    test("allows cache clearing", () => {
      loader.clearCache();
      expect(true).toBe(true); // Just verify it doesn't throw
    });
  });

  describe("File save operations", () => {
    test("saves file without variants", async () => {
      const newData = { test: "value" };
      await loader.save("test-output", newData);

      const loaded = await loader.load("test-output");
      expect(loaded.test).toBe("value");
    });

    test("saves file with variants", async () => {
      const newData = { greeting: "Hola" };
      await loader.save("output", newData, { lang: "es" });

      const loaded = await loader.load("output", { lang: "es" });
      expect(loaded.greeting).toBe("Hola");
    });
  });
});
