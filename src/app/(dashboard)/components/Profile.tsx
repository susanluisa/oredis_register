"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, SearchIcon } from "lucide-react";
import { PCDType } from "@/lib/types/pcd-types";

// Tipos expandidos
interface CountryExpanded {
  id: number;
  name: string;
  code: string;
}

interface EducationLevelExpanded {
  id: number;
  name: string;
}

interface SocioeconomicStatusExpanded {
  id: number;
  name: string;
}

interface OccupationExpanded {
  id: number;
  name: string;
}

interface DistrictExpanded {
  id: number;
  name: string;
  code: string;
}

interface DisabilityExpanded {
  id: number;
  name: string;
}

type PCDExpandedType = Omit<
  PCDType,
  | "nationality"
  | "education_level"
  | "socioeconomic_status"
  | "occupation"
  | "district"
  | "disability"
> & {
  nationality: CountryExpanded | null;
  education_level: EducationLevelExpanded | null;
  socioeconomic_status: SocioeconomicStatusExpanded | null;
  occupation: OccupationExpanded | null;
  district: DistrictExpanded | null;
  disability: DisabilityExpanded | null;
};

interface PCDProfileProps {
  pcd: PCDExpandedType;
}

export default function PCDProfile({ pcd }: PCDProfileProps) {
  const infoBlocks = [
    { label: "Fecha de nacimiento", value: new Date(pcd.birth_date).toLocaleDateString() },
    { label: "Género", value: pcd.gender },
    { label: "Correo", value: pcd.email || "No registrado" },
    { label: "Teléfono", value: pcd.phone_number || "No registrado" },
    { label: "Dirección", value: pcd.address },
    { label: "Nacionalidad", value: pcd.nationality?.name || "Sin definir" },
    { label: "Nivel educativo", value: pcd.education_level?.name || "Sin definir" },
    { label: "Situación socioeconómica", value: pcd.socioeconomic_status?.name || "Sin definir" },
    { label: "Ocupación", value: pcd.occupation?.name || "Sin definir" },
    { label: "Distrito", value: pcd.district?.name || "Sin definir" },
    { label: "Discapacidad", value: pcd.disability?.name || "Sin definir" },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-gray-50 p-6 gap-6">

      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <Input placeholder="Buscar persona..." className="max-w-sm" />
          <div className="flex gap-2">
            <Button variant="outline">Editar</Button>
            <Button variant="outline">Exportar</Button>
          </div>
        </div>

        <Card className="p-6">
          <div className="flex gap-6 items-center">
            <Avatar className="w-32 h-32">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback>
                {pcd.name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold">{pcd.name} {pcd.first_surname} {pcd.second_surname}</h2>
              <p className="text-sm text-muted-foreground mb-2">DNI: {pcd.document_number}</p>
              <div className="flex gap-2 mb-3 flex-wrap">
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{pcd.gender}</span>
                {pcd.conadis_card && (
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Conadis</span>
                )}
                {pcd.nationality && (
                  <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">{pcd.nationality.name}</span>
                )}
              </div>
              <p className="text-sm leading-relaxed text-gray-700">
                Registrado el {new Date(pcd.created_at).toLocaleDateString()} — última actualización {new Date(pcd.updated_at).toLocaleDateString()}.
              </p>
            </div>
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-full border-[8px] border-blue-300 flex items-center justify-center">
                  <p className="text-2xl font-semibold text-blue-600">#{pcd.id}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">ID Interno</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {infoBlocks.map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-3 shadow-sm">
                <p className="text-xs text-muted-foreground uppercase">{item.label}</p>
                <p className="text-sm font-medium text-gray-700">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 rounded-xl bg-blue-100">
            <p className="font-semibold text-blue-700">Resumen general</p>
            <p className="text-sm text-gray-700 mt-2">
              {pcd.name} {pcd.first_surname} reside en {pcd.district?.name || "un distrito sin registrar"}. Tiene nivel educativo {pcd.education_level?.name || "no especificado"} y presenta discapacidad tipo {pcd.disability?.name || "no registrada"}.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
