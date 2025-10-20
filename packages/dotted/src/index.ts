import { DottedJson } from "./dotted-json.js";

export { DottedJson } from "./dotted-json.js";
export { ExpressionEvaluator, createExpressionEvaluator } from "./expression-evaluator.js";
export { VariantResolver } from "./variant-resolver.js";
export { FileLoader } from "./loaders/file.js";

export type * from "./types.js";
export type * from "./loaders/file.js";

export {
  resolvePronoun,
  isPronounPlaceholder,
  extractPronounForm,
  PRONOUNS,
  type Gender,
  type PronounForm,
} from "./pronouns.js";

export { int, float, bool, json, typeCoercionHelpers } from "./helpers/type-coercion.js";

export function dotted(
  data: Record<string, any> = {},
  options?: any
): DottedJson {
  return new DottedJson(data, options);
}
