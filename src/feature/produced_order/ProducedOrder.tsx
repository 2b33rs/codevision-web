import { BaseContentLayout } from "@/common/BaseContentLayout.tsx";
import { Grid2x2Plus } from "lucide-react";
import { orderApi } from "@/api/endpoints/orderApi.ts";
import ProducedOrderTable from "@/feature/produced_order/ProducedOrderTable.tsx";

const ProducedOrder = () => {
  const [, { isLoading }] = orderApi.useCreateOrderMutation();
  return (
    <BaseContentLayout
      title="Fertig produzierte Ware"
      primaryCallToActionButton={{
        text: "Fertigware anfordern",
        icon: Grid2x2Plus,
        onClick: () => {
          // TODO hardcoded example remove me!!
          //create({ customerId: "6a8387e9-6ab5-4851-bc5b-c7d6e817fea1" });
        },
        isLoading,
      }}
    >
      <ProducedOrderTable />
    </BaseContentLayout>
  );
};

export default ProducedOrder;
