import React from "react";
import { CellContext } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Trash, Trash2, Pencil } from "lucide-react";
import { customerApi } from "@/api/endpoints/customerApi";
import { Customer } from "@/models/customer";

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" disabled={isDel || disabled}>
              {isDel ? <LoadingIcon /> : disabled ? <Trash /> : <Trash2 />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Button
                variant="destructive"
                className="w-full justify-start"
                onClick={handleDelete}
                disabled={isDel || disabled}
              >
                {isDel ? (
                  <LoadingIcon className="mr-2" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                {isDel ? "Wird gelöscht..." : "Löschen"}
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function LoadingIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      className={`${props.className} animate-spin`}
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
  );
}
