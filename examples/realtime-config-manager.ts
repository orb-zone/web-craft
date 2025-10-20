/**
 * Real-time Config Manager Example - v2.0
 *
 * Demonstrates a configuration management system with:
 * - Environment-based config
 * - Feature flags
 * - Dynamic config updates
 * - Validation
 */

import { dotted } from "../packages/dotted/src/index.js";

async function main() {
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  Real-time Config Manager Example - @orb-zone/dotted v2.0");
  console.log(
    "═══════════════════════════════════════════════════════════\n"
  );

  // ========================================================================
  // Configuration System
  // ========================================================================

  const env = "production"; // or "development", "staging"

  const config = dotted({
    env,
    ".apiUrl": "https://api.example.com",
    ".apiUrl:development": "http://localhost:3000",
    ".apiUrl:staging": "https://staging.example.com",

    ".debugMode": "false",
    ".debugMode:development": "true",

    ".logLevel": "info",
    ".logLevel:development": "debug",

    ".maxConnections": "100",
    ".maxConnections:development": "10",

    ".cacheEnabled": "true",
    ".cacheTtl": "3600",

    ".features": {
      auth: true,
      payments: true,
      analytics: env === "production",
      betaFeatures: env === "development",
    },

    ".featureStatus":
      "Auth: enabled | Payments: enabled | Beta: disabled",
    ".featureStatus:development":
      "Auth: enabled | Payments: enabled | Beta: enabled",

    ".rateLimits": {
      perMinute: 60,
      perHour: 1000,
      perDay: 10000,
    },

    database: {
      host: "db.example.com",
      port: 5432,
      ".host:development": "localhost",
      ".port:development": 5433,
      pool: 10,
      ".pool:development": 2,
    },

    ".connectionString":
      "postgresql://user:pass@db.example.com:5432/appdb",
    ".connectionString:development":
      "postgresql://dev:dev@localhost:5433/appdb_dev",

    ".isProduction": env === "production",
    ".isDevelopment": env === "development",
  });

  // ========================================================================
  // Example 1: Environment-based Configuration
  // ========================================================================
  console.log("Example 1: Environment-based Configuration\n");

  console.log(`Environment: ${env}`);
  console.log(`API URL: ${await config.get(".apiUrl")}`);
  console.log(`Debug Mode: ${await config.get(".debugMode")}`);
  console.log(`Log Level: ${await config.get(".logLevel")}`);
  console.log(`Max Connections: ${await config.get(".maxConnections")}`);

  // ========================================================================
  // Example 2: Feature Flags
  // ========================================================================
  console.log("\nExample 2: Feature Flags\n");

  const features = await config.get(".features");
  console.log("Feature Flags:", features);
  console.log(`Auth enabled: ${features.auth}`);
  console.log(`Beta features enabled: ${features.betaFeatures}`);

  // ========================================================================
  // Example 3: Database Configuration
  // ========================================================================
  console.log("\nExample 3: Database Configuration\n");

  const dbHost = await config.get("database.host");
  const dbPort = await config.get("database.port");
  const dbPool = await config.get("database.pool");

  console.log(`Database Host: ${dbHost}`);
  console.log(`Database Port: ${dbPort}`);
  console.log(`Connection Pool Size: ${dbPool}`);
  console.log(
    `Connection String: ${await config.get(".connectionString")}`
  );

  // ========================================================================
  // Example 4: Rate Limits
  // ========================================================================
  console.log("\nExample 4: Rate Limiting Configuration\n");

  const limits = await config.get(".rateLimits");
  console.log("Rate Limits:");
  console.log(`  Per Minute: ${limits.perMinute}`);
  console.log(`  Per Hour: ${limits.perHour}`);
  console.log(`  Per Day: ${limits.perDay}`);

  // ========================================================================
  // Example 5: Dynamic Config Updates (simulated)
  // ========================================================================
  console.log("\nExample 5: Config Validation\n");

  // Check if production-safe
  const isProduction = await config.get(".isProduction");
  const isDevelopment = await config.get(".isDevelopment");

  console.log(`Is Production: ${isProduction}`);
  console.log(`Is Development: ${isDevelopment}`);

  const warnings: string[] = [];
  if (isProduction) {
    if (await config.get(".debugMode")) {
      warnings.push("⚠️  Debug mode enabled in production!");
    }
    if (!features.auth) {
      warnings.push("⚠️  Auth is disabled in production!");
    }
  }

  if (warnings.length > 0) {
    console.log("\nConfiguration Warnings:");
    warnings.forEach((w) => console.log(w));
  } else {
    console.log("\n✅ Configuration is valid for environment: " + env);
  }

  // ========================================================================
  // Example 6: Variant-based Feature Toggles
  // ========================================================================
  console.log("\nExample 6: Feature Status\n");

  console.log("Feature Status:", await config.get(".featureStatus"));

  console.log("\n✅ Real-time config manager example finished!");
}

main().catch(console.error);
