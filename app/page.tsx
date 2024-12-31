import { Card } from '@/components/ui/card';
import { calculatorGroups } from '@/lib/calculator-groups';
import { calculatorIcons } from '@/lib/icons';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="container py-6 md:py-12">
      <div className="mx-auto max-w-[980px] space-y-8">
        <div className="space-y-6 text-center">
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
            Financial Calculators
          </h1>
          <p className="text-lg text-muted-foreground sm:text-xl">
            Make informed financial decisions with our suite of calculators.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {calculatorGroups.map((group) => {
            const Icon = calculatorIcons[group.icon];
            return (
              <Link key={group.id} href={`/calculators/${group.id}`}>
                <Card className="h-full p-6 hover:bg-muted/50">
                  <div className="mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="mb-2 text-xl font-semibold">{group.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {group.description}
                  </p>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}