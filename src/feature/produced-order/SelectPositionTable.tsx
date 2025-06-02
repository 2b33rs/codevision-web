import { ReactNode, useState } from "react";
import { Position } from "@/models/order";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/sidebar/data-table.tsx";
import PositionDetails from "@/common/PositionDetails.tsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input.tsx";
import { Col, Row } from "@/common/flex/Flex.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";

type Action = {
  label: ReactNode;
  content?: (selected: Position[], orderNumber: string) => ReactNode;
  onConfirm: (selected: Position[], orderNumber: string) => void;
  renderDropdown?: boolean;
};

type Props = {
  positions: Position[];
  orderNumber: string;
  selectableStatus: Position["Status"] | Position["Status"][];
  actions: Action[];
  onResetSelection?: () => void;
  singleSelect?: boolean;
};

const SelectablePositionsTable = ({
  positions,
  orderNumber,
  selectableStatus,
  actions,
  singleSelect = false, // default: false
}: Props) => {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const selectedPositions = positions.filter((pos) => rowSelection[pos.id]);
  const selectedCount = selectedPositions.length;

  const isSelectable = (status: Position["Status"]) => {
    return Array.isArray(selectableStatus)
      ? selectableStatus.includes(status)
      : selectableStatus === status;
  };

  const columns: ColumnDef<Position>[] = [
    {
      id: "select",
      header: ({ table }) => {
        if (singleSelect) return null;
        const rows = table.getFilteredRowModel().rows;
        const selectableRows = rows.filter((row) =>
          Array.isArray(selectableStatus)
            ? selectableStatus.includes(row.original.Status)
            : row.original.Status === selectableStatus,
        );

        const allSelected = selectableRows.every((row) => rowSelection[row.id]);
        const someSelected = selectableRows.some((row) => rowSelection[row.id]);

        const handleSelectAll = (checked: boolean) => {
          const newSelection: Record<string, boolean> = {};
          selectableRows.forEach((row) => {
            newSelection[row.id] = checked;
          });
          setRowSelection(newSelection);
        };

        return (
          <Input
            type="checkbox"
            ref={(el) => {
              if (el) el.indeterminate = someSelected && !allSelected;
            }}
            checked={allSelected && selectableRows.length > 0}
            onChange={(e) => handleSelectAll(e.target.checked)}
            aria-label="Alle auswählen"
          />
        );
      },

      cell: ({ row }) => {
        const pos = row.original;
        const canSelect = isSelectable(pos.Status);
        const isSelected = rowSelection[row.id];

        const handleChange = (checked: boolean) => {
          if (!canSelect) return;

          if (singleSelect && checked) {
            setRowSelection({ [row.id]: true });
          } else if (singleSelect && !checked) {
            // Deselect
            setRowSelection({});
          } else {
            setRowSelection((prev) => ({
              ...prev,
              [row.id]: checked,
            }));
          }
        };

        return (
          <Input
            type="checkbox"
            checked={isSelected}
            disabled={!canSelect}
            onChange={(e) => handleChange(e.target.checked)}
            aria-label="Zeile auswählen"
          />
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
    <DataTable
      toolbar={
        <Row f1 gap={0} justify={"between"}>
          <h2 className="text-lg font-medium">Bestellung {orderNumber}</h2>
          <div className="flex space-x-2">
            {selectedCount > 0 &&
              actions.map((action, idx) =>
                action.renderDropdown ? (
                  <DropdownMenu key={idx}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="default" size="sm">
                        {action.label} ({selectedCount})
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <Col>
                        {action.content?.(selectedPositions, orderNumber)}
                        <Button
                          variant="default"
                          size="sm"
                          onClick={async () => {
                            action.onConfirm(selectedPositions, orderNumber);
                            setRowSelection({});
                          }}
                        >
                          {action.label}
                        </Button>
                      </Col>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    key={idx}
                    variant="default"
                    size="sm"
                    onClick={() => {
                      action.onConfirm(selectedPositions, orderNumber);
                      setRowSelection({});
                    }}
                  >
                    {action.label} ({selectedCount})
                  </Button>
                ),
              )}
          </div>
        </Row>
      }
      data={positions}
      columns={columns}
      search={false}
      rowSelection={rowSelection}
      onRowSelectionChange={setRowSelection}
    />
  );
};

export default SelectablePositionsTable;
