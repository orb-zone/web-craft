import { ref, Ref } from "vue";
import type { SurrealDBLoader } from "../loaders/surrealdb.js";

export interface UseSurroundedMutationOptions {
  immediate?: boolean;
}

export interface UseSurroundedMutationReturn {
  data: Ref<any>;
  loading: Ref<boolean>;
  error: Ref<Error | null>;
  execute: (params?: Record<string, any>) => Promise<any>;
}

export function useSurroundedMutation(
  loader: SurrealDBLoader,
  mutation: string,
  options: UseSurroundedMutationOptions = {}
): UseSurroundedMutationReturn {
  const data = ref<any>(null);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const execute = async (params: Record<string, any> = {}) => {
    loading.value = true;
    error.value = null;
    try {
      const result = await loader.load(mutation, { params });
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

  return {
    data,
    loading,
    error,
    execute
  };
}
