import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/sidebar/data-table.tsx";
import { Complaints } from "@/models/complaints.ts";

const dummyData: Complaints[] = [
  {
    id: "1001",
    positionId: "A1",
    amount: 2,
    reason: "Beschädigtes Produkt",
    createdAt: "2025-05-10",
    complaintKind: "intern",
    status: "active",
  },
  {
    id: "1002",
    positionId: "B5",
    amount: 1,
    reason: "Falscher Artikel",
    createdAt: "2025-05-11",
    complaintKind: "extern",
    status: "active",
  },
  {
    id: "1003",
    positionId: "C3",
    amount: 3,
    reason: "Unvollständige Lieferung",
    createdAt: "2025-05-12",
    complaintKind: "extern",
    status: "finished",
  },
];

const ComplaintsTable = () => {
  // ⚠️ Verwende Dummy-Daten statt API:
  // const { data } = orderApi.useGetOrdersQuery();
  const data = dummyData;

  const columns: ColumnDef<Complaints>[] = [
    { accessorKey: "id", header: "Bestellnummer" },
    { accessorKey: "positionId", header: "Position" },
    { accessorKey: "amount", header: "Anzahl" },
    { accessorKey: "reason", header: "Grund" },
    { accessorKey: "createdAt", header: "Datum" },
    { accessorKey: "complaintKind", header: "Reklamationsart" },
    { accessorKey: "status", header: "Status" },
  ];

  return <DataTable data={data} columns={columns} />;
};

export default ComplaintsTable;
