/**
 * Settings Form Example - v2.0
 *
 * Demonstrates form validation and data transformation using dotted-json:
 * - Default values
 * - Type coercion
 * - Computed properties
 * - Validation
 */

import { dotted, int, float, bool } from "../packages/dotted/src/index.js";

async function main() {
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  Settings Form Example - @orb-zone/dotted v2.0.0");
  console.log(
    "═══════════════════════════════════════════════════════════\n"
  );

  // ========================================================================
  // User Settings Form
  // ========================================================================

  console.log("User Settings Form\n");

  const userSettings = dotted(
    {
      // Profile Section
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      ".fullName": "${firstName} ${lastName}",

      // Preferences Section
      theme: "dark",
      language: "en",
      ".theme:es": "oscuro",
      ".language:es": "es",
      notifications: {
        email: true,
        push: false,
        sms: true,
        ".summary": "Email: ${email}, Push: ${push}, SMS: ${sms}",
      },

      // Privacy Section
      privacy: {
        profilePublic: false,
        showEmail: false,
        allowTracking: false,
        ".privacyLevel": "strict",
        ".privacyLevel:profilePublic": "moderate",
      },

      // Limits & Quotas
      limits: {
        storageGb: 100,
        uploadLimitMb: 500,
        apiCallsPerDay: 10000,
        ".storageUsagePercent": "45",
        ".storageWarning": "Storage 45% full",
        ".storageWarning:high": "Storage 85% full - upgrade recommended",
      },

      // Experimental
      experimental: {
        betaFeatures: false,
        darkModeV2: false,
      },

      // Timestamp
      lastUpdated: new Date().toISOString(),
    },
    {
      resolvers: {
        formatStorage: (gb: number) => `${gb}GB available`,
        calculateUsage: (used: number, total: number) =>
          ((used / total) * 100).toFixed(1),
      },
    }
  );

  // ========================================================================
  // Example 1: Form Data Display
  // ========================================================================
  console.log("Example 1: Form Data Display\n");

  const fullName = await userSettings.get(".fullName");
  const theme = await userSettings.get("theme");
  const language = await userSettings.get("language");

  console.log(`Name: ${fullName}`);
  console.log(`Theme: ${theme}`);
  console.log(`Language: ${language}`);

  // ========================================================================
  // Example 2: Nested Form Sections
  // ========================================================================
  console.log("\nExample 2: Notification Preferences\n");

  const emailNotif = await userSettings.get("notifications.email");
  const pushNotif = await userSettings.get("notifications.push");
  const smsNotif = await userSettings.get("notifications.sms");

  console.log(`Email Notifications: ${emailNotif ? "✅" : "❌"}`);
  console.log(`Push Notifications: ${pushNotif ? "✅" : "❌"}`);
  console.log(`SMS Notifications: ${smsNotif ? "✅" : "❌"}`);

  // ========================================================================
  // Example 3: Privacy Settings
  // ========================================================================
  console.log("\nExample 3: Privacy Settings\n");

  const profilePublic = await userSettings.get("privacy.profilePublic");
  const showEmail = await userSettings.get("privacy.showEmail");
  const privacyLevel = await userSettings.get("privacy.privacyLevel");

  console.log(`Public Profile: ${profilePublic ? "✅" : "❌"}`);
  console.log(`Show Email: ${showEmail ? "✅" : "❌"}`);
  console.log(`Privacy Level: ${privacyLevel}`);

  // ========================================================================
  // Example 4: Storage & Quotas
  // ========================================================================
  console.log("\nExample 4: Storage & Quotas\n");

  const storage = await userSettings.get("limits.storageGb");
  const uploadLimit = await userSettings.get("limits.uploadLimitMb");
  const apiCalls = await userSettings.get("limits.apiCallsPerDay");
  const storageUsage = await userSettings.get("limits.storageUsagePercent");

  console.log(`Storage Quota: ${storage}GB`);
  console.log(`Upload Limit: ${uploadLimit}MB`);
  console.log(`API Calls/Day: ${apiCalls}`);
  console.log(`Storage Usage: ${storageUsage}%`);
  console.log(`Status: ${await userSettings.get("limits.storageWarning")}`);

  // ========================================================================
  // Example 5: Form Validation
  // ========================================================================
  console.log("\nExample 5: Form Validation\n");

  const validationRules = {
    firstName: (v: string) => v && v.length > 0,
    email: (v: string) => v && v.includes("@"),
    storageGb: (v: number) => v > 0 && v <= 1000,
    apiCallsPerDay: (v: number) => v >= 100 && v <= 1000000,
  };

  const errors: string[] = [];

  const fn = await userSettings.get("firstName");
  if (!validationRules.firstName(fn)) errors.push("First name is required");

  const em = await userSettings.get("email");
  if (!validationRules.email(em)) errors.push("Valid email is required");

  const st = await userSettings.get("limits.storageGb");
  if (!validationRules.storageGb(st))
    errors.push("Storage must be 1-1000 GB");

  const ap = await userSettings.get("limits.apiCallsPerDay");
  if (!validationRules.apiCallsPerDay(ap))
    errors.push("API calls must be 100-1000000");

  if (errors.length === 0) {
    console.log("✅ Form validation passed");
    console.log("All settings are valid");
  } else {
    console.log("❌ Form validation failed:");
    errors.forEach((e) => console.log(`  - ${e}`));
  }

  // ========================================================================
  // Example 6: Settings Update Simulation
  // ========================================================================
  console.log("\nExample 6: Update Settings\n");

  await userSettings.set("theme", "light");
  await userSettings.set("language", "es");
  await userSettings.set("notifications.push", true);
  await userSettings.set("limits.storageGb", 200);

  console.log("Updated theme to:", await userSettings.get("theme"));
  console.log("Updated language to:", await userSettings.get("language"));
  console.log("Push notifications now:", await userSettings.get(
    "notifications.push"
  ));
  console.log("Storage quota now:", await userSettings.get("limits.storageGb"));

  console.log("\n✅ Settings form example finished!");
}

main().catch(console.error);
