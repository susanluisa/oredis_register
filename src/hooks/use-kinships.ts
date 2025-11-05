import { useQuery } from "@tanstack/react-query";
import { fetchKinships } from "@/app/(dashboard)/configuracion/catalogos/services/kinships_services";
import { KinshipType } from "@/lib/types/common-settings-types";

export function useKinships() {
  return useQuery<KinshipType[]>({
    queryKey: ["kinships"],
    queryFn: () => fetchKinships({ auth: true }),
  });
}

