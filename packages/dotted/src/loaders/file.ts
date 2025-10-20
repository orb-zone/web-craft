import { readFile, writeFile, mkdir, readdir } from "fs/promises";
import { dirname, join } from "path";
import { resolveVariantPath } from "../variant-resolver.js";
import type { VariantContext } from "../types.js";

export interface AllowedVariants {
  lang?: string[];
  gender?: ("m" | "f" | "x")[];
  form?: string[];
  [key: string]: string[] | undefined;
}

export interface FileLoaderOptions {
  baseDir: string;
  extensions?: string[];
  allowedVariants?: AllowedVariants | true;
  cache?: boolean;
  encoding?: BufferEncoding;
}

export class FileLoader {
  private options: Required<Omit<FileLoaderOptions, "allowedVariants">> & {
    allowedVariants?: AllowedVariants | true;
  };
  private fileCache = new Map<string, any>();
  private availableFiles: Set<string> = new Set();

  constructor(options: FileLoaderOptions) {
    this.options = {
      extensions: [".jsön", ".json"],
      allowedVariants: undefined,
      cache: true,
      encoding: "utf-8",
      ...options,
    };
  }

  private async scanDirectory(): Promise<void> {
    try {
      const files = await readdir(this.options.baseDir);
      for (const file of files) {
        // Store filename without extension
        const nameWithoutExt = this.removeExtension(file);
        if (nameWithoutExt) {
          this.availableFiles.add(nameWithoutExt);
        }
      }
    } catch {
      // Directory may not exist yet
    }
  }

  async load(
    path: string,
    variants?: VariantContext
  ): Promise<Record<string, any>> {
    const cacheKey = `${path}:${JSON.stringify(variants || {})}`;

    if (this.options.cache && this.fileCache.has(cacheKey)) {
      return this.fileCache.get(cacheKey);
    }

    // Validate variants against allowed list
    if (variants) {
      this.validateVariants(variants);
    }

    // Scan for available files if needed
    if (this.availableFiles.size === 0) {
      await this.scanDirectory();
    }

    // Resolve variant-aware filename using available files
    const filename = variants
      ? resolveVariantPath(path, variants, Array.from(this.availableFiles))
      : path;

    // Try each extension
    let data: Record<string, any> | null = null;
    for (const ext of this.options.extensions) {
      try {
        const filepath = join(this.options.baseDir, filename + ext);
        const content = await readFile(filepath, this.options.encoding);
        data = this.parseContent(content, ext);
        break;
      } catch {
        // Try next extension
      }
    }

    if (!data) {
      throw new Error(
        `File not found for path '${path}' with variants ${JSON.stringify(variants || {})}`
      );
    }

    if (this.options.cache) {
      this.fileCache.set(cacheKey, data);
    }

    return data;
  }

  async save(
    path: string,
    data: Record<string, any>,
    variants?: VariantContext
  ): Promise<void> {
    if (variants) {
      this.validateVariants(variants);
    }

    // Determine filename
    let filename = path;
    if (variants) {
      // For save, use the variant suffix
      const variantParts: string[] = [];
      if (variants.lang) variantParts.push(variants.lang);
      if (variants.form) variantParts.push(variants.form);
      if (variants.gender) variantParts.push(variants.gender);
      for (const [k, v] of Object.entries(variants)) {
        if (!["lang", "form", "gender"].includes(k)) {
          variantParts.push(v);
        }
      }
      if (variantParts.length > 0) {
        filename = `${path}:${variantParts.join(":")}`;
      }
    }

    const filepath = join(
      this.options.baseDir,
      filename + (this.options.extensions[0] || ".json")
    );

    // Ensure directory exists
    await mkdir(dirname(filepath), { recursive: true });

    await writeFile(filepath, JSON.stringify(data, null, 2), this.options.encoding);

    // Clear cache and refresh available files
    this.fileCache.clear();
    this.availableFiles.clear();
  }

  clearCache(): void {
    this.fileCache.clear();
  }

  private validateVariants(variants: VariantContext): void {
    if (!this.options.allowedVariants) {
      throw new Error(
        "Variants not allowed (allowedVariants not configured)"
      );
    }

    if (this.options.allowedVariants === true) {
      // Permissive mode - sanitize values for path safety
      for (const value of Object.values(variants)) {
        if (typeof value !== "string" || /[\/\\]|\.\./.test(value)) {
          throw new Error(
            `Invalid variant value: path traversal detected in '${value}'`
          );
        }
      }
      return;
    }

    // Strict mode - validate against allowed list
    for (const [key, value] of Object.entries(variants)) {
      const allowed = (this.options.allowedVariants as AllowedVariants)[key];
      if (allowed && !allowed.includes(value)) {
        throw new Error(
          `Variant '${key}=${value}' not in allowed list: ${allowed.join(", ")}`
        );
      }
    }
  }

  private parseContent(
    content: string,
    ext: string
  ): Record<string, any> {
    if (ext === ".jsön" || ext === ".json") {
      return JSON.parse(content);
    }
    throw new Error(`Unsupported file extension: ${ext}`);
  }

  private removeExtension(filename: string): string | null {
    for (const ext of this.options.extensions) {
      if (filename.endsWith(ext)) {
        return filename.slice(0, -ext.length);
      }
    }
    return null;
  }
}
