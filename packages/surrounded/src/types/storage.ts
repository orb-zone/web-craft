import { DottedObject } from "@orb-zone/dotted";

export interface SurrealDBConfig {
  namespace?: string;
  database?: string;
  auth?: {
    username: string;
    password: string;
  };
}

export interface QueryOptions {
  params?: Record<string, any>;
  timeout?: number;
}

export interface LiveQueryOptions extends QueryOptions {
  autoReconnect?: boolean;
}

export interface SurrealRecord {
  id?: string;
  [key: string]: any;
}

export type QueryResult = SurrealRecord[] | SurrealRecord | null;
