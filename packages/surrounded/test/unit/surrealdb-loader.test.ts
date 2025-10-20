import { describe, it, expect, mock } from "bun:test";
import { SurrealDBLoader } from "../../src/loaders/surrealdb.js";

describe("SurrealDBLoader", () => {
  it("should execute a query", async () => {
    const mockDb = {
      query: mock(async () => [{ id: "1", name: "Alice" }])
    };

    const loader = new SurrealDBLoader(mockDb);
    const result = await loader.load("SELECT * FROM users");

    expect(result).toEqual([{ id: "1", name: "Alice" }]);
  });

  it("should select from a table", async () => {
    const mockDb = {
      select: mock(async () => [{ id: "1", name: "Alice" }])
    };

    const loader = new SurrealDBLoader(mockDb);
    const result = await loader.select("users");

    expect(result).toEqual([{ id: "1", name: "Alice" }]);
  });

  it("should handle query errors", async () => {
    const mockDb = {
      query: mock(async () => {
        throw new Error("Connection failed");
      })
    };

    const loader = new SurrealDBLoader(mockDb);

    try {
      await loader.load("SELECT * FROM users");
      expect.unreachable();
    } catch (error) {
      expect(String(error)).toContain("SurrealDB query failed");
    }
  });
});
