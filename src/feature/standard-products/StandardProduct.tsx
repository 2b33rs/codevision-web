import { BaseContentLayout } from "@/common/BaseContentLayout.tsx";
import { Dialog, DialogContent } from "@/components/ui/dialog.tsx";

import React from "react";
import StandardProductTable from "@/feature/standard-products/StandardProductTable.tsx";
import AddStandardProductForm from "@/feature/standard-products/AddStandardProductForm.tsx";

const StandardProduct = () => {
  const [showModal, setShowModal] = React.useState(false);
  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <BaseContentLayout title="Standartprodukte">
        <StandardProductTable setShowModal={setShowModal} />
      </BaseContentLayout>
      <DialogContent className="w-[95vw] !max-w-[none] sm:w-[90vw] md:w-[80vw] lg:w-[1200px]">
        <AddStandardProductForm setShowModal={setShowModal} />
      </DialogContent>
    </Dialog>
  );
};

export default StandardProduct;
