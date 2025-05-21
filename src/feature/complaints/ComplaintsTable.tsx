import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/sidebar/data-table";
import { useState, useMemo } from "react";
import Fuse from "fuse.js";
import { SearchInput } from "@/components/ui/search-input";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { useGetComplaintsQuery } from "@/api/endpoints/complaintsApi.ts";
import { PositionDetailsForComplaint } from "@/common/PositionDetails.tsx";
import { ComplaintDto } from "@/models/complaints.ts";

const complaintReasonMap: Record<ComplaintDto["ComplaintReason"], string> = {
  WRONG_SIZE: "Falsche Größe",
  WRONG_COLOR: "Falsche Farbe",
  PRINT_INCORRECT: "Fehldruck",
  PRINT_OFF_CENTER: "Druck nicht zentriert",
  DAMAGED_ITEM: "Beschädigter Artikel",
  STAINED: "Verschmutzt",
  LATE_DELIVERY: "Verspätete Lieferung",
  WRONG_PRODUCT: "Falsches Produkt",
  MISSING_ITEM: "Fehlender Artikel",
  BAD_QUALITY: "Schlechte Qualität",
  NOT_AS_DESCRIBED: "Nicht wie beschrieben",
  OTHER: "Sonstiges",
};

const ComplaintsTable = ({ kind }: { kind?: "INTERN" | "EXTERN" }) => {
  const { data = [], isLoading } = useGetComplaintsQuery({});
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const base = kind ? data.filter((c) => c.ComplaintKind === kind) : data;
    if (!search) return base;
    const fuse = new Fuse(base, {
      keys: [
        "ComplaintReason",
        "position.name",
        "position.color",
        "position.shirtSize",
      ],
      threshold: 0.3,
      ignoreLocation: true,
    });
    return fuse.search(search).map((r) => r.item);
  }, [data, kind, search]);

  const columns: ColumnDef<ComplaintDto>[] = [
    {
      accessorKey: "updatedAt",
      header: "Zeitpunkt",
      cell: ({ row }) =>
        format(new Date(row.original.updatedAt), "dd. MMM, HH:mm", {
          locale: de,
        }),
    },
    {
      accessorKey: "ComplaintReason",
      header: "Grund",
      cell: ({ row }) => complaintReasonMap[row.original.ComplaintReason],
    },
    {
      id: "positionId",
      header: "Position",
      cell: ({ row }) => (
        <PositionDetailsForComplaint complaint={row.original} />
      ),
    },
  ];

  return (
    <div className="w-full px-0">
      {isLoading ? (
        <p>Reklamationen werden geladen...</p>
      ) : (
        <div className="w-full overflow-x-auto">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Suche nach Grund oder Position ..."
            className="mb-4 max-w-sm"
          />
          <DataTable
            data={filtered}
            columns={columns}
            initialSorting={[{ id: "updatedAt", desc: true }]}
          />
        </div>
      )}
    </div>
  );
};

export default ComplaintsTable;
