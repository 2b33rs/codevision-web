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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Image as ImageIcon } from "lucide-react";

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
        form.setValue(`positions.${index}.productCategory`, selected.productCategory);
        form.setValue(`positions.${index}.shirtSize`, selected.shirtSize ?? "M");
        form.setValue(`positions.${index}.name`, selected.name);
        form.setValue(`positions.${index}.design`, selected.name);
        form.setValue(`positions.${index}.standardProductId`, selected.id || undefined);
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
                  <Input
                    type="url"
                    placeholder="https://..."
                    {...field}
                    className="w-full"
                  />
                </FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button type="button" variant="outline" size="icon">
                      <ImageIcon className="w-4 h-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="grid grid-cols-3 gap-2 max-w-[300px]">
                    {[...Array(12)].map((_, i) => {
                      const imgUrl = `https://picsum.photos/seed/${i+1}/100/100`;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => field.onChange(imgUrl)}
                          className="focus:outline-none focus:ring-2 ring-ring rounded"
                        >
                          <img
                            src={imgUrl}
                            alt={`Motiv ${i}`}
                            width={200}
                            height={200}
                            className="rounded object-cover"
                          />

                        </button>
                      );
                    })}
                  </PopoverContent>
                </Popover>
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
