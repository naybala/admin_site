// useImageUpload.ts
import { ref } from "vue";
import { apiRequest } from "./useApi";

type PresignedUrl = { filename: string; key: string; url: string };
type PresignedResponse = { success: boolean; data: PresignedUrl[] };

export const useImageUpload = () => {
  const error = ref<string | null>(null);
  const uploadedKeys = ref<string[]>([]);

  function prepareFormPayload(form: any, includeFields: string[]) {
    const cleanedPayload: Record<string, any> = {};

    for (const field of includeFields) {
      if (field in form) {
        cleanedPayload[field] = form[field];
      }
    }

    // Handle imageFiles separately
    cleanedPayload.imageFiles = (form.imageFiles || []).map((file: File) => ({
      filename: file.name,
      contentType: file.type,
    }));

    return cleanedPayload;
  }

  const uploadImages = async (
    formData: { value: any },
    endpoint: string,
    isComplex = true,
    fieldsToInclude: string[] = []
  ) => {
    error.value = null;
    uploadedKeys.value = [];

    const files: File[] = formData.value.imageFiles || [];
    if (!files.length) return [];

    try {
      const trimmedPayload = isComplex
        ? prepareFormPayload(formData.value, fieldsToInclude)
        : formData.value;

      const response = await apiRequest<PresignedResponse>(endpoint, {
        method: "POST",
        body: JSON.stringify(trimmedPayload),
        headers: { "Content-Type": "application/json" },
      });

      const urls = response.data;
      if (!response.success)
        throw new Error("Validation or URL generation failed");

      for (let i = 0; i < files.length; i++) {
        const res = await fetch(urls[i].url, {
          method: "PUT",
          body: files[i],
          headers: {
            "Content-Type": files[i].type,
            "x-amz-acl": "public-read",
          },
        });
        if (!res.ok) throw new Error(`Upload failed for ${files[i].name}`);
      }

      uploadedKeys.value = urls.map((u) => u.key);
      return uploadedKeys.value;
    } catch (e: any) {
      const resp = e?.responseData;
      if (Array.isArray(resp?.errors)) {
        error.value = resp.errors.map((e: any) => e.message).join(", ");
      } else if (resp?.errors) {
        error.value = Object.values(resp.errors).join("\n");
      } else {
        error.value = resp?.message || e.message || "Unknown upload error";
      }
      console.error("Image Upload Error:", error.value);
      throw e;
    }
  };

  return { uploadImages, uploadedKeys, error };
};
