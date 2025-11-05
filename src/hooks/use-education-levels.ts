import { useQuery } from "@tanstack/react-query";
import { fetchEducationLevels } from "@/app/(dashboard)/configuracion/catalogos/services/education_levels_services";
import { EducationLevelType } from "@/lib/types/common-settings-types";

export function useEducationLevels() {
  return useQuery<EducationLevelType[]>({
    queryKey: ["education_levels"],
    queryFn: () => fetchEducationLevels({ auth: true }),
  });
}

