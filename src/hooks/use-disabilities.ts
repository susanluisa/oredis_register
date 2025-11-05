import { useQuery } from "@tanstack/react-query";
import { fetchDisabilities } from "@/app/(dashboard)/configuracion/catalogos/services/disabilities_services";
import { DisabilityType } from "@/lib/types/pcd-types";

export function useDisabilities() {
  return useQuery<DisabilityType[]>({
    queryKey: ["disabilities"],
    queryFn: () => fetchDisabilities({ auth: true }),
  });
}

