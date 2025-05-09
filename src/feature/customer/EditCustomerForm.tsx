import { customerApi } from "@/api/endpoints/customerApi.ts";
import { Customer } from "@/models/customer.ts";
import CustomerForm, {
  CustomerFormType,
} from "@/feature/customer/CustomerForm.tsx";

interface EditCustomerFormProps {
  customer: Customer;
  setShowModal: (open: boolean) => void;
}

export default function EditCustomerForm({
  customer,
  setShowModal,
}: EditCustomerFormProps) {
  const [updateCustomer, { isLoading }] =
    customerApi.useUpdateCustomerMutation();

  const defaultValues = {
    name: customer.name,
    addr_strasse: customer.addr_street,
    addr_plz: customer.addr_zip,
    addr_ort: customer.addr_city,
    firstname: customer.addr_line1.split(" ")[0],
    lastname: customer.addr_line1.split(" ")[1],
    telefon: customer.phone,
    mail: customer.email,
  };

  const onSubmit = async (data: CustomerFormType) => {
    await updateCustomer({
      id: customer.id,
      data: {
        name: data.name,
        email: data.mail,
        phone: data.telefon,
        addr_country: "DE",
        addr_city: data.addr_ort,
        addr_zip: data.addr_plz,
        addr_street: data.addr_strasse,
        addr_line1: `${data.firstname} ${data.lastname}`,
        addr_line2: "",
        customerType: customer.customerType,
      },
    });
    setShowModal(false);
  };

  return (
    <CustomerForm
      isLoading={isLoading}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      submitLabel={isLoading ? "Aktualisieren..." : "Aktualisieren"}
    />
  );
}
