import { Plugin, DottedValue, DottedObject } from "../types.js";

export interface ZodPluginOptions {
  schema: any;
  strict?: boolean;
}

export function withZod(schema: any, options: ZodPluginOptions = {}): Plugin {
  const strict = options.strict ?? true;

  return {
    name: "zod",
    validate: (data: DottedObject) => {
      try {
        schema.parse(data);
        return true;
      } catch (error) {
        if (strict) {
          throw error;
        }
        return false;
      }
    },
    onGet: (path: string, value: DottedValue) => {
      return value;
    }
  };
}
