"use client";

import PCDProfile from "../../components/Profile";
import { usePCDRecords } from "@/hooks/use-pcd";

export default function ProfilePage() {
  const { data: PCDRecords = [], isLoading: loadingPCDRecords } = usePCDRecords();

  return (
    <section className="min-h-screen px-6 py-8">
      <div className="mx-auto flex w-full flex-col gap-3 ">
        {!loadingPCDRecords && PCDRecords.length > 0 && (
          <PCDProfile
            pcd={{
              ...PCDRecords[0],
              nationality: null,
              education_level: null,
              socioeconomic_status: null,
              occupation: null,
              district: null,
              disability: null,
            }}
          />
        )}
      </div>
    </section>
  );
}
