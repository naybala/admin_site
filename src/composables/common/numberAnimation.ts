import { Ref, ref, watch } from "vue";

export function useCountUp(targetValue: number | Ref<number>, duration = 1000) {
  const animatedValue = ref(0);

  watch(
    () => (typeof targetValue === "number" ? targetValue : targetValue.value),
    (newValue, _) => {
      const start = animatedValue.value;
      const startTime = performance.now();
      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        animatedValue.value = Math.floor(start + (newValue - start) * progress);
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    },
    {
      immediate: true,
      flush: "post",
    }
  );

  return animatedValue;
}
