import { CalculatorBreadcrumbs } from './calculator-breadcrumbs';

interface CalculatorLayoutProps {
  title: string;
  description: string;
  groupId: string;
  calculatorId?: string;
  children: React.ReactNode;
}

export function CalculatorLayout({
  title,
  description,
  groupId,
  calculatorId,
  children,
}: CalculatorLayoutProps) {
  return (
    <main className="container py-6 md:py-12">
      <div className="mx-auto max-w-[980px] space-y-8">
        <CalculatorBreadcrumbs groupId={groupId} calculatorId={calculatorId} />
        <div className="space-y-4">
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl">
            {title}
          </h1>
          <p className="text-lg text-muted-foreground">
            {description}
          </p>
        </div>
        {children}
      </div>
    </main>
  );
}