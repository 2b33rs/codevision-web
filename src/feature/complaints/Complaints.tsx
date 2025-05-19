import { BaseContentLayout } from "@/common/BaseContentLayout.tsx";
import { Grid2x2Plus } from "lucide-react";
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog.tsx";
import ComplaintsForm from "@/feature/complaints/ComplaintsForm.tsx";
import ComplaintsTable from "@/feature/complaints/ComplaintsTable.tsx";
import BaseTabsLayout from "@/common/BaseTabsLayout.tsx";

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
        <BaseTabsLayout
          tabs={[
            {
              title: "Intern",
              content: <ComplaintsTable kind="INTERN" />,
            },
            {
              title: "Extern",
              content: <ComplaintsTable kind="EXTERN" />,
            },
          ]}
        />
      </BaseContentLayout>
      <DialogContent className="w-[95vw] !max-w-[none] sm:w-[90vw] md:w-[80vw] lg:w-[1200px]">
        <ComplaintsForm />
      </DialogContent>
    </Dialog>
  );
};

export default Complaints;
