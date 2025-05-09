import { customerApi } from "@/api/endpoints/customerApi.ts";
import { CustomerType } from "@/models/customer.ts";
import CustomerForm, {
  CustomerFormType,
} from "@/feature/customer/CustomerForm";

interface CreateCustomerFormProps {
  setShowModal?: (value: ((prevState: boolean) => boolean) | boolean) => void;
}

export default function CreateCustomerForm({
  setShowModal,
}: CreateCustomerFormProps) {
  const [createCustomer, { isLoading }] =
    customerApi.useCreateCustomerMutation();

  const defaultValues = {
    name: "",
    addr_strasse: "",
    addr_plz: "",
    addr_ort: "",
    firstname: "",
    lastname: "",
    telefon: "",
    mail: "",
  };

  const onSubmit = async (data: CustomerFormType) => {
    await createCustomer({
      name: data.name,
      email: data.mail,
      phone: data.telefon,
      addr_country: "DE",
      addr_city: data.addr_ort,
      addr_zip: data.addr_plz,
      addr_street: data.addr_strasse,
      addr_line1: `${data.firstname} ${data.lastname}`,
      addr_line2: "",
      customerType: CustomerType.Business, // always business
    });
    setShowModal?.(false);
  };

  return (
    <CustomerForm
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      submitLabel={isLoading ? "Speichern..." : "Speichern"}
      isLoading={isLoading}
    />
  );
}
