import { BudgetCategory } from '@/lib/utils/budget-categories';
import { formatCurrency } from '@/lib/utils/number-formatting';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface SummaryChartProps {
  categories: BudgetCategory[];
  values: Record<string, number>;
  type: 'income' | 'expense';
}

export function SummaryChart({ categories, values, type }: SummaryChartProps) {
  const data = categories
    .filter((cat) => cat.type === type && values[cat.id] > 0)
    .map((category) => ({
      name: category.name,
      value: values[category.id] || 0,
      color: category.color,
    }));

  return (
    <div className="h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => formatCurrency(Number(value))}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}