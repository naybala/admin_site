import { onMounted, onBeforeUnmount, watch } from "vue";

export function useInfiniteScroll(targetRef: any, callback: () => void) {
  let observer: IntersectionObserver | null = null;

  const createObserver = () => {
    if (!targetRef.value) return;

    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          callback();
        }
      },
      { rootMargin: "100px" }
    );
    observer.observe(targetRef.value);
  };

  onMounted(() => {
    createObserver();
  });

  onBeforeUnmount(() => {
    if (observer && targetRef.value) {
      observer.unobserve(targetRef.value);
    }
  });

  // Re-attach when the element ref becomes available
  watch(
    () => targetRef.value,
    () => {
      if (observer && targetRef.value) {
        observer.disconnect();
      }
      createObserver();
    }
  );
}
