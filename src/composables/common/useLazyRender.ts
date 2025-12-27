import { ref, computed, type Ref } from "vue";

export function useLazyRender<T>(items: Ref<T[]>, limit: Ref<number>) {
  const LAZY_BATCH_SIZE = 30;
  const LAZY_TOTAL_ITEMS = 500;

  const currentRenderPage = ref(1);
  const isLazyRendering = computed(() => limit.value > LAZY_TOTAL_ITEMS);

  const displayedItems = computed(() => {
    return isLazyRendering.value
      ? items.value.slice(0, currentRenderPage.value * LAZY_BATCH_SIZE)
      : items.value;
  });

  const hasMoreToRender = computed(() => {
    return (
      isLazyRendering.value && displayedItems.value.length < items.value.length
    );
  });

  const isRenderingMore = ref(false);

  const loadMoreItems = async () => {
    if (!hasMoreToRender.value || isRenderingMore.value) return;
    isRenderingMore.value = true;

    // Optional delay for UX or testing
    await new Promise((resolve) => setTimeout(resolve, 300));

    currentRenderPage.value += 1;
    isRenderingMore.value = false;
  };

  return {
    displayedItems,
    hasMoreToRender,
    isRenderingMore,
    loadMoreItems,
    currentRenderPage,
  };
}
