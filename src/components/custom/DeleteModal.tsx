"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ReactNode, useState } from "react";

interface DeleteModalProps {
  title: string;
  description?: ReactNode;
  entityLabel?: ReactNode;
  onConfirm: () => Promise<void> | void;
  triggerLabel?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  trigger?: ReactNode;
}

const DeleteModal = ({
  title,
  description,
  entityLabel,
  onConfirm,
  triggerLabel = "Eliminar",
  confirmLabel = "Eliminar",
  cancelLabel = "Cancelar",
  trigger,
}: DeleteModalProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await Promise.resolve(onConfirm());
      setOpen(false);
    } catch (error) {
      console.error("Error while deleting", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" className="hover:bg-secondary" disabled={isLoading}>
            {triggerLabel}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          {description ? (
            <div className="text-sm text-muted-foreground">{description}</div>
          ) : null}
          {entityLabel ? (
            <div className="text-base font-medium text-center break-words">
              {entityLabel}
            </div>
          ) : null}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              className="hover:bg-secondary"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              {cancelLabel}
            </Button>
            <Button
              className="hover:bg-secondary"
              onClick={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? "Eliminando..." : confirmLabel}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
