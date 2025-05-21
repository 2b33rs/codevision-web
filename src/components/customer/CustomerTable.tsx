"use client";

import React from "react";
import Fuse from "fuse.js";
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
import { Button } from "@/components/ui/button.tsx";
import { Row } from "@/common/flex/Flex.tsx";
import { SearchInput } from "@/components/ui/search-input.tsx";

interface Props {
  customerType: CustomerType;
}

export default function CustomerTable({ customerType }: Props) {
  const [showModal, setShowModal] = React.useState(false);
  const [mode, setMode] = React.useState<"create" | "edit" | null>(null);
  const [defaults, setDefaults] = React.useState<any>(null);
  const [editCustomer, setEditCustomer] = React.useState<Customer | null>(null);
  const [search, setSearch] = React.useState("");

  const { data = [], isLoading, refetch } = customerApi.useListCustomersQuery();

  const filtered = React.useMemo(() => {
    const customers = data.filter((c) => c.customerType === customerType);
    if (!search) return customers;
    const fuse = new Fuse(customers, {
      keys: ["name", "email", "phone"],
      threshold: 0.3,
      ignoreLocation: true,
    });
    return fuse.search(search).map((r) => r.item);
  }, [data, customerType, search]);

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

  const cta =
    customerType === CustomerType.Webshop
      ? {
          text: "CSV importieren",
          icon: FileUp,
          onClick: () => {
            setMode("create");
            setShowModal(true);
          },
        }
      : {
          text: "Kunde hinzufügen",
          icon: UserPlus,
          onClick: () => {
            setMode("create");
            setDefaults({});
            setShowModal(true);
          },
        };

  return (
    <Dialog open={showModal} onOpenChange={(v) => setShowModal(v)}>
      <DataTable<Customer>
        data={filtered}
        columns={columns}
        loading={isLoading}
        toolbar={
          <Row className="w-full justify-between gap-2">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Suche nach Name oder E-Mail …"
              className="max-w-[8rem] transition-all duration-300 focus-within:max-w-sm"
            />
            <Button onClick={cta.onClick}>
              <cta.icon className="mr-2 h-4 w-4" />
              {cta.text}
            </Button>
          </Row>
        }
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
