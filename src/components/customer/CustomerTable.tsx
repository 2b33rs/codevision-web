"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/sidebar/data-table.tsx";
import { Customer, CustomerType } from "@/models/customer.ts";
import { customerApi } from "@/api/endpoints/customerApi.ts";
import { Dialog, DialogContent } from "@/components/ui/dialog.tsx";
import CustomerContactCell from "./CustomerContactCell";
import CustomerAddressCell from "./CustomerAddressCell";
import CustomerActionsCell from "./CustomerActionsCell";
import { FileUp, UserPlus } from "lucide-react";
import CreateCustomerForm from "@/feature/customer/form/CreateCustomerForm.tsx";
import EditCustomerForm from "@/feature/customer/form/EditCustomerForm.tsx";
import UploadCSVForm from "@/feature/customer/form/UploadCSVForm.tsx";

interface Props {
  customerType: CustomerType;
}

export default function CustomerTable({ customerType }: Props) {
  const [showModal, setShowModal] = React.useState(false);
  const [mode, setMode] = React.useState<"create" | "edit" | null>(null);
  const [defaults, setDefaults] = React.useState<any>(null);
  const [editCustomer, setEditCustomer] = React.useState<Customer | null>(null);

  const { data = [], isLoading, refetch } = customerApi.useListCustomersQuery();

  const filtered = React.useMemo(
    () => data.filter((c) => c.customerType === customerType),
    [data, customerType],
  );

  const cta =
    customerType === CustomerType.Webshop
      ? {
          text: "CSV importieren",
          icon: FileUp,
          onClick: () => {
            setMode("create");
            setShowModal(true);
          },
          isLoading: false,
        }
      : {
          text: "Kunde hinzufügen",
          icon: UserPlus,
          onClick: () => {
            setMode("create");
            setDefaults({});
            setShowModal(true);
          },
          isLoading: false,
        };

  const columns: ColumnDef<Customer>[] = [
    { accessorKey: "name", header: "Name" },
    { id: "contact", header: "Kontakt", cell: CustomerContactCell },
    { id: "address", header: "Adresse", cell: CustomerAddressCell },
    {
      id: "actions",
      header: "",
      cell: (props) => (
        <CustomerActionsCell
          row={props.row}
          onEdit={(c) => {
            setMode("edit");
            setEditCustomer(c);
            setDefaults(c);
            setShowModal(true);
          }}
          onDeleted={() => refetch()}
        />
      ),
    },
  ];

  return (
    <Dialog open={showModal} onOpenChange={(v) => setShowModal(v)}>
      <DataTable<Customer>
        cta={cta}
        data={filtered}
        columns={columns}
        loading={isLoading}
      />
      <DialogContent>
        {mode === "create" &&
          (customerType === CustomerType.Webshop ? (
            <UploadCSVForm setShowModal={() => setShowModal(false)} />
          ) : (
            <CreateCustomerForm
              defaultValues={defaults}
              setShowModal={() => setShowModal(false)}
            />
          ))}
        {mode === "edit" && editCustomer && (
          <EditCustomerForm
            customerId={editCustomer.id}
            defaultValues={defaults}
            setShowModal={() => setShowModal(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
