"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { CreditSelect } from "./credit-select";
import { CreditRoleEnum } from "../../schemas/album-form.schema";

interface SongCreditSelectorProps {
  name: string;
}

export function SongCreditSelector({ name }: SongCreditSelectorProps) {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: name,
  });

  return (
    <div className="space-y-2 mt-4 border-t pt-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-muted-foreground">
          Credits
        </label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 text-xs"
          onClick={() => append({ role: "PRODUCER", value: { name: "" } })}
        >
          <Plus className="mr-1 h-3 w-3" /> Add Credit
        </Button>
      </div>

      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <div className="w-[120px]">
              <FormField
                control={control}
                name={`${name}.${index}.role`}
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-9 text-xs">
                          <SelectValue placeholder="Role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CreditRoleEnum.options.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex-1">
              <FormField
                control={control}
                name={`${name}.${index}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <CreditSelect
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:text-red-500"
              onClick={() => remove(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
