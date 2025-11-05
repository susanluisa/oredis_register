import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import QuestionCategory from "./components/QuestionCategory";
import QuestionTypeTypes from "./components/QuestionTypeTypes";
import Questions from "./components/Questions";
import Options from "./components/Options";

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
    name: 'Categoría',
    value: 'questionCategory',
    content: (
      <>
        <QuestionCategory />
      </>
    )
  },
  {
    name: 'Tipos de pregunta',
    value: 'questionTypeTypes',
    content: (
      <>
        <QuestionTypeTypes />
      </>
    )
  },
  {
    name: 'Preguntas',
    value: 'questions',
    content: (
      <>
        <Questions />
      </>
    )
  },
  {
    name: 'Opciones',
    value: 'options',
    content: (
      <>
        <Options />
      </>
    )
  }
]

export default async function CommonSettingsPage() {

  return (
    <section className="min-h-screen">
      <div className="mx-auto flex w-full pl-4 pr-4 flex-col gap-6">
        <main>
          <Tabs defaultValue='questionCategory' className='gap-1'>
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

