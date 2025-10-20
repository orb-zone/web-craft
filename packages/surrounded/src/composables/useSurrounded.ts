import { ref, computed, Ref } from "vue";
import type { SurrealDBLoader } from "../loaders/surrealdb.js";

export interface UseSurroundedOptions {
  immediate?: boolean;
  filters?: Record<string, any>;
  cache?: boolean;
}

export interface UseSurroundedReturn {
  data: Ref<any[]>;
  loading: Ref<boolean>;
  error: Ref<Error | null>;
  refetch: () => Promise<void>;
  count: Ref<number>;
}

export function useSurrounded(
  loader: SurrealDBLoader,
  table: string,
  options: UseSurroundedOptions = {}
): UseSurroundedReturn {
  const data = ref<any[]>([]);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const refetch = async () => {
    loading.value = true;
    error.value = null;
    try {
      const results = await loader.select(table);
      data.value = Array.isArray(results) ? results : [results];
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err));
      data.value = [];
    } finally {
      loading.value = false;
    }
  };

  const count = computed(() => data.value.length);

  if (options.immediate !== false) {
    refetch();
  }

  return {
    data,
    loading,
    error,
    refetch,
    count
  };
}
