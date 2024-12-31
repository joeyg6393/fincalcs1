import { Card } from '@/components/ui/card';
import { CalculatorInput } from '@/components/calculator-input';
import { BudgetCategory } from '@/lib/utils/budget-categories';

interface CategoryListProps {
  categories: BudgetCategory[];
  values: Record<string, number>;
  onChange: (id: string, value: number) => void;
  type: 'income' | 'expense';
}

export function CategoryList({
  categories,
  values,
  onChange,
  type,
}: CategoryListProps) {
  const filteredCategories = categories.filter(cat => cat.type === type);
  
  return (
    <Card className="p-6">
      <h2 className="mb-4 text-xl font-semibold">
        {type === 'income' ? 'Income Sources' : 'Expenses'}
      </h2>
      <div className="space-y-4">
        {filteredCategories.map((category) => (
          <CalculatorInput
            key={category.id}
            id={category.id}
            label={category.name}
            value={values[category.id] || 0}
            onChange={(value) => onChange(category.id, value)}
            type="currency"
            min={0}
          />
        ))}
      </div>
    </Card>
  );
}