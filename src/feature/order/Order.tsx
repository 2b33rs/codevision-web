import OrderTable from "@/feature/order/OrderTable.tsx";
import { BaseContentLayout } from "@/common/BaseContentLayout.tsx";
import { Grid2x2Plus } from "lucide-react";

const Order = () => {
  return (
    <BaseContentLayout
      title="Meine Bestellung"
      primaryCallToActionButton={{
        text: "Bestellung erfassen",
        icon: Grid2x2Plus,
        onClick: () => {
          console.log("Hi");
        },
        isLoading: false,
      }}
    >
      <OrderTable />
    </BaseContentLayout>
  );
};

export default Order;
