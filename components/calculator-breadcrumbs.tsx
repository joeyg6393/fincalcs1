import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { calculatorGroups } from '@/lib/calculator-groups';
import { Fragment } from 'react';

interface BreadcrumbsProps {
  groupId: string;
  calculatorId?: string;
}

export function CalculatorBreadcrumbs({ groupId, calculatorId }: BreadcrumbsProps) {
  const group = calculatorGroups.find(g => g.id === groupId);
  const calculator = group?.calculators.find(c => c.id === calculatorId);

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
      {[
        { href: '/', label: 'Home' },
        group && { href: `/calculators/${group.id}`, label: group.title },
        calculator && { href: calculator.path, label: calculator.title }
      ].filter(Boolean).map((item, index, array) => (
        <Fragment key={item!.href}>
          {index > 0 && <ChevronRight className="h-4 w-4" />}
          {index === array.length - 1 ? (
            <span className="text-foreground">{item!.label}</span>
          ) : (
            <Link href={item!.href} className="hover:text-foreground">
              {item!.label}
            </Link>
          )}
        </Fragment>
      ))}
    </nav>
  );
}