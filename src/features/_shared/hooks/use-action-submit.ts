import { useTransition } from "react";
import { useRouter } from "next/navigation";
import type { FieldValues, UseFormReturn, Path } from "react-hook-form";

type FormResult<T = any> =
  | { ok: true; data?: T; redirectTo?: string }
  | { ok: false; fieldErrors?: Record<string, string>; formError?: string };

function applyServerErrors<T extends FieldValues>(
  form: UseFormReturn<T>,
  fieldErrors?: Record<string, string>
) {
  if (!fieldErrors) return;
  for (const [name, message] of Object.entries(fieldErrors)) {
    form.setError(name as Path<T>, { type: "server", message });
  }
}

export function useActionSubmit<TValues extends FieldValues, TData = any>(
  form: UseFormReturn<TValues>,
  action: (input: unknown) => Promise<FormResult<TData>>,
  opts?: {
    onSuccess?: (ctx: {
      data?: TData;
      values: TValues;
    }) => void | Promise<void>;
    onError?: (msg?: string) => void;
    resetOnSuccess?: boolean;
  }
) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const submit = (values: TValues) => {
    startTransition(async () => {
      const res = await action(values);
      if (!res.ok) {
        applyServerErrors(form, res.fieldErrors);
        opts?.onError?.(res.formError);
        return;
      }

      await opts?.onSuccess?.({ data: res.data, values });
      if (opts?.resetOnSuccess ?? true) form.reset();
      if (res.redirectTo) router.push(res.redirectTo);
    });
  };

  return { submit, isPending };
}
