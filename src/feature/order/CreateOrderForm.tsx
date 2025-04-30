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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({
    customer: z.string().optional(),
    position: z.array(
        z.object({
            menge: z.number().int().positive(),
            artikel: z.string().min(1),
            groesse: z.string().min(1),
            farbe: z.string().min(1),
            motiv: z.boolean(),
            motivURL: z.string().url().optional(),
            nettopreis: z.number().positive(),
            auftragsart: z.string().min(1),
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
                menge: 0,
                artikel: "",
                groesse: "",
                farbe: "",
                motiv: false,
                motivURL: "",
                nettopreis: 0,
                auftragsart: "",
            }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "position",
    });

    const onSubmit = form.handleSubmit((data) => {
        console.log(data);
    });

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
                                name={`position.${index}.menge`}
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

                            {/* Artikel */}
                            <FormField
                                control={form.control}
                                name={`position.${index}.artikel`}
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
                                name={`position.${index}.groesse`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Größe</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Größe" {...field} className="w-[100%]" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Farbe */}
                            <FormField
                                control={form.control}
                                name={`position.${index}.farbe`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Farbe</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Farbe" {...field} className="w-[100%]" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Motiv Checkbox */}
                            <FormField
                                control={form.control}
                                name={`position.${index}.motiv`}
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

                            {/* MotivURL (Nur wenn Motiv aktiviert ist) */}
                            {form.watch(`position.${index}.motiv`) && (
                                <FormField
                                    control={form.control}
                                    name={`position.${index}.motivURL`}
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

                            {/* Nettopreis */}
                            <FormField
                                control={form.control}
                                name={`position.${index}.nettopreis`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Nettopreis</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="Nettopreis" {...field} className="w-[100%]" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Auftragsart */}
                            <FormField
                                control={form.control}
                                name={`position.${index}.auftragsart`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Auftragsart</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Auftragsart" {...field} className="w-[100%]" />
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
                                menge: 0,
                                artikel: "",
                                groesse: "",
                                farbe: "",
                                motiv: false,
                                motivURL: "",
                                nettopreis: 0,
                                auftragsart: "",
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



