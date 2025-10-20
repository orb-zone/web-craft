import { dotted } from "../packages/dotted/src/index.js";
import { withZod, ValidationError } from "../packages/dotted/src/plugins/zod.js";

// Mock Zod for demonstration (in real code, use actual zod package)
const z = {
  object: (shape: Record<string, any>) => ({
    safeParse: (value: any) => {
      const errors: Record<string, any> = {};
      for (const [key, validator] of Object.entries(shape)) {
        const result = validator.safeParse(value[key]);
        if (!result.success) {
          errors[key] = result.error.message || result.error._errors?.[0] || "Invalid";
        }
      }
      return Object.keys(errors).length > 0
        ? { success: false, error: { format: () => errors } }
        : { success: true, data: value };
    }
  }),
  string: () => ({
    email: () => ({
      safeParse: (value: any) =>
        typeof value === "string" && value.includes("@")
          ? { success: true, data: value }
          : { success: false, error: { _errors: ["Invalid email"] } }
    }),
    safeParse: (value: any) =>
      typeof value === "string"
        ? { success: true, data: value }
        : { success: false, error: { _errors: ["Not a string"] } }
  }),
  number: () => ({
    safeParse: (value: any) =>
      typeof value === "number"
        ? { success: true, data: value }
        : { success: false, error: { _errors: ["Not a number"] } }
  }),
  boolean: () => ({
    safeParse: (value: any) =>
      typeof value === "boolean"
        ? { success: true, data: value }
        : { success: false, error: { _errors: ["Not a boolean"] } }
  })
};

// ============================================================================
// Example 1: Strict Mode Validation
// ============================================================================
console.log("📋 Example 1: Strict Mode Validation\n");

const UserSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  isActive: z.boolean()
});

const userData = {
  email: "john@example.com",
  name: "John Doe",
  isActive: true,
  ".status": "Premium"
};

try {
  const data = dotted(userData, {
    ...withZod({
      schemas: {
        paths: {
          ".": UserSchema // Validate root object
        }
      },
      mode: "strict" // Throw on validation errors
    })
  });

  console.log("✅ Valid user data loaded");
  console.log("Email:", await data.get("email"));
  console.log("Name:", await data.get("name"));
  console.log("Active:", await data.get("isActive"));
} catch (error) {
  if (error instanceof ValidationError) {
    console.log("❌ Validation failed at:", error.path);
    console.log("Errors:", error.format());
  }
}

// ============================================================================
// Example 2: Loose Mode (Logs But Continues)
// ============================================================================
console.log("\n📋 Example 2: Loose Mode Validation\n");

const invalidUserData = {
  email: "not-an-email",
  name: "Jane Doe",
  isActive: true
};

const data2 = dotted(invalidUserData, {
  ...withZod({
    schemas: {
      paths: {
        ".": UserSchema
      }
    },
    mode: "loose", // Log errors but continue
    onError: (error, path) => {
      console.log(`⚠️ Validation warning at ${path}:`, error.format?.() || error);
    }
  })
});

console.log("✅ Data loaded despite validation warning");
console.log("Email:", await data2.get("email"));

// ============================================================================
// Example 3: Path-Specific Validation
// ============================================================================
console.log("\n📋 Example 3: Path-Specific Validation\n");

const PaymentSchema = z.object({
  amount: z.number(),
  currency: z.string(),
  status: z.string()
});

const OrderSchema = z.object({
  orderId: z.string(),
  customerId: z.string()
});

const orderData = {
  ".orderId": "123",
  ".customerId": "456",
  ".payment.amount": 99.99,
  ".payment.currency": "USD",
  ".payment.status": "completed",
  ".items.0": "Product A",
  ".items.1": "Product B"
};

const data3 = dotted(orderData, {
  ...withZod({
    schemas: {
      paths: {
        ".orderId": OrderSchema,
        ".payment": PaymentSchema
      }
    },
    mode: "loose"
  })
});

console.log("✅ Order with path-specific validation loaded");
console.log("Order ID:", await data3.get(".orderId"));
console.log("Payment:", await data3.get(".payment"));

// ============================================================================
// Example 4: Custom Error Handler
// ============================================================================
console.log("\n📋 Example 4: Custom Error Handler\n");

const errors: Array<{ path: string; fields: string[] }> = [];

const data4 = dotted(
  {
    ".user.email": "bad-email",
    ".user.name": "Test"
  },
  {
    ...withZod({
      schemas: {
        paths: {
          ".user": UserSchema
        }
      },
      mode: "loose",
      onError: (error, path) => {
        const formatted = error.format?.();
        const fields = Object.keys(formatted || {});
        errors.push({ path, fields });
        console.log(`🔔 Custom handler - Path: ${path}, Invalid fields: ${fields.join(", ")}`);
      }
    })
  }
);

console.log(`✅ Captured ${errors.length} validation error(s)`);

// ============================================================================
// Example 5: Off Mode (No Validation)
// ============================================================================
console.log("\n📋 Example 5: Off Mode (No Validation)\n");

const data5 = dotted(
  {
    ".email": "not-valid",
    ".age": "thirty"
  },
  {
    ...withZod({
      schemas: {
        paths: {
          ".": UserSchema
        }
      },
      mode: "off" // Validation disabled
    })
  }
);

console.log("✅ Validation disabled - data loaded as-is");
console.log("Email:", await data5.get("email"));

console.log("\n✨ Zod schema validation examples complete!");
