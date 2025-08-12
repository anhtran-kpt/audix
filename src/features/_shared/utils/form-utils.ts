import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

export function applyServerErrors<T extends FieldValues>(
  form: UseFormReturn<T>,
  fieldErrors?: Record<string, string>
) {
  if (!fieldErrors) return;
  for (const [name, message] of Object.entries(fieldErrors)) {
    form.setError(name as Path<T>, { type: "server", message });
  }
}
