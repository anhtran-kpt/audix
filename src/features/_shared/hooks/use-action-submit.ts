import { useTransition } from "react";
import { useRouter } from "next/navigation";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import { applyServerErrors } from "../utils/form-utils";

type FormResult<T = any> =
  | { ok: true; data?: T; redirectTo?: string }
  | { ok: false; fieldErrors?: Record<string, string>; formError?: string };

export function useActionSubmit<TValues extends FieldValues, TData = any>(
  form: UseFormReturn<TValues>,
  action: (input: unknown) => Promise<FormResult<TData>>,
  opts?: {
    onSuccess?: (data: TData | undefined) => void;
    onError?: (msg?: string) => void;
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
      form.reset();
      opts?.onSuccess?.(res.data);
      if (res.redirectTo) router.push(res.redirectTo);
    });
  };

  return { submit, isPending };
}
