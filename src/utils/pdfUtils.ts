import { JSX } from "react";
import { pdf } from "@react-pdf/renderer";

/**
 * Downloads a PDF document generated from a React component
 * @param component The React component to render as PDF
 * @param fileName The name of the downloaded file
 */
export const downloadPDF = async (component: JSX.Element, fileName: string) => {
  const blob = await pdf(component).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};