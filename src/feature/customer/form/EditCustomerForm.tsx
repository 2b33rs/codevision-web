import { customerApi } from "@/api/endpoints/customerApi.ts";
import CustomerForm, {
  CustomerFormType,
} from "@/feature/customer/form/CustomerForm.tsx";

interface EditCustomerFormProps {
  customerId: string;
  defaultValues: CustomerFormType;
  setShowModal: (open: boolean) => void;
}

export default function EditCustomerForm({
  customerId,
  defaultValues,

  setShowModal,
}: EditCustomerFormProps) {
  const [updateCustomer, { isLoading }] =
    customerApi.useUpdateCustomerMutation();

  const onSubmit = async (data: CustomerFormType) => {
    await updateCustomer({
      id: customerId,
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
