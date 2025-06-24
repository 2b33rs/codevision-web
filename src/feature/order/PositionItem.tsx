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
import { UseFieldArrayRemove, UseFormReturn, useWatch } from "react-hook-form";
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
    const watchedPosition = useWatch({
        control: form.control,
        name: `positions.${index}`,
    });

    const handleProductSelect = (productId: string) => {
        const selected = products?.find((p) => p.id === productId);
        if (!selected) return;

        form.setValue(`positions.${index}.isFromTemplate`, true);
        form.setValue(`positions.${index}.color`, selected.color);
        form.setValue(`positions.${index}.productCategory`, selected.productCategory);
        form.setValue(`positions.${index}.typ`, selected.typ);
        form.setValue(`positions.${index}.shirtSize`, selected.shirtSize ?? "M");
        form.setValue(`positions.${index}.name`, selected.name);
        form.setValue(`positions.${index}.standardProductId`, selected.id || undefined);
        form.setValue(`positions.${index}.design`, "");
    };

    useEffect(() => {
        form.setValue(`positions.${index}.pos_number`, index + 1);
    }, [index, form]);

    // Dynamisches Zurücksetzen oder Wiederherstellen des Namens je nach Änderungen
    useEffect(() => {
        const {
            isFromTemplate,
            name,
            design,
            color,
            shirtSize,
            typ,
            standardProductId,
        } = watchedPosition ?? {};

        if (!standardProductId) return;

        const template = products?.find((p) => p.id === standardProductId);
        if (!template) return;

        const templateSize = template.shirtSize ?? "M";
        const templateTyp = template.typ ?? [];

        const isIdentical =
            design === "" &&
            color === template.color &&
            (shirtSize ?? "M") === templateSize &&
            JSON.stringify(typ) === JSON.stringify(templateTyp);

        if (isIdentical) {
            if (name !== template.name) {
                form.setValue(`positions.${index}.name`, template.name);
                form.setValue(`positions.${index}.isFromTemplate`, true);
            }
        } else {
            if (isFromTemplate) {
                form.setValue(`positions.${index}.name`, "");
                form.setValue(`positions.${index}.isFromTemplate`, false);
            }
        }
    }, [watchedPosition, index, form, products]);

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
                <FormItem>
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
                            const digitsOnly = e.target.value.replace(/\D/g, "");
                            const padded = digitsOnly.padStart(3, "0");
                            const intPart = padded.slice(0, -2);
                            const fracPart = padded.slice(-2);
                            const display = `${parseInt(intPart, 10)},${fracPart}`;
                            const stringValue = `${parseInt(intPart, 10)}.${fracPart}`;
                            field.onChange(stringValue);
                            setDisplayValue(display);
                        };

                        const [displayValue, setDisplayValue] = useState(
                            field.value ? String(field.value).replace(".", ",") : "0,00"
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
                                    value={field.value === 0 ? "0" : field.value.toString()}
                                    onChange={(e) => {
                                        let val = e.target.value;
                                        if (val === "") {
                                            field.onChange(0);
                                            return;
                                        }
                                        val = val.replace(/^0+/, "");
                                        const parsed = parseInt(val, 10);
                                        field.onChange(isNaN(parsed) ? 0 : parsed);
                                    }}
                                    onBlur={(e) => {
                                        if (e.target.value.trim() === "") {
                                            field.onChange(0);
                                        }
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
                                <Select
                                    onValueChange={(val) => field.onChange(val)}
                                    value={field.value}
                                >
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
                                        <Input type="url" hidden {...field} />
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
                        <FormItem className="col-span-2">
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
