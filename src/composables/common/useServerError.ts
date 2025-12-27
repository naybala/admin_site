import { watch } from "vue";
import { useAppToast } from "./useAppToast";

export function useServerError(error:any){
    const { showError } = useAppToast();
    watch(error, (newVal) => {
      if (newVal) {
        showError(newVal);
      }
    });
    return;
  };
