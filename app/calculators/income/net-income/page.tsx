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
  calculateNetIncome,
  type Deduction,
} from '@/lib/utils/income-calculations';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function NetIncomeCalculator() {
  const [salary, setSalary] = useState(75000);
  const [frequency, setFrequency] = useState<'weekly' | 'biweekly' | 'monthly' | 'annual'>('annual');
  const [deductions, setDeductions] = useState<Deduction[]>([
    { 
      id: '1', 
      name: '401(k)', 
      amount: 500, 
      frequency: 'monthly', 
      type: 'pretax' 
    },
    { 
      id: '2', 
      name: 'Health Insurance', 
      amount: 200, 
      frequency: 'monthly', 
      type: 'pretax' 
    },
    { 
      id: '3', 
      name: 'Gym Membership', 
      amount: 50, 
      frequency: 'monthly', 
      type: 'posttax' 
    },
  ]);

  const addDeduction = () => {
    const newId = (Math.max(0, ...deductions.map(d => parseInt(d.id))) + 1).toString();
    setDeductions([...deductions, {
      id: newId,
      name: `Deduction ${newId}`,
      amount: 0,
      frequency: 'monthly',
      type: 'pretax',
    }]);
  };

  const removeDeduction = (id: string) => {
    setDeductions(deductions.filter(d => d.id !== id));
  };

  const updateDeduction = (id: string, field: keyof Deduction, value: any) => {
    setDeductions(deductions.map(deduction =>
      deduction.id === id ? { ...deduction, [field]: value } : deduction
    ));
  };

  const breakdown = calculateNetIncome(salary, frequency, deductions);

  const chartData = [
    { name: 'Pre-tax Deductions', amount: breakdown.pretaxDeductions },
    { name: 'Federal Tax', amount: breakdown.federalTax },
    { name: 'Social Security', amount: breakdown.socialSecurity },
    { name: 'Medicare', amount: breakdown.medicare },
    { name: 'Post-tax Deductions', amount: breakdown.posttaxDeductions },
    { name: 'Take Home', amount: breakdown.netIncome },
  ];

  return (
    <CalculatorLayout
      title="Net Income Calculator"
      description="Calculate your take-home pay after taxes and deductions."
      groupId="income"
      calculatorId="net-income"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <CalculatorInput
                id="salary"
                label="Salary"
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
                  <option value="annual">Annual</option>
                </select>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Deductions</h2>
              <Button onClick={addDeduction} variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Deduction
              </Button>
            </div>
            
            <div className="space-y-6">
              {deductions.map((deduction) => (
                <div key={deduction.id} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <CalculatorInput
                      id={`deduction-name-${deduction.id}`}
                      label="Deduction Name"
                      value={deduction.name}
                      onChange={(value) => updateDeduction(deduction.id, 'name', value)}
                      type="text"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDeduction(deduction.id)}
                      className="h-9 px-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <CalculatorInput
                      id={`deduction-amount-${deduction.id}`}
                      label="Amount"
                      value={deduction.amount}
                      onChange={(value) => updateDeduction(deduction.id, 'amount', value)}
                      type="currency"
                      min={0}
                    />
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Frequency</label>
                      <select
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        value={deduction.frequency}
                        onChange={(e) => updateDeduction(deduction.id, 'frequency', e.target.value)}
                      >
                        <option value="perPaycheck">Per Paycheck</option>
                        <option value="monthly">Monthly</option>
                        <option value="annual">Annual</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Type</label>
                      <select
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        value={deduction.type}
                        onChange={(e) => updateDeduction(deduction.id, 'type', e.target.value as 'pretax' | 'posttax')}
                      >
                        <option value="pretax">Pre-tax</option>
                        <option value="posttax">Post-tax</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Income Breakdown</h2>
            <div className="space-y-4">
              <CalculatorResult
                label="Gross Income"
                value={formatCurrency(breakdown.grossIncome)}
              />
              <CalculatorResult
                label="Pre-tax Deductions"
                value={formatCurrency(breakdown.pretaxDeductions)}
              />
              <CalculatorResult
                label="Taxable Income"
                value={formatCurrency(breakdown.taxableIncome)}
              />
              <CalculatorResult
                label="Federal Tax"
                value={formatCurrency(breakdown.federalTax)}
              />
              <CalculatorResult
                label="Social Security"
                value={formatCurrency(breakdown.socialSecurity)}
              />
              <CalculatorResult
                label="Medicare"
                value={formatCurrency(breakdown.medicare)}
              />
              <CalculatorResult
                label="Post-tax Deductions"
                value={formatCurrency(breakdown.posttaxDeductions)}
              />
              <CalculatorResult
                label="Net Income"
                value={formatCurrency(breakdown.netIncome)}
                highlighted
              />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Annual Summary</h2>
            <div className="space-y-4">
              <CalculatorResult
                label="Annual Net Income"
                value={formatCurrency(breakdown.annualNet)}
                highlighted
              />
              <CalculatorResult
                label="Effective Tax Rate"
                value={`${breakdown.effectiveTaxRate.toFixed(1)}%`}
              />
            </div>

            <div className="mt-6 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `$${(value / 1000)}k`} />
                  <Tooltip
                    formatter={(value) => [formatCurrency(Number(value)), 'Amount']}
                  />
                  <Legend />
                  <Bar dataKey="amount" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </CalculatorLayout>
  );
}