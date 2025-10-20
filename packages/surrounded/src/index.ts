export { SurrealDBLoader } from "./loaders/surrealdb.js";
export { withSurrealDB } from "./plugins/surrealdb.js";
export { withPiniaColada } from "./plugins/pinia-colada.js";

export type * from "./types/storage.js";

import * as composables from "./composables/index.js";
export const useComposables = composables;
