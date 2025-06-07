"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CMYKColorField } from "@/components/CMYKColorField.tsx";
import { Row } from "@/common/flex/Flex.tsx";
import { Image as ImageIcon, Trash } from "lucide-react";
import { productApi } from "@/api/endpoints/productApi.ts";
import { UseFieldArrayRemove, UseFormReturn } from "react-hook-form";
import { OrderForm } from "@/models/order.ts";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";

export default function PositionItem({
  form,
  index,
  remove,
  groessen,
  typen,
}: {
  form: UseFormReturn<OrderForm>;
  index: number;
  remove: UseFieldArrayRemove;
  groessen: string[];
  typen: string[];
}) {
  const { data: products } = productApi.useListProductsQuery({});

  const handleProductSelect = (productId: string) => {
    const selected = products?.find((p) => p.id === productId);
    if (!selected) return;

    form.setValue(`positions.${index}.color`, selected.color);
    form.setValue(
      `positions.${index}.productCategory`,
      selected.productCategory,
    );
    form.setValue(`positions.${index}.typ`, selected.typ);
    form.setValue(`positions.${index}.shirtSize`, selected.shirtSize ?? "M");
    form.setValue(`positions.${index}.name`, selected.name);
    form.setValue(
      `positions.${index}.standardProductId`,
      selected.id || undefined,
    );
  };

  useEffect(() => {
    form.setValue(`positions.${index}.pos_number`, index + 1);
  }, [index, form, form.setValue]);

  return (
    <div className="border-muted space-y-4 rounded-md border p-4">
      <Row className="justify-between">
        <span className="font-semibold">Position {index + 1}</span>
        <Button
          type="button"
          size="icon"
          variant={"ghost"}
          onClick={() => remove(index)}
        >
          <Trash />
        </Button>
      </Row>
      <FormField
        control={form.control}
        name={`positions.${index}.pos_number`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input type="number" disabled hidden {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2 gap-4">
        <FormItem className="">
          <Select onValueChange={handleProductSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Aus Standardprodukt übernehmen" />
            </SelectTrigger>
            <SelectContent>
              {products?.map((prod) => (
                <SelectItem key={prod.id} value={prod.id}>
                  <CMYKColorField value={prod.color ?? ""} disabled />
                  {prod.shirtSize} - {prod.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
        <FormField
          control={form.control}
          name={`positions.${index}.productCategory`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`positions.${index}.price`}
          render={({ field }) => {
            const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
              // Nur Ziffern extrahieren
              const digitsOnly = e.target.value.replace(/\D/g, "");

              // Pad mit führenden Nullen (mind. 3 Stellen)
              const padded = digitsOnly.padStart(3, "0");

              // Letzte zwei Ziffern = Nachkommastellen
              const intPart = padded.slice(0, -2);
              const fracPart = padded.slice(-2);

              // Anzeige-Format z. B. "12,34"
              const display = `${parseInt(intPart, 10)},${fracPart}`;

              // Float-Wert im Hintergrund z. B. 12.34
              const floatValue = parseFloat(`${intPart}.${fracPart}`);

              field.onChange(floatValue);
              setDisplayValue(display);
            };

            const [displayValue, setDisplayValue] = useState(
              (field.value ?? 0).toFixed(2).replace(".", ","),
            );

            return (
              <FormItem className="relative">
                <FormLabel className="text-muted-foreground pointer-events-none absolute top-1 left-3 text-xs">
                  Preis
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="pt-5"
                    value={displayValue}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name={`positions.${index}.amount`}
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel className="text-muted-foreground pointer-events-none absolute top-1 left-3 text-xs">
                Menge
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  className="pt-5"
                  min={0}
                  value={field.value}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    field.onChange(isNaN(value) ? 0 : Math.max(0, value));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`positions.${index}.shirtSize`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Größe auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {groessen.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`positions.${index}.typ`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Typ auswählen</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(val) => field.onChange([val])}
                  value={field.value?.[0] ?? ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Typ auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {typen.map((typ) => (
                      <SelectItem key={typ} value={typ}>
                        {typ}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`positions.${index}.design`}
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Motiv auswählen</FormLabel>
              <div className="flex items-center gap-2">
                <FormControl>
                  <>
                    <Input
                      type="url"
                      placeholder="https://..."
                      {...field}
                      className="w-full"
                      hidden
                    />

                    <div className="grid grid-cols-10 gap-2">
                      {[...Array(10)].map((_, i) => {
                        const isReset = i === 0;
                        const imgUrl = isReset
                          ? undefined
                          : `https://picsum.photos/seed/${i + 1}/100/100`;
                        const isSelected = field.value === imgUrl;

                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => field.onChange(imgUrl)}
                            className={`flex items-center justify-center overflow-hidden rounded ring-offset-2 transition-all focus:outline-none ${
                              isSelected
                                ? "ring-primary ring-2"
                                : "hover:ring-muted hover:ring-2"
                            }`}
                            title={
                              isReset
                                ? "Kein Motiv auswählen"
                                : `Motiv ${i + 1}`
                            }
                          >
                            {isReset ? (
                              <div className="text-muted-foreground flex h-[100px] w-[100px] flex-col items-center justify-center">
                                <ImageIcon className="mb-1 h-5 w-5" />
                                <span className="px-1 text-center text-xs">
                                  Kein&nbsp;Motiv
                                </span>
                              </div>
                            ) : (
                              <img
                                src={imgUrl ?? ""}
                                alt={`Motiv ${i + 1}`}
                                width={100}
                                height={100}
                                className="object-cover"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </>
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`positions.${index}.color`}
          render={({ field }) => (
            <FormItem className={"col-span-2"}>
              <FormControl>
                <CMYKColorField {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
