"use client";

import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({
    customer: z.string().optional(),
    position: z.array(
        z.object({
            amount: z.coerce.number().int().positive(),
            prodCat: z.string().min(1),
            shirtSize: z.string().min(1),
            color: z.string().min(1),
            design: z.boolean(),
            designURL: z.string().url().optional().or(z.literal("")),
            netPrice: z.coerce.number().positive(),
        })
    ),
});





type OrderForm = z.infer<typeof schema>;





export default function CreateOrderForm() {
    const form = useForm<OrderForm>({
        resolver: zodResolver(schema),
        defaultValues: {
            customer: "",
            position: [{
                amount: 0,
                prodCat: "T-Shirt",
                shirtSize: "",
                color: "",
                design: false,
                designURL: "",
                netPrice: 0.00,
            }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "position",
    });

    const onSubmit = form.handleSubmit(
        (data) => {
            console.log("✅ Formulardaten:", data);
        },
        (errors) => {
            console.error("❌ Validierungsfehler:", errors);
        }
    );



    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4 w-[95%] mx-auto px-2">
                {/* Kunde in der ersten Zeile */}
                <div className="grid grid-cols-1 gap-4">
                    <FormField
                        control={form.control}
                        name="customer"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Kunde</FormLabel>
                                <FormControl>
                                    <Input placeholder="Muster GmbH" {...field} className="w-full" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Positionen */}
                <div className="space-y-2">
                    <FormLabel>Positionen</FormLabel>

                    <div className="max-h-[400px] overflow-y-auto space-y-6 pr-2">
                        {fields.map((field, index) => (
                        <div key={field.id} className="relative w-full">
                            <div className="flex flex-wrap gap-3 pr-12 items-center">

                        {/* Menge */}
                            <FormField
                                control={form.control}
                                name={`position.${index}.amount`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Menge</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="Menge" {...field} className="w-[100%]" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* prodCat */}
                            <FormField
                                control={form.control}
                                name={`position.${index}.prodCat`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Artikel</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Artikel" {...field} className="w-[100%]" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Größe */}
                            <FormField
                                control={form.control}
                                name={`position.${index}.shirtSize`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Größe</FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Größe wählen" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="XS">XS</SelectItem>
                                                    <SelectItem value="S">S</SelectItem>
                                                    <SelectItem value="M">M</SelectItem>
                                                    <SelectItem value="L">L</SelectItem>
                                                    <SelectItem value="XL">XL</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* color */}
                            <FormField
                                control={form.control}
                                name={`position.${index}.color`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Farbe</FormLabel>
                                        <FormControl>
                                            <Input placeholder="CMYK" {...field} className="w-[100%]" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* design Checkbox */}
                            <FormField
                                control={form.control}
                                name={`position.${index}.design`}
                                render={({ field }) => (
                                    <FormItem className="w-[5%]">
                                        <FormLabel>Motiv</FormLabel>
                                        <FormControl>
                                            <input
                                                type="checkbox"
                                                checked={field.value}
                                                onChange={(e) => field.onChange(e.target.checked)}
                                                className="w-25% h-25%"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* designURL (Nur wenn design aktiviert ist) */}
                            {form.watch(`position.${index}.design`) && (
                                <FormField
                                    control={form.control}
                                    name={`position.${index}.designURL`}
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Motiv URL</FormLabel>
                                            <FormControl>
                                                <Input type="url" placeholder="Motiv URL" {...field} className="w-[100%]" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            {/* netPrice */}
                            <FormField
                                control={form.control}
                                name={`position.${index}.netPrice`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Nettopreis</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="Nettopreis" {...field} className="w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            </div>



                    {index > 0 && (
                                <div className="absolute top-[1.45rem] right-0.5">

                                <Button type="button" variant="destructive" onClick={() => remove(index)}>
                                        -
                                    </Button>
                                </div>
                            )}
                        </div>

                    ))}
                    </div>
                    {/* Plus-Button */}
                    <div className="flex justify-end pr-1.5 mt-6">
                        <Button
                            type="button"
                            onClick={() => append({
                                amount: 0,
                                prodCat: "",
                                shirtSize: "",
                                color: "",
                                design: false,
                                designURL: "",
                                netPrice: 0.00,
                            })}
                        >
                            +
                        </Button>
                    </div>

                </div>

                <Button type="submit">Speichern</Button>
            </form>
        </Form>
    );
}



