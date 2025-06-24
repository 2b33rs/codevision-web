import { ReactNode, useState } from "react";
import { Position } from "@/models/order";
import { ColumnDef, HeaderContext, Row } from "@tanstack/react-table";
import { DataTable } from "@/components/sidebar/data-table.tsx";
import PositionDetails from "@/common/PositionDetails.tsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input.tsx";
import { Col, Row as FlexRow } from "@/common/flex/Flex.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { SearchCheck } from "lucide-react";

type Action = {
  label: ReactNode;
  content?: (selected: Position[], orderNumber: string) => ReactNode;
  onConfirm: (selected: Position[], orderNumber: string) => void;
  renderDropdown?: boolean;
};

type Props = {
  positions: Position[];
  orderNumber: string;
  customerName?: string;
  selectableStatus: Position["Status"] | Position["Status"][];
  actions: Action[];
  onResetSelection?: () => void;
  singleSelect?: boolean;
};

const SelectablePositionsTable = ({
                                    positions,
                                    orderNumber,
                                    customerName,
                                    selectableStatus,
                                    actions,
                                    singleSelect = false,
                                  }: Props) => {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const selectedPositions = positions.filter((pos) => rowSelection[pos.id]);
  const selectedCount = selectedPositions.length;

  const isSelectable = (status: Position["Status"]) =>
      Array.isArray(selectableStatus)
          ? selectableStatus.includes(status)
          : selectableStatus === status;

  const columns: ColumnDef<Position>[] = [
    ...(singleSelect
        ? [
          {
            id: "action_button",
            header: () => "Aktion",
            cell: ({ row }: { row: Row<Position> }) => {
              const pos = row.original;
              const canSelect = isSelectable(pos.Status);
              if (!canSelect) return null;

              return (
                  <div title={"Visueller Check durchführen"}>
                    <SearchCheck
                        className="text-primary hover:text-primary/70 h-5 w-5 cursor-pointer transition-colors"
                        onClick={() => {
                          const action = actions[0];
                          action.onConfirm([pos], orderNumber);
                        }}
                    />
                  </div>
              );
            },
            enableSorting: false,
            enableHiding: false,
          },
        ]
        : [
          {
            id: "select",
            header: ({ table }: HeaderContext<Position, unknown>) => {
              const rows = table.getFilteredRowModel().rows;
              const selectableRows = rows.filter((row) =>
                  isSelectable(row.original.Status),
              );

              const allSelected = selectableRows.every(
                  (row) => rowSelection[row.id],
              );
              const someSelected = selectableRows.some(
                  (row) => rowSelection[row.id],
              );

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
            cell: ({ row }: { row: Row<Position> }) => {
              const pos = row.original;
              const canSelect = isSelectable(pos.Status);
              const isSelected = rowSelection[row.id];

              const handleChange = (checked: boolean) => {
                if (!canSelect) return;
                setRowSelection((prev) =>
                    checked
                        ? { ...prev, [row.id]: true }
                        : Object.fromEntries(
                            Object.entries(prev).filter(([id]) => id !== row.id),
                        ),
                );
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
        ]),
    {
      id: "pos_details",
      cell: ({ row }: { row: Row<Position> }) => (
          <PositionDetails position={row.original} />
      ),
    },
  ];

  return (
      <>
        <FlexRow f1 gap={0} justify="between" className="mb-4">
          <div>
            <h2 className="text-lg font-medium">Bestellung {orderNumber}</h2>
            <p className="text-sm text-gray-600">
              {customerName?.trim() ? `Kunde: ${customerName}` : "Lagerauftrag"}
            </p>
          </div>

          {!singleSelect && (
              <div className="flex space-x-2">
                {actions.map((action, idx) =>
                    action.renderDropdown ? (
                        <DropdownMenu key={idx}>
                          <DropdownMenuTrigger asChild>
                            <Button
                                variant="default"
                                size="sm"
                                disabled={selectedCount === 0}
                                className={selectedCount === 0 ? "opacity-50 cursor-not-allowed" : ""}
                            >
                              {action.label} ({selectedCount})
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <Col>
                              {action.content?.(selectedPositions, orderNumber)}
                              <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => {
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
                            disabled={selectedCount === 0}
                            className={selectedCount === 0 ? "opacity-50 cursor-not-allowed" : ""}
                            onClick={() => {
                              action.onConfirm(selectedPositions, orderNumber);
                              setRowSelection({});
                            }}
                        >
                          {action.label} ({selectedCount})
                        </Button>
                    )
                )}
              </div>
          )}
        </FlexRow>

        <DataTable
            data={positions}
            columns={columns}
            search={false}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
        />
      </>
  );
};

export default SelectablePositionsTable;
