'use client';

import { Card } from '@/components/ui/card';
import { CalculatorLayout } from '@/components/calculator-layout';
import { CategoryList } from '@/components/budget/category-list';
import { SummaryChart } from '@/components/budget/summary-chart';
import { CalculatorResult } from '@/components/calculator-result';
import { defaultCategories } from '@/lib/utils/budget-categories';
import { formatCurrency } from '@/lib/utils/number-formatting';
import { useState } from 'react';

export default function BudgetPlannerCalculator() {
  const [values, setValues] = useState<Record<string, number>>({});

  const handleValueChange = (id: string, value: number) => {
    setValues((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const totalIncome = defaultCategories
    .filter((cat) => cat.type === 'income')
    .reduce((sum, cat) => sum + (values[cat.id] || 0), 0);

  const totalExpenses = defaultCategories
    .filter((cat) => cat.type === 'expense')
    .reduce((sum, cat) => sum + (values[cat.id] || 0), 0);

  const surplus = totalIncome - totalExpenses;

  return (
    <CalculatorLayout
      title="Budget Planner"
      description="Plan and analyze your monthly budget with our comprehensive budget calculator."
      groupId="savings"
      calculatorId="budget-planner"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <CategoryList
            categories={defaultCategories}
            values={values}
            onChange={handleValueChange}
            type="income"
          />
          <CategoryList
            categories={defaultCategories}
            values={values}
            onChange={handleValueChange}
            type="expense"
          />
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Summary</h2>
            <div className="mb-6 space-y-4">
              <CalculatorResult
                label="Total Monthly Income"
                value={formatCurrency(totalIncome)}
              />
              <CalculatorResult
                label="Total Monthly Expenses"
                value={formatCurrency(totalExpenses)}
              />
              <CalculatorResult
                label="Monthly Surplus/Deficit"
                value={formatCurrency(surplus)}
                highlighted={surplus > 0}
              />
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="mb-2 text-sm font-medium">Income Breakdown</h3>
                <SummaryChart
                  categories={defaultCategories}
                  values={values}
                  type="income"
                />
              </div>
              <div>
                <h3 className="mb-2 text-sm font-medium">Expense Breakdown</h3>
                <SummaryChart
                  categories={defaultCategories}
                  values={values}
                  type="expense"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </CalculatorLayout>
  );
}