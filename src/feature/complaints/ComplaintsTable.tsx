import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/sidebar/data-table";
import { format } from "date-fns";
import { de } from "date-fns/locale";

type Complaint = {
  id: string;
  createdAt: string;
  updatedAt: string;
  positionId: string;
  ComplaintReason: string;
  ComplaintKind: string;
};

const ComplaintsTable = () => {
  const [data, setData] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await fetch("https://codevision-backend-production.up.railway.app/complaints");
        const complaints = await res.json();
        setData(complaints);
      } catch (error) {
        console.error("Fehler beim Laden der Reklamationen:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const columns: ColumnDef<Complaint>[] = [
    { accessorKey: "id", header: "Reklamations-ID" },
    {
      accessorKey: "createdAt",
      header: "Erstellt am",
      cell: ({ row }) =>
        format(new Date(row.original.createdAt), "dd.MM.yyyy HH:mm", { locale: de }),
    },
    {
      accessorKey: "updatedAt",
      header: "Aktualisiert am",
      cell: ({ row }) =>
        format(new Date(row.original.updatedAt), "dd.MM.yyyy HH:mm", { locale: de }),
    },
    { accessorKey: "ComplaintReason", header: "Grund" },
    { accessorKey: "ComplaintKind", header: "Art" },
    { accessorKey: "positionId", header: "Positions-ID" },
  ];

  return (
    <div className="w-full px-0">
      {loading ? (
        <p>Reklamationen werden geladen...</p>
      ) : (
        <div className="w-full overflow-x-auto">
          <DataTable data={data} columns={columns} />
        </div>
      )}
    </div>
  );
};

export default ComplaintsTable;
