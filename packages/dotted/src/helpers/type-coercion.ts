export function int(val: unknown): number {
  if (val === null) return 0;
  if (val === undefined) return NaN;
  if (typeof val === "boolean") return val ? 1 : 0;
  if (typeof val === "number") return Math.trunc(val);

  let str: string;
  if (typeof val === "object" && val !== null) {
    str = JSON.stringify(val);
  } else {
    str = String(val as string | number | boolean);
  }

  const result = parseInt(str, 10);

  return result;
}

export function float(val: unknown): number {
  if (val === null) return 0;
  if (val === undefined) return NaN;
  if (typeof val === "boolean") return val ? 1 : 0;
  if (typeof val === "number") return val;

  let str: string;
  if (typeof val === "object" && val !== null) {
    str = JSON.stringify(val);
  } else {
    str = String(val as string | number | boolean);
  }
  const result = parseFloat(str);

  return result;
}

export function bool(val: unknown): boolean {
  if (val === null || val === undefined) return false;

  if (typeof val === "boolean") return val;

  if (typeof val === "number") return val !== 0;

  if (typeof val === "string") {
    const lower = val.toLowerCase().trim();

    if (
      lower === "false" ||
      lower === "no" ||
      lower === "off" ||
      lower === "disabled" ||
      lower === "0"
    ) {
      return false;
    }

    if (
      lower === "true" ||
      lower === "yes" ||
      lower === "on" ||
      lower === "enabled" ||
      lower === "1"
    ) {
      return true;
    }

    if (lower === "") return false;

    return true;
  }

  return Boolean(val);
}

export function json(val: string): unknown {
  try {
    return JSON.parse(val);
  } catch (error) {
    throw new Error(
      `Failed to parse JSON: ${error instanceof Error ? error.message : "Invalid JSON string"}\nInput: ${val.substring(0, 100)}${val.length > 100 ? "..." : ""}`
    );
  }
}

export const typeCoercionHelpers = {
  int,
  float,
  bool,
  json,
};
