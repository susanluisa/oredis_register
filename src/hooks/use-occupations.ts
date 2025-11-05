import { useQuery } from "@tanstack/react-query";
import { fetchOccupations } from "@/app/(dashboard)/configuracion/catalogos/services/occupations_services";
import { OccupationType } from "@/lib/types/common-settings-types";

export function useOccupations() {
  return useQuery<OccupationType[]>({
    queryKey: ["occupations"],
    queryFn: () => fetchOccupations({ auth: true }),
  });
}

