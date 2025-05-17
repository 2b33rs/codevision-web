"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// Zod Schema für Validierung
const schema = z.object({
    customer: z.string().nonempty("Bitte Kundenname eingeben"),
    order: z.string().nonempty("Bitte Bestellnummer eingeben"),
    position: z.string().nonempty("Bitte Position angeben"),
    size: z.string().nonempty("Größe wählen"),
    color: z.string().nonempty("Farbe eingeben"),
    quantity: z.coerce.number().positive("Anzahl muss größer als 0 sein"),
});

type ComplaintForm = z.infer<typeof schema>;

export default function ComplaintsForm() {
    const form = useForm<ComplaintForm>({
        resolver: zodResolver(schema),
        defaultValues: {
            customer: "",
            order: "",
            position: "",
            size: "",
            color: "",
            quantity: 1,
        },
    });

    const onSubmit = form.handleSubmit((data) => {
        console.log("📦 Reklamation eingereicht:", data);
    });

    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className="grid gap-4 max-w-md">
                {/* Kunde */}
                <FormField
                    control={form.control}
                    name="customer"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Kunde</FormLabel>
                            <FormControl>
                                <Input placeholder="z. B. BlueWear GmbH" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Bestellung */}
                <FormField
                    control={form.control}
                    name="order"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bestellung</FormLabel>
                            <FormControl>
                                <Input placeholder="z. B. ORD-1001" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Position */}
                <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Position</FormLabel>
                            <FormControl>
                                <Input placeholder="z. B. T-Shirt Classic – Blau – M" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Größe */}
                <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Größe</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
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

                {/* Farbe */}
                <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Farbe</FormLabel>
                            <FormControl>
                                <Input placeholder="z. B. Blau" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Anzahl */}
                <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Anzahl fehlerhafter Teile</FormLabel>
                            <FormControl>
                                <Input type="number" min={1} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit">Reklamation absenden</Button>
            </form>
        </Form>
    );
}
