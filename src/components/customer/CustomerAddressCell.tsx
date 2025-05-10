import { CellContext } from "@tanstack/react-table";
import { Customer } from "@/models/customer";

export default function CustomerAddressCell({
  row,
}: CellContext<Customer, unknown>) {
  const { addr_street, addr_zip, addr_city } = row.original;
  return (
    <div className="flex max-w-[260px] flex-wrap gap-x-2 gap-y-1 text-sm">
      <span>{addr_street},</span>
      <span>
        {addr_zip} {addr_city}
      </span>
    </div>
  );
}
