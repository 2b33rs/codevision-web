"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/sidebar/data-table";
import { Mail, Pencil, Phone, Trash2 } from "lucide-react";
import { Customer } from "@/models/customer";
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

const CustomerTable = () => {
  const { data = [], isLoading } = customerApi.useListCustomersQuery();

  const handleEdit = (customer: Customer) => {
    console.log("Bearbeiten:", customer);
  };

  const handleDelete = (customer: Customer) => {
    console.log("Löschen:", customer);
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
            {/* Telefon-Link mit Hover-Control */}
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

            {/* Mail-Link mit Inverslogik */}
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
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Button
                    variant="destructive"
                    className="w-full justify-start"
                    onClick={() => handleDelete(customer)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Löschen
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
    <DataTable<Customer> data={data} columns={columns} loading={isLoading} />
  );
};

export default CustomerTable;
