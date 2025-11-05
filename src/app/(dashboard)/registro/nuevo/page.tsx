import Link from "next/link";
import CreatePCDPage from "../componentes/PCD-Form";

export default function RegisterAddPage() {
  return (
    <section className="min-h-screen px-6 py-8">
      <div className="mx-auto flex w-full flex-col gap-3 ">
        <header className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-2xl font-semibold text-foreground">
              Nuevo registro de Persona con Discapacidad
            </h1>
            <Link
              href="/registro"
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Volver al listado
            </Link>
          </div>
        </header>
        <CreatePCDPage />
      </div>
    </section>
  );
}
