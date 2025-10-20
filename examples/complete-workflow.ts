/**
 * Complete Workflow Example - v2.0
 *
 * Demonstrates a real-world workflow combining:
 * - Multiple data sources
 * - Complex expressions
 * - Variants for different contexts
 * - Type coercion
 * - Error handling
 */

import { dotted, int, float, bool } from "../packages/dotted/src/index.js";

async function main() {
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  Complete Workflow Example - @orb-zone/dotted v2.0.0");
  console.log(
    "═══════════════════════════════════════════════════════════\n"
  );

  // ========================================================================
  // Scenario: E-commerce Order Processing System
  // ========================================================================

  // Step 1: User Profile with variants
  console.log("Step 1: User Profile with Localization & Gender");
  const userProfile = dotted({
    lang: "es",
    gender: "f",
    firstName: "María",
    lastName: "García",
    email: "maria@example.com",
    ".fullName": "${firstName} ${lastName}",
    ".greeting": "Hello, ${firstName}!",
    ".greeting:es": "¡Hola, ${firstName}!",
    ".greeting:es:f": "¡Bienvenida, ${firstName}!",
    ".greeting:es:m": "¡Bienvenido, ${firstName}!",
  });

  console.log("Full Name:", await userProfile.get(".fullName"));
  console.log("Greeting:", await userProfile.get(".greeting"));
  console.log("Language:", await userProfile.get("lang"));
  console.log("Gender:", await userProfile.get("gender"));

  // Step 2: Order with pricing calculations
  console.log("\nStep 2: Order Processing with Calculations");
  const items = [
    { name: "Laptop", price: 999.99, quantity: 1 },
    { name: "Mouse", price: 29.99, quantity: 2 },
    { name: "Keyboard", price: 79.99, quantity: 1 },
  ];
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxRate = 0.1;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const order = dotted({
    orderId: "ORD-12345",
    currency: "USD",
    itemCount: items.length,
    subtotal,
    taxRate,
    tax,
    total,
    ".formatted": `USD ${total.toFixed(2)}`,
    ".status": "pending",
    ".estimatedDelivery": "5-7 business days",
  });

  console.log("Order ID:", await order.get("orderId"));
  console.log("Item Count:", await order.get("itemCount"));
  console.log("Subtotal:", await order.get("subtotal"));
  console.log("Tax:", await order.get("tax"));
  console.log("Total:", await order.get("total"));
  console.log("Formatted Total:", await order.get(".formatted"));

  // Step 3: Shipping Address with variants
  console.log("\nStep 3: Shipping with Variants");
  const shipping = dotted({
    country: "Spain",
    carrier: "DHL",
    ".deliveryType": "Standard Shipping",
    ".deliveryType:express": "24-Hour Express",
    ".deliveryType:overnight": "Overnight Delivery",
    ".info": "Shipping via DHL to Spain",
    baseRate: 10.0,
    expressMultiplier: 2.5,
    ".expressRate": (10.0 * 2.5).toFixed(2),
  });

  console.log("Carrier:", await shipping.get("carrier"));
  console.log("Country:", await shipping.get("country"));
  console.log("Delivery Type:", await shipping.get(".deliveryType"));
  console.log("Info:", await shipping.get(".info"));
  console.log("Express Rate:", await shipping.get(".expressRate"));

  // Step 4: Invoice with type coercion
  console.log("\nStep 4: Invoice with Type Coercion");
  const invoice = dotted({
    invoiceNumber: "INV-2025-001",
    issueDate: "2025-10-20",
    dueDate: "2025-11-20",
    amount: 1234.56,
    ".amountInt": "int(${amount})",
    ".amountFloat": "float(${amount})",
    ".isPaid": "false",
    ".isPaidBool": "bool(${.isPaid})",
    ".summary": '{"number": "${invoiceNumber}", "amount": ${amount}}',
  });

  console.log("Invoice Number:", await invoice.get("invoiceNumber"));
  console.log("Amount (original):", await invoice.get("amount"));
  console.log("Amount (int):", await invoice.get(".amountInt"));
  console.log("Amount (float):", await invoice.get(".amountFloat"));
  console.log("Is Paid (bool):", await invoice.get(".isPaidBool"));
  console.log("Summary:", await invoice.get(".summary"));

  // Step 5: Order Summary combining everything
  console.log("\nStep 5: Complete Order Summary");
  const orderData = await order.toJSON();
  const userData = await userProfile.toJSON();
  const statusMessage = `Order ${orderData.orderId} for ${userData.firstName} is being processed`;
  const notification = `📧 Notifying ${userData.email}: "Order #${orderData.orderId} confirmed"`;

  const orderSummary = dotted({
    orderId: orderData.orderId,
    userName: userData.firstName,
    userEmail: userData.email,
    status: "processing",
    ".statusMessage": statusMessage,
    ".notification": notification,
  });

  console.log("Status Message:", await orderSummary.get(".statusMessage"));
  console.log("Notification:", await orderSummary.get(".notification"));

  // Step 6: Error handling in workflow
  console.log("\nStep 6: Error Handling");
  const safeOrder = dotted(
    {
      ".riskyCalculation": "divideByZero(10, 0)",
      ".safeResult": "${.riskyCalculation}",
    },
    {
      fallback: "Calculation unavailable",
      resolvers: {
        divideByZero: () => {
          throw new Error("Cannot divide by zero");
        },
      },
    }
  );

  console.log("Safe Result:", await safeOrder.get(".safeResult"));

  console.log("\n✅ Complete workflow example finished!");
}

main().catch(console.error);
