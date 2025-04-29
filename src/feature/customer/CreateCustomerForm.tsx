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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/ui/phone-input.tsx";

const schema = z.object({
  name: z.string().optional(),
  addr_strasse: z.string().optional(),
  addr_plz: z.string().optional(),
  addr_ort: z.string().optional(),
  telefon: z.string().optional(),
  mail: z.string().email().optional(),
});

type CustomerForm = z.infer<typeof schema>;

export default function CreateCustomerForm() {
  const form = useForm<CustomerForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      addr_strasse: "",
      addr_plz: "",
      addr_ort: "",
      telefon: "",
      mail: "",
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    console.log(data);
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="grid max-w-md gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Firmenname</FormLabel>
              <FormControl>
                <Input placeholder="Muster GmbH" {...field} />
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
                <Input {...field} placeholder={"Musterweg"} />
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
                <FormLabel>PLZ</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={"77654"} />
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
                  <Input {...field} placeholder={"Musterstadt"} />
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
                <Input
                  type="email"
                  placeholder={"info@example.de"}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Speichern</Button>
      </form>
    </Form>
  );
}
