import * as React from "react";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { FieldPath, FieldValues, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";

export interface FormMoneyProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
  label?: string;
  description?: string;
  className?: string;
  inputClassName?: string;
  mode?: "euro" | "cent";
  disabled?: boolean;
  hidden?: boolean;
  prefix?: React.ReactNode;
  postfix?: React.ReactNode;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

export const FormMoney = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  name,
  label,
  description,
  className,
  inputClassName,
  mode = "cent",
  disabled,
  hidden,
  prefix,
  postfix = "€",
  inputProps,
}: FormMoneyProps<TFieldValues, TName>) => {
  const form = useFormContext<TFieldValues>();

  const useEuro = mode === "euro";

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("w-full", className)} hidden={hidden}>
          {label && <FormLabel>{label}</FormLabel>}
          <div className="relative flex items-center">
            {prefix && (
              <span className="text-muted-foreground absolute left-3">
                {prefix}
              </span>
            )}
            <FormControl>
              <Input
                {...field}
                type="text"
                className={cn(
                  prefix && "pl-8",
                  postfix && "pr-8",
                  inputClassName,
                )}
                value={formatValue(field.value, useEuro)}
                onChange={(e) => {
                  const parsed = parseInput(e.target.value, useEuro);
                  field.onChange(parsed);
                }}
                disabled={disabled}
                {...inputProps}
              />
            </FormControl>
            {postfix && (
              <span
                className={cn(
                  "text-muted-foreground absolute right-3",
                  typeof field.value === "number" && field.value < 0
                    ? "text-red-300"
                    : "",
                )}
              >
                {postfix}
              </span>
            )}
          </div>
          {description && (
            <p className="text-muted-foreground text-sm">{description}</p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

// Anzeigeformat: 1234.5 → "1.234,50"
function formatValue(value: unknown, useEuro: boolean): string {
  const num = typeof value === "number" ? value : parseFloat(String(value));
  if (isNaN(num)) return "";

  return new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(useEuro ? num : num / 100);
}

// Eingabeformat: "1.234,50" → 1234.5 (wenn euro) bzw. 123450 (wenn cent)
function parseInput(input: string, useEuro: boolean): number {
  const normalized = input.replace(/\./g, "").replace(",", ".");
  const parsed = parseFloat(normalized);
  if (isNaN(parsed)) return 0;
  return useEuro ? parsed : Math.round(parsed * 100);
}
