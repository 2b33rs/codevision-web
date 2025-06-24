import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PackageCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Position } from "@/models/order";
import { positionApi } from "@/api/endpoints/positionApi";

interface RequestPositionProps {
    position: Position;
    orderNumber?: string;
    onSuccess?: () => void;
}

export const RequestPositionButton = ({
                                          position,
                                        orderNumber = "",
                                          onSuccess,
                                      }: RequestPositionProps) => {
    const [requested, setRequested] = useState(false);
    const [requestFinishedGoods, { isLoading }] =
        positionApi.useRequestFinishedGoodsMutation();

    const canRequest = position.Status === "READY_FOR_PICKUP" && !requested;

    const handleRequest = async () => {
        if (!canRequest) return;

        console.log("Requesting position:", position);
        console.log("Order number:", orderNumber);

        try {
            await requestFinishedGoods({
                orderNumber,
                positions: [position],
            }).unwrap();

            toast.success(`Position ${position.pos_number} wurde angefordert`);
            setRequested(true);
            onSuccess?.();
        } catch (error) {
            console.error("Request error:", error);
            toast.error("Fehler beim Anfordern der Position");
        }
    };


    return (
        <Button
            variant={canRequest ? "default" : "secondary"}
            size="sm"
            disabled={!canRequest || isLoading}
            onClick={handleRequest}
            className="w-full"
        >
            {requested ? (
                <>
                    <PackageCheck className="mr-2 h-4 w-4" />
                    Angefordert
                </>
            ) : isLoading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Wird angefordert...
                </>
            ) : (
                <>
                    <PackageCheck className="mr-2 h-4 w-4" />
                    Position anfordern
                </>
            )}
        </Button>
    );
};
