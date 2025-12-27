// tests/utils/mountComposable.ts
import { defineComponent, h } from "vue";
import { mount } from "@vue/test-utils";

/**
 * Mounts a composable function inside a dummy component
 * so that lifecycle hooks like onMounted() work properly.
 *
 * @param useComposable - A function that returns the composable setup
 * @returns The result of the composable
 */
export function mountComposable<T>(useComposable: () => T): T {
  let composableReturn: T;

  const TestComponent = defineComponent({
    setup() {
      composableReturn = useComposable();
      return () => h("div");
    },
  });

  mount(TestComponent);

  // Return the composable instance (e.g., { form, save, cancel, ... })
  // @ts-ignore
  return composableReturn!;
}
