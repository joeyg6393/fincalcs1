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
  calculateWithholding,
  type WithholdingAllowance,
} from '@/lib/utils/income-calculations';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

export default function TaxWithholdingCalculator() {
  const [salary, setSalary] = useState(4000);
  const [frequency, setFrequency] = useState<'weekly' | 'biweekly' | 'monthly'>('biweekly');
  const [additionalWithholding, setAdditionalWithholding] = useState(0);
  const [allowances, setAllowances] = useState<WithholdingAllowance[]>([
    { id: '1', name: 'Standard Deduction', amount: 14600 },
  ]);

  const addAllowance = () => {
    const newId = (Math.max(0, ...allowances.map(a => parseInt(a.id))) + 1).toString();
    setAllowances([...allowances, {
      id: newId,
      name: `Allowance ${newId}`,
      amount: 0,
    }]);
  };

  const removeAllowance = (id: string) => {
    setAllowances(allowances.filter(a => a.id !== id));
  };

  const updateAllowance = (id: string, field: keyof WithholdingAllowance, value: any) => {
    setAllowances(allowances.map(allowance =>
      allowance.id === id ? { ...allowance, [field]: value } : allowance
    ));
  };

  const withholding = calculateWithholding(
    salary,
    frequency,
    allowances,
    additionalWithholding
  );

  const chartData = [
    { name: 'Federal Tax', value: withholding.federalWithholding },
    { name: 'Social Security', value: withholding.socialSecurity },
    { name: 'Medicare', value: withholding.medicare },
    { name: 'Take Home', value: withholding.netPay },
  ];

  const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
  ];

  return (
    <CalculatorLayout
      title="Tax Withholding Calculator"
      description="Estimate your paycheck withholdings and take-home pay based on your salary and tax allowances."
      groupId="income"
      calculatorId="tax-withholding"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <CalculatorInput
                id="salary"
                label="Salary per Pay Period"
                value={salary}
                onChange={setSalary}
                type="currency"
                min={0}
              />
              <div className="space-y-2">
                <label className="text-sm font-medium">Pay Frequency</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as any)}
                >
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <CalculatorInput
                id="additional"
                label="Additional Withholding"
                value={additionalWithholding}
                onChange={setAdditionalWithholding}
                type="currency"
                min={0}
              />
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Tax Allowances</h2>
              <Button onClick={addAllowance} variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Allowance
              </Button>
            </div>
            
            <div className="space-y-6">
              {allowances.map((allowance) => (
                <div key={allowance.id} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <CalculatorInput
                      id={`allowance-name-${allowance.id}`}
                      label="Allowance Name"
                      value={allowance.name}
                      onChange={(value) => updateAllowance(allowance.id, 'name', value)}
                      type="text"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAllowance(allowance.id)}
                      className="h-9 px-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <CalculatorInput
                    id={`allowance-amount-${allowance.id}`}
                    label="Annual Amount"
                    value={allowance.amount}
                    onChange={(value) => updateAllowance(allowance.id, 'amount', value)}
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
            <h2 className="mb-4 text-xl font-semibold">Paycheck Breakdown</h2>
            <div className="space-y-4">
              <CalculatorResult
                label="Gross Pay"
                value={formatCurrency(withholding.grossPay)}
              />
              <CalculatorResult
                label="Federal Withholding"
                value={formatCurrency(withholding.federalWithholding)}
              />
              <CalculatorResult
                label="Social Security"
                value={formatCurrency(withholding.socialSecurity)}
              />
              <CalculatorResult
                label="Medicare"
                value={formatCurrency(withholding.medicare)}
              />
              <CalculatorResult
                label="Total Withholding"
                value={formatCurrency(withholding.totalWithholding)}
              />
              <CalculatorResult
                label="Net Pay"
                value={formatCurrency(withholding.netPay)}
                highlighted
              />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Annual Projection</h2>
            <div className="space-y-4">
              <CalculatorResult
                label="Annual Withholding"
                value={formatCurrency(withholding.annualWithholding)}
              />
              <CalculatorResult
                label="Annual Net Income"
                value={formatCurrency(withholding.annualNet)}
                highlighted
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
        </div>
      </div>
    </CalculatorLayout>
  );
}