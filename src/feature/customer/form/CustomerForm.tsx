"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { PhoneInput } from "@/components/ui/phone-input.tsx";
import React from "react";

const schema = z.object({
  name: z.string().nonempty("Pflichtfeld"),
  addr_strasse: z.string().nonempty("Pflichtfeld"),
  addr_plz: z.string().nonempty("Pflichtfeld"),
  addr_ort: z.string().nonempty("Pflichtfeld"),
  firstname: z.string().nonempty("Pflichtfeld"),
  lastname: z.string().nonempty("Pflichtfeld"),
  telefon: z.string().nonempty("Pflichtfeld"),
  mail: z.string().email("Pflichtfeld"),
});

export type CustomerFormType = z.infer<typeof schema>;

interface CustomerFormProps {
  defaultValues: CustomerFormType;
  onSubmit: (data: CustomerFormType) => Promise<void>;
  submitLabel?: string;
  isLoading: boolean;
}

export default function CustomerForm({
  defaultValues,
  onSubmit,
  isLoading,
  submitLabel = "Speichern",
}: CustomerFormProps) {
  const form = useForm<CustomerFormType>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  React.useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues]);

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <Form
      {...form}
      key={
        "hi-refresh-me-and-react-fix-this-annoying-bug" +
        JSON.stringify(defaultValues)
      }
    >
      <form onSubmit={handleSubmit} className="grid max-w-md gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Firmenname</FormLabel>
              <FormControl>
                <Input placeholder="MusterFirma GmbH" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="addr_strasse"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Straße</FormLabel>
              <FormControl>
                <Input placeholder="Musterweg 21b" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="addr_plz"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postleitzahl</FormLabel>
                <FormControl>
                  <Input placeholder="77654" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="addr_ort"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ort</FormLabel>
                <FormControl>
                  <Input placeholder="Musterstadt" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <h3 className="text-black-700 mt-6 text-sm font-semibold">
          Ansprechpartner
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vorname</FormLabel>
                <FormControl>
                  <Input placeholder="Max" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nachname</FormLabel>
                <FormControl>
                  <Input placeholder="Mustermann" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="telefon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefon</FormLabel>
              <FormControl>
                <PhoneInput placeholder="+49 ..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-Mail</FormLabel>
              <FormControl>
                <Input type="email" placeholder="info@example.de" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? `${submitLabel}...` : submitLabel}
        </Button>
      </form>
    </Form>
  );
}
