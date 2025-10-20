import { QueryOptions, LiveQueryOptions, QueryResult } from "../types/storage.js";

export interface SurrealDBLoaderOptions {
  database?: string;
  namespace?: string;
}

export class SurrealDBLoader {
  private db: any;
  private options: SurrealDBLoaderOptions;

  constructor(db: any, options: SurrealDBLoaderOptions = {}) {
    this.db = db;
    this.options = options;
  }

  async load(query: string, queryOptions: QueryOptions = {}): Promise<QueryResult> {
    try {
      const result = await this.db.query(query, queryOptions.params ?? {});
      return result;
    } catch (error) {
      throw new Error(`SurrealDB query failed: ${String(error)}`);
    }
  }

  async live(
    query: string,
    queryOptions: LiveQueryOptions = {}
  ): Promise<{ data: any; unsubscribe: () => Promise<void> }> {
    try {
      const result = await this.db.live(query, queryOptions.params ?? {});
      return {
        data: result,
        unsubscribe: async () => {
          await this.db.kill(result.id);
        }
      };
    } catch (error) {
      throw new Error(`SurrealDB live query failed: ${String(error)}`);
    }
  }

  async create(table: string, data: any): Promise<any> {
    return this.db.create(table, data);
  }

  async update(table: string, id: string, data: any): Promise<any> {
    return this.db.update(`${table}:${id}`, data);
  }

  async delete(table: string, id: string): Promise<void> {
    await this.db.delete(`${table}:${id}`);
  }

  async select(table: string): Promise<any[]> {
    return this.db.select(table);
  }
}
