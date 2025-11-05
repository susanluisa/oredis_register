import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CountriesTable from "./components/CountriesTable";
import RegionsTable from "./components/RegionsTable";
import DocumentTypesTable from "./components/DocumentTypesTable";
import ProvincesTable from "./components/ProvincesTable";
import DistrictsTable from "./components/DistrictsTable";
import CaregiverRolesTable from "./components/CaregiverRolesTable";
import EducationLevelsTable from "./components/EducationLevelsTable";
import SocioeconomicStatusesTable from "./components/SocioeconomicStatusesTable";
import OccupationsTable from "./components/OccupationsTable";
import KinshipsTable from "./components/KinshipsTable";
import DisabilitiesTable from "./components/DisabilitiesTable";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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

const tabs = [
  {
    name: 'Tipos de documentos',
    value: 'document_types',
    content: (
      <>
        <DocumentTypesTable />
      </>
    )
  },
  {
    name: 'Discapacidades',
    value: 'disabilities',
    content: (
      <>
        <DisabilitiesTable />
      </>
    )
  },
  {
    name: 'Parentescos',
    value: 'kinships',
    content: (
      <>
        <KinshipsTable />
      </>
    )
  },
  {
    name: 'Niveles educativos',
    value: 'education_levels',
    content: (
      <>
        <EducationLevelsTable />
      </>
    )
  },
  {
    name: 'Situación socioeconómica',
    value: 'socioeconomic_statuses',
    content: (
      <>
        <SocioeconomicStatusesTable />
      </>
    )
  },
  {
    name: 'Ocupaciones',
    value: 'occupations',
    content: (
      <>
        <OccupationsTable />
      </>
    )
  },
  {
    name: 'Roles de cuidadores',
    value: 'caregiver_roles',
    content: (
      <>
        <CaregiverRolesTable />
      </>
    )
  },
  {
    name: 'Paises',
    value: 'countries',
    content: (
      <>
        <CountriesTable />
      </>
    )
  },
  {
    name: 'Regiones',
    value: 'regions',
    content: (
      <>
        <RegionsTable />
      </>
    )
  },
  {
    name: 'Provincias',
    value: 'provinces',
    content: (
      <>
        <ProvincesTable />
      </>
    )
  },
  {
    name: 'Distritos',
    value: 'districts',
    content: (
      <>
        <DistrictsTable />
      </>
    )
  }
]

export default async function CommonSettingsPage() {

  return (
    <section className="min-h-screen">
      <div className="mx-auto flex w-full pl-4 pr-4 flex-col gap-6">
        <main>
          <Tabs defaultValue='document_types' className='gap-1'>
            <ScrollArea>
              <TabsList className='bg-background gap-1' >
                {tabs.map(tab => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className='data-[state=active]:bg-primary/20 data-[state=active]:text-primary dark:data-[state=active]:text-primary dark:data-[state=active]:bg-primary/20 data-[state=active]:shadow-none dark:data-[state=active]:border-transparent'
                  >
                    {tab.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              <ScrollBar />
            </ScrollArea>
            {tabs.map(tab => (
              <TabsContent key={tab.value} value={tab.value}>
                <div>{tab.content}</div>
              </TabsContent>
            ))}
          </Tabs>
        </main>
      </div>
    </section>
  );
}
