import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { Button } from "@/components/ui/button.tsx";
import { LoadingIcon } from "@/common/LoadingIcon.tsx";
import { Trash, Trash2 } from "lucide-react";

export function DeleteDropdownButton({
  onConfirm,
  disabled,
  isLoading,
}: {
  onConfirm: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={isLoading || disabled}>
          {isLoading ? <LoadingIcon /> : disabled ? <Trash /> : <Trash2 />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Button
            variant="destructive"
            className="w-full justify-start"
            onClick={onConfirm}
            disabled={isLoading || disabled}
          >
            {isLoading ? (
              <LoadingIcon className="mr-2" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            {isLoading ? "Wird gelöscht..." : "Löschen"}
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
