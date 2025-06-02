import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCreateComplaintMutation } from "@/api/endpoints/complaintsApi";
import { ComplaintDto } from "@/models/complaints";

interface ComplaintDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    positionId: string;
    onSuccess: () => void;
}

const ComplaintDialog = ({
                             open,
                             onOpenChange,
                             positionId,
                             onSuccess,
                         }: ComplaintDialogProps) => {

    const [reason, setReason] = useState<ComplaintDto["ComplaintReason"] | "">("");
    const [kind, setKind] = useState<"INTERN" | "EXTERN">("INTERN");
    const [createNewOrder, setCreateNewOrder] = useState(false);

    const [createComplaint, { isLoading }] = useCreateComplaintMutation();

    const handleSubmit = async () => {
        if (!reason) return toast.error("Bitte wähle einen Grund aus.");

        const payload = {
            positionId,
            ComplaintReason: reason,
            ComplaintKind: kind,
            createNewOrder,
        };

        console.log("📦 Gesendeter Reklamations-Body:", payload); // <--- hier

        try {
            await createComplaint(payload).unwrap();
            toast.success("Reklamation erfolgreich eingereicht.");
            onOpenChange(false);
            onSuccess();
        } catch (err) {
            console.error("❌ Fehler beim Senden der Reklamation:", err);
            toast.error("Fehler beim Einreichen der Reklamation.");
        }
    };


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {!positionId ? null : (
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Reklamation erfassen</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Grund</label>
                        <Select
                            value={reason}
                            onValueChange={(val) =>
                                setReason(val as ComplaintDto["ComplaintReason"])
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Grund auswählen" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="WRONG_SIZE">Falsche Größe</SelectItem>
                                <SelectItem value="WRONG_COLOR">Falsche Farbe</SelectItem>
                                <SelectItem value="PRINT_INCORRECT">Druckfehler</SelectItem>
                                <SelectItem value="DAMAGED_ITEM">Beschädigt</SelectItem>
                                <SelectItem value="BAD_QUALITY">Schlechte Qualität</SelectItem>
                                <SelectItem value="OTHER">Sonstiges</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Typ</label>
                        <Select
                            value={kind}
                            onValueChange={(val) => setKind(val as "INTERN" | "EXTERN")}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Typ auswählen" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="INTERN">Intern</SelectItem>
                                <SelectItem value="EXTERN">Extern</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <label className="flex items-center space-x-2">
                        <Checkbox
                            checked={createNewOrder}
                            onCheckedChange={() => setCreateNewOrder(!createNewOrder)}
                        />
                        <span>Neu produzieren</span>
                    </label>

                    <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
                        Reklamation absenden
                    </Button>
                </div>
            </DialogContent>
            )}
        </Dialog>
    );
};

export default ComplaintDialog;
