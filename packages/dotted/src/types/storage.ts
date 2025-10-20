import { DottedObject } from "../types.js";

export interface StorageProvider {
  load(path: string): Promise<DottedObject>;
  save(path: string, data: DottedObject): Promise<void>;
  exists(path: string): Promise<boolean>;
}

export class InMemoryStorage implements StorageProvider {
  private store: Map<string, DottedObject> = new Map();

  async load(path: string): Promise<DottedObject> {
    const data = this.store.get(path);
    if (!data) {
      throw new Error(`Not found: ${path}`);
    }
    return structuredClone(data);
  }

  async save(path: string, data: DottedObject): Promise<void> {
    this.store.set(path, structuredClone(data));
  }

  async exists(path: string): Promise<boolean> {
    return this.store.has(path);
  }

  clear(): void {
    this.store.clear();
  }

  size(): number {
    return this.store.size;
  }
}
