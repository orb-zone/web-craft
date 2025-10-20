import { describe, it, expect, beforeEach } from "bun:test";
import { dotted } from "../../src/index.js";
import { withZod, ValidationError } from "../../src/plugins/zod.js";

// Mock Zod for testing since it's a peer dependency
const createMockZod = () => {
  const z = {
    object: (shape: Record<string, any>) => ({
      _type: "object",
      shape,
      safeParse: (value: any) => {
        if (typeof value !== "object" || value === null) {
          return {
            success: false,
            error: { format: () => ({ _errors: ["Not an object"] }) }
          };
        }

        const errors: Record<string, any> = {};
        for (const [key, validator] of Object.entries(shape)) {
          const result = validator.safeParse(value[key]);
          if (!result.success) {
            errors[key] = result.error.format ? result.error.format() : result.error;
          }
        }

        if (Object.keys(errors).length > 0) {
          return {
            success: false,
            error: { format: () => errors }
          };
        }

        return { success: true, data: value };
      }
    }),

    string: () => ({
      _type: "string",
      email: () => ({
        _type: "email",
        safeParse: (value: any) => {
          if (typeof value !== "string") {
            return {
              success: false,
              error: { format: () => ({ _errors: ["Not a string"] }) }
            };
          }
          if (!value.includes("@")) {
            return {
              success: false,
              error: { format: () => ({ _errors: ["Invalid email format"] }) }
            };
          }
          return { success: true, data: value };
        }
      }),
      safeParse: (value: any) => {
        if (typeof value !== "string") {
          return {
            success: false,
            error: { format: () => ({ _errors: ["Not a string"] }) }
          };
        }
        return { success: true, data: value };
      }
    }),

    number: () => ({
      _type: "number",
      safeParse: (value: any) => {
        if (typeof value !== "number") {
          return {
            success: false,
            error: { format: () => ({ _errors: ["Not a number"] }) }
          };
        }
        return { success: true, data: value };
      }
    }),

    enum: (values: string[]) => ({
      _type: "enum",
      values,
      safeParse: (value: any) => {
        if (!values.includes(value)) {
          return {
            success: false,
            error: { format: () => ({ _errors: [`Invalid enum value: ${value}`] }) }
          };
        }
        return { success: true, data: value };
      }
    })
  };

  return z;
};

describe("Zod Integration Plugin", () => {
  let z: any;

  beforeEach(() => {
    z = createMockZod();
  });

  it("validates data at specific paths in strict mode", () => {
    const UserSchema = z.object({
      email: z.string().email(),
      name: z.string()
    });

    const validation = withZod({
      schemas: {
        paths: { "user.profile": UserSchema }
      },
      mode: "strict"
    });

    const validData = { email: "test@example.com", name: "John" };
    const result = validation.validation.validate("user.profile", validData);
    expect(result).toEqual(validData);
  });

  it("throws ValidationError on invalid data in strict mode", () => {
    const UserSchema = z.object({
      email: z.string().email(),
      name: z.string()
    });

    const validation = withZod({
      schemas: {
        paths: { "user.profile": UserSchema }
      },
      mode: "strict"
    });

    const invalidData = { email: "not-an-email", name: "John" };
    expect(() => {
      validation.validation.validate("user.profile", invalidData);
    }).toThrow(ValidationError);
  });

  it("returns data despite validation errors in loose mode", () => {
    const UserSchema = z.object({
      email: z.string().email()
    });

    const errorLogs: string[] = [];
    const originalError = console.error;
    console.error = (...args: any[]) => {
      errorLogs.push(args.join(" "));
    };

    const validation = withZod({
      schemas: {
        paths: { "user.profile": UserSchema }
      },
      mode: "loose"
    });

    const invalidData = { email: "not-an-email" };
    const result = validation.validation.validate("user.profile", invalidData);

    console.error = originalError;

    expect(result).toEqual(invalidData);
    expect(errorLogs.length).toBeGreaterThan(0);
  });

  it("disables validation when mode is 'off'", () => {
    const UserSchema = z.object({
      email: z.string().email()
    });

    const validation = withZod({
      schemas: {
        paths: { "user.profile": UserSchema }
      },
      mode: "off"
    });

    const invalidData = { email: "not-an-email" };
    const result = validation.validation.validate("user.profile", invalidData);

    expect(result).toEqual(invalidData);
    expect(validation.validation.enabled).toBe(false);
  });

  it("uses full schema when provided", () => {
    const FullSchema = z.object({
      name: z.string(),
      age: z.number()
    });

    const validation = withZod({
      schema: FullSchema,
      mode: "strict"
    });

    const validData = { name: "John", age: 30 };
    const result = validation.validation.validate("root", validData);
    expect(result).toEqual(validData);
  });

  it("calls custom error handler when provided", () => {
    const UserSchema = z.object({
      email: z.string().email()
    });

    const errors: Array<{ path: string }> = [];
    const validation = withZod({
      schemas: {
        paths: { "user.profile": UserSchema }
      },
      mode: "loose",
      onError: (error, path) => {
        errors.push({ path });
      }
    });

    const invalidData = { email: "not-an-email" };
    validation.validation.validate("user.profile", invalidData);

    expect(errors.length).toBe(1);
    expect(errors[0].path).toBe("user.profile");
  });

  it("validates multiple paths independently", () => {
    const EmailSchema = z.object({ email: z.string().email() });
    const AgeSchema = z.object({ age: z.number() });

    const validation = withZod({
      schemas: {
        paths: {
          "user.email": EmailSchema,
          "user.age": AgeSchema
        }
      },
      mode: "strict"
    });

    const validEmail = { email: "test@example.com" };
    const validAge = { age: 30 };

    expect(validation.validation.validate("user.email", validEmail)).toEqual(validEmail);
    expect(validation.validation.validate("user.age", validAge)).toEqual(validAge);
  });

  it("handles ValidationError formatting", () => {
    const UserSchema = z.object({
      email: z.string().email()
    });

    const validation = withZod({
      schemas: {
        paths: { "user": UserSchema }
      },
      mode: "strict"
    });

    try {
      validation.validation.validate("user", { email: "invalid" });
    } catch (error) {
      if (error instanceof ValidationError) {
        expect(error.path).toBe("user");
        expect(error.zodError).toBeDefined();
        expect(typeof error.format).toBe("function");
      }
    }
  });

  it("skips validation for unmapped paths", () => {
    const UserSchema = z.object({ name: z.string() });

    const validation = withZod({
      schemas: {
        paths: { "user.profile": UserSchema }
      },
      mode: "strict"
    });

    const anyData = { anything: "goes" };
    const result = validation.validation.validate("unmapped.path", anyData);
    expect(result).toEqual(anyData);
  });

  it("preserves validation state across calls", () => {
    const UserSchema = z.object({ name: z.string() });

    const validation = withZod({
      schemas: {
        paths: { "user": UserSchema }
      },
      mode: "off"
    });

    expect(validation.validation.enabled).toBe(false);

    const invalidData = { name: 123 };
    const result = validation.validation.validate("user", invalidData);

    expect(validation.validation.enabled).toBe(false);
    expect(result).toEqual(invalidData);
  });
});
