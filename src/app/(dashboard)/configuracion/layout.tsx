export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div>
        <h1 className="text-2xl font-semibold text-foreground m-4 mt-0  ">
          Configuración de la encuesta
        </h1>
      </div>
      {children}
    </div>
  )
}
