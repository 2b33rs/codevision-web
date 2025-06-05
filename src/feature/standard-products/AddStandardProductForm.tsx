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
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { createProductZ, ProductCategory, ShirtSize } from "@/models/product";
import { z } from "zod";
import { CMYKColorField } from "@/components/CMYKColorField.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Row } from "@/common/flex/Flex.tsx";
import { H2 } from "@/common/Text.tsx";
import { productApi } from "@/api/endpoints/productApi.ts";
import { toast } from "sonner";
import { mawiApi } from "@/api/endpoints/mawiApi.ts";

type OrderForm = z.infer<typeof createProductZ>;

interface AddStandardProductFormProps {
  setShowModal?: (value: ((prevState: boolean) => boolean) | boolean) => void;
}

export default function AddStandardProductForm({
  setShowModal,
}: AddStandardProductFormProps) {
  const form = useForm<OrderForm>({
    resolver: zodResolver(createProductZ),
  });

  const [createProduct] = productApi.useCreateProductMutation();

  const { data: categoryData } = mawiApi.useGetCategoriesQuery();
  const typen = categoryData?.[0]?.typen ?? [];

  const onSubmit = form.handleSubmit(
    async (data) => {
      try {
        await createProduct(data).unwrap();

        form.reset();
        setShowModal?.(false);
        toast.success("Produkt erfolgreich erstellt");
      } catch (error) {
        toast.error("Error: " + error);
      }
    },
    (errors) => {
      console.error(errors);
    },
  );

  return (
    <Form {...form}>
      <H2>Neues Produkt anlegen</H2>
      <form onSubmit={onSubmit} className="mx-auto w-[95%] space-y-4 px-2">
        <Row>
          <Select
            defaultValue={ProductCategory.TShirt}
            value={ProductCategory.TShirt}
          >
            <SelectTrigger>
              <SelectValue placeholder="Kategorie" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ProductCategory).map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder={"Name"}></Input>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Row>

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Farbe</FormLabel>
              <FormControl>
                <CMYKColorField {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Row>
          <FormField
            control={form.control}
            name="shirtSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Größe</FormLabel>

                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Größe auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ShirtSize).map((size) => (
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
            name="typ"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Typ</FormLabel>
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
            name="minAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mindestbestand</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Mindestbestand"
                    {...field}
                    className="w-full [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className={"mt-auto ml-auto"}>
            Speichern
          </Button>
        </Row>
      </form>
    </Form>
  );
}
