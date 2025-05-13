import { BaseContentLayout } from "@/common/BaseContentLayout.tsx";
import { Grid2x2Plus } from "lucide-react";
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog.tsx";
import ComplaintsForm from "@/feature/complaints/ComplaintsForm.tsx";
import ComplaintsTable from "@/feature/complaints/ComplaintsTable.tsx";

const Complaints = () => {
  const [showModal, setShowModal] = React.useState(false);
  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
    <BaseContentLayout
      title="Reklamationen"
      primaryCallToActionButton={{
        text: "Reklamation erfassen",
        icon: Grid2x2Plus,
        onClick: () => {
          setShowModal(true);
        },
        isLoading: false,
      }}
    >
      <ComplaintsTable />
    </BaseContentLayout>
      <DialogContent className="w-[95vw] sm:w-[90vw] md:w-[80vw] lg:w-[1200px] !max-w-[none]">
        <ComplaintsForm />
      </DialogContent>
      </Dialog>
  );
};

export default Complaints;
