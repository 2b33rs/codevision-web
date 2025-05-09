"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/sidebar/data-table";
import { FileUp, Mail, Pencil, Phone, Trash2, UserPlus } from "lucide-react";
import { Customer, CustomerType } from "@/models/customer";
import { Button } from "@/components/ui/button";
import { customerApi } from "@/api/endpoints/customerApi.ts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { motion } from "framer-motion";
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog.tsx";
import UploadCSVForm from "@/feature/customer/UploadCSVForm.tsx";
import CreateCustomerForm from "@/feature/customer/CreateCustomerForm.tsx";
import EditCustomerForm from "@/feature/customer/EditCustomerForm.tsx";

interface CustomerTableProps {
  customerType: CustomerType;
}
const CustomerTable = ({ customerType }: CustomerTableProps) => {
  const [showModal, setShowModal] = React.useState(false);
  const [editCustomer, setEditCustomer] = React.useState<Customer | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const [deleteCustomer] = customerApi.useDeleteCustomerMutation();
  const { data = [], isLoading, refetch } = customerApi.useListCustomersQuery();

  const filteredData = React.useMemo(
    () => data.filter((c) => c.customerType === customerType),
    [data, customerType],
  );

  let b = customerType === CustomerType.Webshop;

  const cta = b
    ? {
        text: "CSV importieren",
        icon: FileUp,
        onClick: () => setShowModal(true),
        isLoading: false,
      }
    : {
        text: "Kunde hinzufügen",
        icon: UserPlus,
        onClick: () => setShowModal(true),
        isLoading: false,
      };

  const handleEdit = (customer: Customer) => {
    setEditCustomer(customer);
    setShowModal(true);
  };

  const handleDelete = async (customer: Customer) => {
    setDeletingId(customer.id);
    await deleteCustomer(customer.id);
    await refetch();
    setDeletingId(null);
  };

  const columns: ColumnDef<Customer>[] = [
    { accessorKey: "name", header: "Name" },
    {
      id: "contact",
      header: "Kontakt",
      cell: ({ row }) => {
        const { phone, email } = row.original;

        const [hovered, setHovered] = React.useState(false);

        return (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <motion.a
              href={`tel:${phone}`}
              className="flex items-center gap-1"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <Phone className="size-4 shrink-0" />
              <motion.span
                initial={false}
                animate={{
                  opacity: hovered ? 1 : 0,
                  width: hovered ? "auto" : 0,
                }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                {phone}
              </motion.span>
            </motion.a>

            <motion.a
              href={`mailto:${email}`}
              className="flex items-center gap-1"
              onMouseEnter={() => setHovered(false)}
              onMouseLeave={() => setHovered(false)}
            >
              <Mail className="size-4 shrink-0" />
              <motion.span
                initial={false}
                animate={{
                  opacity: hovered ? 0 : 1,
                  width: hovered ? 0 : "auto",
                }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                {email}
              </motion.span>
            </motion.a>
          </div>
        );
      },
    },
    {
      id: "address",
      header: "Adresse",
      cell: ({ row }) => {
        const { addr_street, addr_zip, addr_city } = row.original;
        return (
          <div className="flex max-w-[260px] flex-wrap gap-x-2 gap-y-1 text-sm">
            <span>{addr_street},</span>
            <span>
              {addr_zip} {addr_city}
            </span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const customer = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              variant={"ghost"}
              onClick={() => handleEdit(customer)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={deletingId === customer.id}
                >
                  {deletingId === customer.id ? (
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Button
                    variant="destructive"
                    className="w-full justify-start"
                    onClick={() => handleDelete(customer)}
                    disabled={deletingId === customer.id}
                  >
                    {deletingId === customer.id ? (
                      <svg
                        className="mr-2 h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    {deletingId === customer.id
                      ? "Wird gelöscht..."
                      : "Löschen"}
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DataTable<Customer>
        cta={cta}
        data={filteredData}
        columns={columns}
        loading={isLoading}
      />
      <DialogContent>
        {editCustomer ? (
          <EditCustomerForm
            customer={editCustomer}
            setShowModal={(v) => {
              setShowModal(v);
              if (!v) setEditCustomer(null);
            }}
          />
        ) : b ? (
          <UploadCSVForm setShowModal={setShowModal} />
        ) : (
          <CreateCustomerForm setShowModal={setShowModal} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CustomerTable;
