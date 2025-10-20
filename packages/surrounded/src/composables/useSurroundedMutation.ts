export function useSurroundedMutation(mutation: string) {
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const execute = async (params: Record<string, any> = {}) => {
    loading.value = true;
    try {
      // TODO: Implement mutation execution
      error.value = null;
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err));
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    execute
  };
}

import { ref } from "vue";
