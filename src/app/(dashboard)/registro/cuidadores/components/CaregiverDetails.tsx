"use client";

import * as React from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { RelatedPersonType } from "@/lib/types/pcd-types";
import { useDocumentTypes } from "@/hooks/use-document-types";
import { useCaregiverRoles } from "@/hooks/use-caregiver-roles";

interface CaregiverDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: RelatedPersonType | null;
}

export default function CaregiverDetails({ open, onOpenChange, item }: CaregiverDetailsProps) {
  const { data: docTypes = [] } = useDocumentTypes();
  const { data: roles = [] } = useCaregiverRoles();

  const docTypeLabel = React.useMemo(() => {
    if (!item) return "";
    const found = docTypes.find((d) => d.id === item.document);
    return found ? found.document : String(item.document);
  }, [docTypes, item]);

  const roleLabel = React.useMemo(() => {
    if (!item) return "";
    const found = roles.find((r) => r.id === item.role);
    return found ? found.name : String(item.role);
  }, [roles, item]);

  return (
    <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
      {/* Hidden trigger to satisfy Drawer API when used as controlled */}
      <DrawerTrigger asChild>
        <span />
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle>Detalles del cuidador</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 space-y-3">
            <div>
              <div className="text-sm text-muted-foreground">Nombre</div>
              <div className="font-medium">{item ? item.first_name : ""}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Apellidos</div>
              <div className="font-medium">{item ? item.last_name : ""}</div>
            </div>
            {item?.middle_name ? (
              <div>
                <div className="text-sm text-muted-foreground">Segundo nombre</div>
                <div className="font-medium">{item.middle_name}</div>
              </div>
            ) : null}
            {item?.phone_number ? (
              <div>
                <div className="text-sm text-muted-foreground">Teléfono</div>
                <div className="font-medium">{item.phone_number}</div>
              </div>
            ) : null}
            {item?.document_number ? (
              <div>
                <div className="text-sm text-muted-foreground">Número de documento</div>
                <div className="font-medium">{item.document_number}</div>
              </div>
            ) : null}
            <div>
              <div className="text-sm text-muted-foreground">Tipo de documento</div>
              <div className="font-medium">{docTypeLabel}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Rol</div>
              <div className="font-medium">{roleLabel}</div>
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cerrar</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

