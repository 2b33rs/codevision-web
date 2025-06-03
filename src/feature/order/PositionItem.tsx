"use client";

import { useEffect } from "react";

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

export default function PositionItem({
  form,
  index,
  remove,
}: {
  form: UseFormReturn<OrderForm>;
  index: number;
  remove: UseFieldArrayRemove;
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
                <Input {...field} disabled value="T_SHIRT" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
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
                    {["S", "M", "L", "XL"].map((size) => (
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
                          ? ""
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
                                src={imgUrl}
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
