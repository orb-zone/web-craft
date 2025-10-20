import type { DottedObject, DottedValue, ValidationOptions } from "../types.js";

type ZodType = any;
type ZodError = any;

export interface ZodSchemas {
  paths?: Record<string, ZodType>;
  resolvers?: Record<string, {
    input?: ZodType;
    output?: ZodType;
  }>;
}

export interface ZodOptions {
  schemas?: ZodSchemas;
  schema?: ZodType;
  mode?: 'strict' | 'loose' | 'off';
  onError?: (error: ZodError, path: string) => void;
}

export class ValidationError extends Error {
  constructor(
    public path: string,
    public zodError: ZodError
  ) {
    super(`Validation failed at ${path}`);
    this.name = 'ValidationError';
  }

  format(): Record<string, any> {
    return this.zodError.format();
  }
}

export function withZod(options: ZodOptions): { validation: ValidationOptions } {
  const {
    schemas,
    schema: fullSchema,
    mode = 'strict',
    onError
  } = options;

  const pathValidators = new Map<string, ZodType>();
  if (schemas?.paths) {
    Object.entries(schemas.paths).forEach(([path, schema]) => {
      pathValidators.set(path, schema);
    });
  }

  const resolverValidators = new Map<string, {
    input?: ZodType;
    output?: ZodType;
  }>();
  if (schemas?.resolvers) {
    Object.entries(schemas.resolvers).forEach(([name, validators]) => {
      resolverValidators.set(name, validators);
    });
  }

  function validate(path: string, value: any): any {
    if (mode === 'off') {
      return value;
    }

    const pathValidator = pathValidators.get(path);
    if (pathValidator) {
      return validateWithSchema(pathValidator, value, path);
    }

    if (fullSchema) {
      return validateWithSchema(fullSchema, value, path);
    }

    return value;
  }

  function validateResolver(name: string, input: any[], output: any): any {
    if (mode === 'off') {
      return output;
    }

    const validators = resolverValidators.get(name);
    if (!validators) {
      return output;
    }

    if (validators.input) {
      const inputResult = validators.input.safeParse(input);
      if (!inputResult.success) {
        handleValidationError(inputResult.error, `${name}(input)`);
      }
    }

    if (validators.output) {
      return validateWithSchema(validators.output, output, `${name}(output)`);
    }

    return output;
  }

  function validateWithSchema(schema: ZodType, value: any, path: string): any {
    const result = schema.safeParse(value);

    if (!result.success) {
      handleValidationError(result.error, path);

      if (mode === 'loose') {
        return value;
      }

      throw new ValidationError(path, result.error);
    }

    return result.data;
  }

  function handleValidationError(error: ZodError, path: string): void {
    if (onError) {
      onError(error, path);
    } else {
      console.error(`[dotted-json] Validation error at ${path}:`, error.format());
    }
  }

  return {
    validation: {
      enabled: mode !== 'off',
      validate,
      validateResolver
    }
  };
}
