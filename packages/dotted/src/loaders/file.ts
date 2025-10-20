import { readFile, writeFile, mkdir } from "fs/promises";
import { dirname } from "path";
import { DottedObject } from "../types.js";

export interface FileLoaderOptions {
  encoding?: BufferEncoding;
}

export class FileLoader {
  private encoding: BufferEncoding;

  constructor(options: FileLoaderOptions = {}) {
    this.encoding = options.encoding ?? "utf-8";
  }

  async load(filePath: string): Promise<DottedObject> {
    const content = await readFile(filePath, this.encoding);
    return JSON.parse(content) as DottedObject;
  }

  async save(filePath: string, data: DottedObject): Promise<void> {
    const dir = dirname(filePath);
    await mkdir(dir, { recursive: true });
    const content = JSON.stringify(data, null, 2);
    await writeFile(filePath, content, this.encoding);
  }

  async exists(filePath: string): Promise<boolean> {
    try {
      await readFile(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async loadMultiple(filePaths: string[]): Promise<DottedObject[]> {
    return Promise.all(filePaths.map(fp => this.load(fp)));
  }

  async saveMultiple(
    filePaths: string[],
    dataArray: DottedObject[]
  ): Promise<void> {
    if (filePaths.length !== dataArray.length) {
      throw new Error("filePaths and dataArray must have the same length");
    }
    await Promise.all(
      filePaths.map((fp, i) => this.save(fp, dataArray[i]))
    );
  }
}
