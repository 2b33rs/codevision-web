import { CellContext } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { customerApi } from "@/api/endpoints/customerApi";
import { Customer } from "@/models/customer";
import { DeleteDropdownButton } from "@/common/DeleteDropdownButton.tsx";

interface Props {
  row: CellContext<Customer, unknown>["row"];
  onEdit: (c: Customer) => void;
  onDeleted: () => void;
}

export default function CustomerActionsCell({ row, onEdit, onDeleted }: Props) {
  const customer = row.original;
  const { data: meta, isLoading } = customerApi.useGetCustomerMetaQuery(
    customer.id,
  );
  const [deleteCustomer, { isLoading: isDel }] =
    customerApi.useDeleteCustomerMutation();

  const disabled = isLoading || !meta?.canDelete;
  const title = isLoading
    ? "Lade Lösch-Berechtigung…"
    : disabled
      ? `Kann nicht gelöscht werden: ${meta?.orderCount} Bestellung(en)`
      : "";

  const handleDelete = async () => {
    await deleteCustomer(customer.id);
    onDeleted();
  };

  return (
    <div className="flex justify-end gap-2">
      <Button size="sm" variant="ghost" onClick={() => onEdit(customer)}>
        <Pencil className="h-4 w-4" />
      </Button>
      <div title={title}>
        <DeleteDropdownButton
          onConfirm={handleDelete}
          disabled={disabled}
          isLoading={isDel}
        />
      </div>
    </div>
  );
}
