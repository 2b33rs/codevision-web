import { BaseContentLayout } from "@/common/BaseContentLayout.tsx";
import { Grid2x2Plus } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog.tsx";
import StandardProductTable from "@/feature/standard_products/StandardProductTable.tsx";
import AddStandardProductForm from "@/feature/standard_products/AddStandardProductForm.tsx";
import React from "react";

const StandardProduct = () => {
  const [showModal, setShowModal] = React.useState(false);
  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <BaseContentLayout
        title="Standartprodukte"
        primaryCallToActionButton={{
          text: "Standartprodukt hinzufügen",
          icon: Grid2x2Plus,
          onClick: () => {
            setShowModal(true);
          },
          isLoading: false,
        }}
      >
        <StandardProductTable />
      </BaseContentLayout>
      <DialogContent className="w-[95vw] !max-w-[none] sm:w-[90vw] md:w-[80vw] lg:w-[1200px]">
        <AddStandardProductForm />
      </DialogContent>
    </Dialog>
  );
};

export default StandardProduct;
