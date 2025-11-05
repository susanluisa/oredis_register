import { useQuery } from "@tanstack/react-query";
import { fetchOrgs } from "@/app/(dashboard)/organizaciones/services/organization";
import type { OrganizationType } from "@/lib/types/org-types";

export function useOrganizations() {
  return useQuery<OrganizationType[]>({
    queryKey: ["organizations"],
    queryFn: () => fetchOrgs({ auth: true }),
  });
}

