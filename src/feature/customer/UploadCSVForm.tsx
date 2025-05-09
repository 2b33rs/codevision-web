"use client";

import React from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface UploadCSVFormProps {
  setShowModal: (open: boolean) => void;
}

const UploadCSVForm = ({ setShowModal }: UploadCSVFormProps) => {
  const [files, setFiles] = React.useState<File[]>([]);

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    const csvs = acceptedFiles.filter(
      (f) => f.type === "text/csv" || f.name.endsWith(".csv"),
    );
    if (csvs.length > 0) setFiles(csvs);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    multiple: true,
  });

  const handleUpload = () => {
    if (files.length === 0) return;
    console.log("CSV-Dateien hochladen:", files);
    // TODO: Upload-Logik hier
    // setShowModal(false);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div
        {...getRootProps()}
        className={`w-full cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition ${isDragActive ? "border-accent" : "border-accent"} text-muted-foreground`}
      >
        <input {...getInputProps()} />
        <p className="text-sm">
          {files.length > 0
            ? "Folgende CSV-Dateien wurden ausgewählt:"
            : "CSV-Datei(en) hierher ziehen oder klicken zum Auswählen"}
        </p>
        {files.length > 0 && (
          <ul className="text-foreground mt-4 list-inside list-disc text-sm">
            {files.map((file) => (
              <li key={file.name}>{file.name}</li>
            ))}
          </ul>
        )}
      </div>

      <Button
        onClick={handleUpload}
        disabled={files.length === 0}
        className="flex items-center gap-2 self-end"
      >
        <Upload className="h-4 w-4" />
        Upload starten
      </Button>
    </div>
  );
};

export default UploadCSVForm;
