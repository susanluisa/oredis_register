import { useQuery } from "@tanstack/react-query";
import { fetchSocioeconomicStatuses } from "@/app/(dashboard)/configuracion/catalogos/services/socioeconomic_status_services";
import { SocioeconomicStatusType } from "@/lib/types/common-settings-types";

export function useSocioeconomicStatuses() {
  return useQuery<SocioeconomicStatusType[]>({
    queryKey: ["socioeconomic_statuses"],
    queryFn: () => fetchSocioeconomicStatuses({ auth: true }),
  });
}

