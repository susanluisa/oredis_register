import CaregiversTable from './components/CaregiversTable';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CaregiverPage() {
  return (
    <section className='min-h-screen'>
      <div className='mx-auto flex w-full pl-4 pr-4 flex-col gap-6'>
        <header className='space-y-2 justify-between flex flex-row'>
          <h1 className='text-2xl font-semibold text-foreground'>
            Cuidadores
          </h1>
          <Link href={'/dashboard/registro'}>
            <Button className='cursor-pointer' variant='outline'>
              Volver a Registro
            </Button>
          </Link>
        </header>
        <main>
          <CaregiversTable />
        </main>
      </div>
    </section>
  );
}