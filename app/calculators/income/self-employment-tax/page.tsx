'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalculatorLayout } from '@/components/calculator-layout';
import { CalculatorInput } from '@/components/calculator-input';
import { CalculatorResult } from '@/components/calculator-result';
import { formatCurrency } from '@/lib/utils/number-formatting';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
  calculateSelfEmploymentTax,
  type BusinessExpense,
} from '@/lib/utils/income-calculations';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

export default function SelfEmploymentTaxCalculator() {
  const [income, setIncome] = useState(75000);
  const [expenses, setExpenses] = useState<BusinessExpense[]>([
    { id: '1', name: 'Office Supplies', amount: 2000 },
    { id: '2', name: 'Software Subscriptions', amount: 1200 },
    { id: '3', name: 'Professional Services', amount: 3000 },
  ]);

  const addExpense = () => {
    const newId = (Math.max(0, ...expenses.map(e => parseInt(e.id))) + 1).toString();
    setExpenses([...expenses, {
      id: newId,
      name: `Expense ${newId}`,
      amount: 0,
    }]);
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const updateExpense = (id: string, field: keyof BusinessExpense, value: any) => {
    setExpenses(expenses.map(expense =>
      expense.id === id ? { ...expense, [field]: value } : expense
    ));
  };

  const breakdown = calculateSelfEmploymentTax(income, expenses);

  const chartData = [
    { name: 'Social Security Tax', value: breakdown.socialSecurityTax },
    { name: 'Medicare Tax', value: breakdown.medicareTax },
    { name: 'Net After SE Tax', value: breakdown.netEarnings - breakdown.totalSETax },
  ];

  const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
  ];

  const quarterlyDueDates = [
    'April 15, 2024',
    'June 15, 2024',
    'September 15, 2024',
    'January 15, 2025',
  ];

  return (
    <CalculatorLayout
      title="Self-Employment Tax Calculator"
      description="Calculate your self-employment tax obligations, including Social Security and Medicare taxes."
      groupId="income"
      calculatorId="self-employment-tax"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <CalculatorInput
                id="income"
                label="Annual Business Income"
                value={income}
                onChange={setIncome}
                type="currency"
                min={0}
              />
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Business Expenses</h2>
              <Button onClick={addExpense} variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Expense
              </Button>
            </div>
            
            <div className="space-y-6">
              {expenses.map((expense) => (
                <div key={expense.id} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <CalculatorInput
                      id={`expense-name-${expense.id}`}
                      label="Expense Name"
                      value={expense.name}
                      onChange={(value) => updateExpense(expense.id, 'name', value)}
                      type="text"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExpense(expense.id)}
                      className="h-9 px-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <CalculatorInput
                    id={`expense-amount-${expense.id}`}
                    label="Annual Amount"
                    value={expense.amount}
                    onChange={(value) => updateExpense(expense.id, 'amount', value)}
                    type="currency"
                    min={0}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Tax Breakdown</h2>
            <div className="space-y-4">
              <CalculatorResult
                label="Gross Income"
                value={formatCurrency(breakdown.grossIncome)}
              />
              <CalculatorResult
                label="Total Expenses"
                value={formatCurrency(breakdown.totalExpenses)}
              />
              <CalculatorResult
                label="Net Earnings"
                value={formatCurrency(breakdown.netEarnings)}
              />
              <CalculatorResult
                label="Social Security Tax"
                value={formatCurrency(breakdown.socialSecurityTax)}
              />
              <CalculatorResult
                label="Medicare Tax"
                value={formatCurrency(breakdown.medicareTax)}
              />
              <CalculatorResult
                label="Total Self-Employment Tax"
                value={formatCurrency(breakdown.totalSETax)}
                highlighted
              />
              <CalculatorResult
                label="Tax Deduction"
                value={formatCurrency(breakdown.taxDeduction)}
              />
              <CalculatorResult
                label="Effective Tax Rate"
                value={`${breakdown.effectiveRate.toFixed(1)}%`}
              />
            </div>

            <div className="mt-6 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    label
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Quarterly Payments</h2>
            <div className="space-y-4">
              <CalculatorResult
                label="Quarterly Payment Amount"
                value={formatCurrency(breakdown.quarterlyPayments)}
                highlighted
              />
              <div className="mt-4">
                <h3 className="mb-2 text-sm font-medium">2024 Due Dates</h3>
                <div className="space-y-2 text-sm">
                  {quarterlyDueDates.map((date, index) => (
                    <div key={date} className="flex items-center justify-between">
                      <span>Q{index + 1} Payment</span>
                      <span className="text-muted-foreground">{date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </CalculatorLayout>
  );
}