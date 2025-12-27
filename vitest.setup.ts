import { vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

setActivePinia(createPinia());