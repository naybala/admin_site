export function handleFastLoading(loading: any, delay?: number): Promise<void> {
  const timeout = Number(delay ?? import.meta.env.VITE_APP_FAST_LOADING);

  return new Promise((resolve) => {
    if (timeout && !isNaN(timeout)) {
      console.log(timeout);
      setTimeout(() => {
        console.log(loading.value, "loading finished");
        loading.value = false;
        resolve();
      }, timeout);
    } else {
      loading.value = false;
      resolve();
    }
  });
}
