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
import { Trash } from "lucide-react";
import { productApi } from "@/api/endpoints/productApi.ts";
import { UseFieldArrayRemove, UseFormReturn } from "react-hook-form";
import { OrderForm } from "@/models/order.ts";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";

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
    form.setValue(`positions.${index}.design`, selected.name);
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
                <Input type="number" className="pt-5" {...field} />
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
