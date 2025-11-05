import { useQuery } from "@tanstack/react-query";
import { fetchOffices } from "@/app/(dashboard)/omaped/services/offices_services";
import type { Office } from "@/lib/types/office-types";

export function useOffices() {
  return useQuery<Office[]>({
    queryKey: ["offices"],
    queryFn: () => fetchOffices({ auth: true }),
  });
}

