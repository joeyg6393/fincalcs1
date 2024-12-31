import { calculatorGroups } from '@/lib/calculator-groups';
import { Card } from '@/components/ui/card';
import { CalculatorBreadcrumbs } from '@/components/calculator-breadcrumbs';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    group: string;
  };
}

export async function generateMetadata({ params }: Props) {
  const group = calculatorGroups.find((g) => g.id === params.group);
  if (!group) return {};

  return {
    title: `${group.title} | fin-calcs.com`,
    description: group.description,
  };
}

export async function generateStaticParams() {
  return calculatorGroups.map((group) => ({
    group: group.id,
  }));
}

export default function CalculatorGroupPage({ params }: Props) {
  const group = calculatorGroups.find((g) => g.id === params.group);
  
  if (!group) {
    notFound();
  }

  return (
    <main className="container py-6 md:py-12">
      <div className="mx-auto max-w-[980px] space-y-8">
        <CalculatorBreadcrumbs groupId={params.group} />
        <div className="space-y-4">
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl">
            {group.title}
          </h1>
          <p className="text-lg text-muted-foreground">
            {group.description}
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {group.calculators.map((calculator) => (
            <Link key={calculator.id} href={calculator.path}>
              <Card className="h-full p-6 hover:bg-muted/50">
                <h2 className="mb-2 text-xl font-semibold">{calculator.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {calculator.description}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}