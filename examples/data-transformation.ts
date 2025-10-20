/**
 * Data Transformation Example - v2.0
 *
 * Demonstrates data transformation, formatting, and aggregation:
 * - CSV to JSON transformation
 * - Data aggregation
 * - Formatting utilities
 * - Batch processing
 */

import { dotted, int, float } from "../packages/dotted/src/index.js";

async function main() {
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  Data Transformation Example - @orb-zone/dotted v2.0.0");
  console.log(
    "═══════════════════════════════════════════════════════════\n"
  );

  // ========================================================================
  // Example 1: CSV-Like Data Transformation
  // ========================================================================
  console.log("Example 1: CSV Row Transformation\n");

  const csvRow = {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    revenue: "1500.50",
    active: "true",
  };

  const transformedRow = dotted(
    {
      ...csvRow,
      ".id": int(csvRow.id),
      ".revenue": float(csvRow.revenue),
      ".active": csvRow.active === "true",
      ".fullInfo": `${csvRow.name} <${csvRow.email}>`,
      ".status": csvRow.active === "true" ? "Active" : "Inactive",
    },
    {
      resolvers: {
        int,
        float,
      },
    }
  );

  console.log("Original ID (string):", csvRow.id);
  console.log("Transformed ID (int):", await transformedRow.get(".id"));
  console.log("Original Revenue (string):", csvRow.revenue);
  console.log("Transformed Revenue (float):", await transformedRow.get(".revenue"));
  console.log("Active (boolean):", await transformedRow.get(".active"));
  console.log("Full Info:", await transformedRow.get(".fullInfo"));
  console.log("Status:", await transformedRow.get(".status"));

  // ========================================================================
  // Example 2: Data Aggregation
  // ========================================================================
  console.log("\nExample 2: Data Aggregation\n");

  const sales = [
    { product: "Laptop", quantity: 5, price: 1000 },
    { product: "Mouse", quantity: 20, price: 30 },
    { product: "Keyboard", quantity: 15, price: 75 },
    { product: "Monitor", quantity: 8, price: 300 },
  ];

  const aggregation = dotted(
    {
      items: sales.length,
      totalQuantity: sales.reduce((sum, s) => sum + s.quantity, 0),
      totalRevenue: sales.reduce((sum, s) => sum + s.quantity * s.price, 0),
      avgPrice: (sales.reduce((sum, s) => sum + s.price, 0) / sales.length)
        .toFixed(2),
      maxPrice: Math.max(...sales.map((s) => s.price)),
      minPrice: Math.min(...sales.map((s) => s.price)),
      ".summary": `${sales.length} products, ${sales.reduce((sum, s) => sum + s.quantity, 0)} total units`,
      ".revenue": `$${(sales.reduce((sum, s) => sum + s.quantity * s.price, 0)).toFixed(2)}`,
    },
    {}
  );

  console.log("Product Count:", await aggregation.get("items"));
  console.log("Total Quantity:", await aggregation.get("totalQuantity"));
  console.log("Total Revenue:", await aggregation.get(".revenue"));
  console.log("Average Price:", await aggregation.get("avgPrice"));
  console.log("Price Range:", `$${await aggregation.get("minPrice")} - $${await aggregation.get("maxPrice")}`);
  console.log("Summary:", await aggregation.get(".summary"));

  // ========================================================================
  // Example 3: Batch Record Transformation
  // ========================================================================
  console.log("\nExample 3: Batch Processing\n");

  const records = [
    { name: "Alice", score: "85.5", grade: "" },
    { name: "Bob", score: "92.3", grade: "" },
    { name: "Charlie", score: "78.1", grade: "" },
  ];

  const gradeMapping = (score: number) => {
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    return "D";
  };

  console.log("Transformed Records:");
  for (const record of records) {
    const transformed = dotted({
      name: record.name,
      score: parseFloat(record.score),
      ".grade": gradeMapping(parseFloat(record.score)),
      ".display": `${record.name}: ${record.score} (${gradeMapping(parseFloat(record.score))})`,
    });

    console.log(`  ${await transformed.get(".display")}`);
  }

  // ========================================================================
  // Example 4: Nested Structure Transformation
  // ========================================================================
  console.log("\nExample 4: Nested Structure Transformation\n");

  const company = {
    name: "TechCorp",
    employees: [
      {
        id: 1,
        name: "Alice",
        dept: "Engineering",
        salary: "120000",
        active: true,
      },
      {
        id: 2,
        name: "Bob",
        dept: "Sales",
        salary: "80000",
        active: true,
      },
      {
        id: 3,
        name: "Charlie",
        dept: "Engineering",
        salary: "110000",
        active: false,
      },
    ],
  };

  const companyData = dotted({
    name: company.name,
    totalEmployees: company.employees.length,
    activeEmployees: company.employees.filter((e) => e.active).length,
    ".avgSalary": (
      company.employees.reduce((sum, e) => sum + parseInt(e.salary), 0) /
      company.employees.length
    ).toFixed(2),
    ".departmentCount": new Set(company.employees.map((e) => e.dept)).size,
    ".activeRate": (
      (company.employees.filter((e) => e.active).length /
        company.employees.length) *
      100
    ).toFixed(1),
    ".summary": `${company.name}: ${company.employees.length} employees, ${company.employees.filter((e) => e.active).length} active`,
  });

  console.log("Company:", await companyData.get("name"));
  console.log("Total Employees:", await companyData.get("totalEmployees"));
  console.log("Active Employees:", await companyData.get("activeEmployees"));
  console.log("Average Salary:", await companyData.get(".avgSalary"));
  console.log("Departments:", await companyData.get(".departmentCount"));
  console.log("Active Rate:", `${await companyData.get(".activeRate")}%`);
  console.log("Summary:", await companyData.get(".summary"));

  console.log("\n✅ Data transformation example finished!");
}

main().catch(console.error);
