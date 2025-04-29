import { BaseContentLayout } from "@/common/BaseContentLayout.tsx";
import { Download } from "lucide-react";

const Export = () => {
  return (
    <BaseContentLayout
      title="Export"
      primaryCallToActionButton={{
        text: "CSV herunterladen",
        icon: Download,
        onClick: () => {},
        isLoading: false,
      }}
    >
      Huhu Export
    </BaseContentLayout>
  );
};

export default Export;
