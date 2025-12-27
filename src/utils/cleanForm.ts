export function cleanFormData(formData: Record<string, any>) {
  const cleanedData: Record<string, any> = {};
  for (const key in formData) {
    const value = formData[key];
    if (value !== "" && value !== null) {
      cleanedData[key] = value;
    }
  }
  return cleanedData;
}