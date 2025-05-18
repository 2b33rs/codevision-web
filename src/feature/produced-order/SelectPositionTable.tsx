// SelectablePositionsTable.tsx

import { ReactNode, useState } from "react";
import { Position } from "@/models/order";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/sidebar/data-table.tsx";
import PositionDetails from "@/common/PositionDetails.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input.tsx";

type Action = {
  label: ReactNode;
  content: (selected: Position[], orderNumber: string) => ReactNode;
  onConfirm: (selected: Position[], orderNumber: string) => void;
  renderDropdown?: boolean;
};

type Props = {
  positions: Position[];
  orderNumber: string;
  selectableStatus: Position["Status"];
  actions: Action[];
};

const SelectablePositionsTable = ({
  positions,
  orderNumber,
  selectableStatus,
  actions,
}: Props) => {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const selectedPositions = positions.filter((pos) => rowSelection[pos.id]);
  const selectedCount = selectedPositions.length;

  const columns: ColumnDef<Position>[] = [
    {
      id: "select",
      header: ({ table }) => {
        const anyChecked = table
          .getFilteredRowModel()
          .rows.filter((row) => row.original.Status === selectableStatus)
          .every((row) => row.getIsSelected());
        return (
          <div className="flex justify-center">
            <Input
              type="checkbox"
              checked={anyChecked}
              onChange={(e) => {
                const shouldSelect = e.target.checked;
                // selektiere per table API alle relevanten IDs
                const newSel: Record<string, boolean> = {};
                table.getFilteredRowModel().rows.forEach((row) => {
                  if (row.original.Status === selectableStatus) {
                    newSel[row.id] = shouldSelect;
                  }
                });
                setRowSelection(newSel);
              }}
              aria-label="Alle auswählen"
            />
          </div>
        );
      },
      cell: ({ row }) => {
        const isSelectable = row.original.Status === selectableStatus;
        return (
          <div className="flex justify-center">
            <Input
              type="checkbox"
              checked={row.getIsSelected()}
              disabled={!isSelectable}
              onChange={(e) =>
                setRowSelection((prev) => ({
                  ...prev,
                  [row.id]: e.target.checked,
                }))
              }
              aria-label="Zeile auswählen"
            />
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "pos_details",
      cell: ({ row }) => <PositionDetails position={row.original} />,
    },
  ];

  return (
    <div className={`mb-4 rounded-md ${selectedCount > 0 ? "border" : ""}`}>
      <div className="mb-2 flex items-center justify-between px-2 pt-2">
        <h2 className="text-lg font-medium">Bestellung {orderNumber}</h2>
        <div className="flex space-x-2">
          {selectedCount !== 0 &&
            actions.map((action, idx) => {
              if (action.renderDropdown) {
                return (
                  <DropdownMenu key={idx}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        {action.label} ({selectedCount})
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {action.content(selectedPositions, orderNumber)}
                      <DropdownMenuItem asChild>
                        <Button
                          size="sm"
                          onClick={() =>
                            action.onConfirm(selectedPositions, orderNumber)
                          }
                          className={"ml-auto"}
                        >
                          Bestätigen
                        </Button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }

              return (
                <Button
                  key={idx}
                  variant="link"
                  size="sm"
                  onClick={() =>
                    action.onConfirm(selectedPositions, orderNumber)
                  }
                >
                  {action.label} ({selectedCount})
                </Button>
              );
            })}
        </div>
      </div>
      <DataTable
        data={positions}
        columns={columns}
        search={false}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
      />
    </div>
  );
};

export default SelectablePositionsTable;
