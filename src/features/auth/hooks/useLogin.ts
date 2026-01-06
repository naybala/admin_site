import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useAuthMutations } from "../mutations/useAuthMutations";
import { loginSchema, type LoginFormValues } from "../schema/auth.schema";
import { useAppToast } from "@/composables/common/useAppToast";

export function useLogin() {
  const router = useRouter();
  const { t } = useI18n();
  const { showError } = useAppToast();
  const { loginMutation } = useAuthMutations();

  const form = ref<LoginFormValues>({
    username: "",
    password: "",
  });

  const validationErrors = ref<Record<string, string>>({});

  const validate = () => {
    const result = loginSchema.safeParse(form.value);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        errors[issue.path[0] as string] = issue.message;
      });
      validationErrors.value = errors;
      return false;
    }
    validationErrors.value = {};
    return true;
  };

  const handleLogin = async () => {
    if (!validate()) {
      showError(t("common.error"), t("common.validationError"));
      return false;
    }

    try {
      await loginMutation.mutateAsync(form.value);

      // Wait for animation before redirect
      setTimeout(() => {
        const redirectTo =
          (router.currentRoute.value.query.redirect as string) || "/dashboard";
        router.push(redirectTo);
      }, 900);

      return true;
    } catch (err) {
      return false;
    }
  };

  const loading = computed(() => loginMutation.isPending.value);

  return {
    t,
    form,
    validationErrors,
    handleLogin,
    loading,
  };
}
