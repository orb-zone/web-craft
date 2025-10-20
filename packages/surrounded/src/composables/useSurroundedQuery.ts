import { ref, Ref } from "vue";
import type { SurrealDBLoader } from "../loaders/surrealdb.js";

export interface UseSurroundedQueryOptions {
  params?: Record<string, any>;
  immediate?: boolean;
}

export interface UseSurroundedQueryReturn {
  data: Ref<any>;
  loading: Ref<boolean>;
  error: Ref<Error | null>;
  execute: () => Promise<any>;
}

export function useSurroundedQuery(
  loader: SurrealDBLoader,
  query: string,
  options: UseSurroundedQueryOptions = {}
): UseSurroundedQueryReturn {
  const data = ref<any>(null);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const execute = async () => {
    loading.value = true;
    error.value = null;
    try {
      const result = await loader.load(query, {
        params: options.params
      });
      data.value = result;
      return result;
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err));
      data.value = null;
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  if (options.immediate !== false) {
    execute().catch(() => {
      // Error already stored in error.value
    });
  }

  return {
    data,
    loading,
    error,
    execute
  };
}
