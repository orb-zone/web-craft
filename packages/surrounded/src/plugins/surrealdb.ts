import { Plugin, DottedValue, DottedObject } from "@orb-zone/dotted";

export interface SurrealDBPluginOptions {
  db: any;
  strict?: boolean;
}

export function withSurrealDB(db: any, options: SurrealDBPluginOptions = {}): Plugin {
  const strict = options.strict ?? false;

  return {
    name: "surrealdb",
    onGet: (path: string, value: DottedValue) => {
      return value;
    },
    onSet: (path: string, value: DottedValue) => {
      return value;
    }
  };
}
