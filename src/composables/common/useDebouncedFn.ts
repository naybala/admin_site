import { ref, onBeforeUnmount, Ref } from "vue";

export function useDebouncedFn<
  T extends (...args: any[]) => Promise<void> | void
>(fn: T, delay = 250, loading?: Ref<boolean>) {
  const timer = ref<ReturnType<typeof setTimeout> | null>(null);

  const debounce = (...args: Parameters<T>) => {
    if (timer.value) {
      clearTimeout(timer.value);
    }
    if (loading) {
      loading.value = true;
    }
    timer.value = setTimeout(async () => {
      try {
        console.log("useDebouncedFn is work with - " + delay);
        await fn(...args);
      } catch (e) {
        console.error("[debounced] Error in function", e);
      } finally {
        if (loading) {
          loading.value = false;
        }
      }
    }, delay);
  };

  onBeforeUnmount(() => {
    if (timer.value) clearTimeout(timer.value);
  });

  return debounce;
}
