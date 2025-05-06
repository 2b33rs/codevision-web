import OrderTable from "@/feature/order/OrderTable.tsx";
import { BaseContentLayout } from "@/common/BaseContentLayout.tsx";
import { Grid2x2Plus } from "lucide-react";
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog.tsx";
import CreateOrderForm from "@/feature/order/CreateOrderForm.tsx";

const Order = () => {
  const [showModal, setShowModal] = React.useState(false);
  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
    <BaseContentLayout
      title="Meine Bestellung"
      primaryCallToActionButton={{
        text: "Bestellung erfassen",
        icon: Grid2x2Plus,
        onClick: () => {
          setShowModal(true);
        },
        isLoading: false,
      }}
    >
      <OrderTable />
    </BaseContentLayout>
      <DialogContent className="w-[95vw] sm:w-[90vw] md:w-[80vw] lg:w-[1200px] !max-w-[none]">
        <CreateOrderForm />
      </DialogContent>
      </Dialog>
  );
};

export default Order;
