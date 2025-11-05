import { Button } from "@/components/ui/button";
import Link from "next/link";
import PCDRecordsTable from "./componentes/PCD_Table";

function formatDate(dateString: string) {
  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsed);
}

export default async function RegisterPage() {
  // const records = await fetchRegisterRecords();

  return (
    <section>
      <div className="mx-auto flex w-full pl-4 pr-4 flex-col gap-6">
        <header className="space-y-2 justify-between flex flex-row">
          <h1 className="text-2xl font-semibold text-foreground">
            Registro de Personas con Discapacidad
          </h1>
          <Link href={"registro/nuevo"}>
            <Button className="cursor-pointer">
              Agregar PCD
            </Button>
          </Link>
        </header>
        <main>
          <PCDRecordsTable />
        </main>
      </div>
    </section>
  );
}
