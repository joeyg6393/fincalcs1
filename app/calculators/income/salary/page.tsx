'use client';

import { Card } from '@/components/ui/card';
import { CalculatorLayout } from '@/components/calculator-layout';
import { CalculatorInput } from '@/components/calculator-input';
import { CalculatorResult } from '@/components/calculator-result';
import { formatCurrency } from '@/lib/utils/number-formatting';
import { calculateSalaryBreakdown, calculateTaxes } from '@/lib/utils/income-calculations';
import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function SalaryCalculator() {
  const [amount, setAmount] = useState(50000);
  const [frequency, setFrequency] = useState<'hourly' | 'weekly' | 'biweekly' | 'monthly' | 'annual'>('annual');
  const [hoursPerWeek, setHoursPerWeek] = useState(40);

  const breakdown = calculateSalaryBreakdown(amount, frequency, hoursPerWeek);
  const taxes = calculateTaxes(breakdown.annual);

  const taxData = [
    { name: 'Federal Tax', amount: taxes.federalTax },
    { name: 'Social Security', amount: taxes.socialSecurity },
    { name: 'Medicare', amount: taxes.medicare },
    { name: 'Take Home', amount: taxes.netIncome },
  ];

  return (
    <CalculatorLayout
      title="Salary Calculator"
      description="Calculate your salary across different pay periods and estimate your take-home pay after taxes."
      groupId="income"
      calculatorId="salary"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="space-y-4">
            <CalculatorInput
              id="amount"
              label="Salary Amount"
              value={amount}
              onChange={setAmount}
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
                <option value="hourly">Hourly</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="annual">Annual</option>
              </select>
            </div>
            {frequency === 'hourly' && (
              <CalculatorInput
                id="hours"
                label="Hours per Week"
                value={hoursPerWeek}
                onChange={setHoursPerWeek}
                type="number"
                min={1}
                max={168}
              />
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Salary Breakdown</h2>
          <div className="space-y-4">
            <CalculatorResult
              label="Annual Salary"
              value={formatCurrency(breakdown.annual)}
              highlighted
            />
            <CalculatorResult
              label="Monthly"
              value={formatCurrency(breakdown.monthly)}
            />
            <CalculatorResult
              label="Bi-Weekly"
              value={formatCurrency(breakdown.biweekly)}
            />
            <CalculatorResult
              label="Weekly"
              value={formatCurrency(breakdown.weekly)}
            />
            <CalculatorResult
              label="Daily Average"
              value={formatCurrency(breakdown.dailyAverage)}
            />
            <CalculatorResult
              label="Hourly"
              value={formatCurrency(breakdown.hourly)}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Tax Breakdown</h2>
          <div className="space-y-4">
            <CalculatorResult
              label="Gross Income"
              value={formatCurrency(taxes.grossIncome)}
            />
            <CalculatorResult
              label="Federal Income Tax"
              value={formatCurrency(taxes.federalTax)}
            />
            <CalculatorResult
              label="Social Security"
              value={formatCurrency(taxes.socialSecurity)}
            />
            <CalculatorResult
              label="Medicare"
              value={formatCurrency(taxes.medicare)}
            />
            <CalculatorResult
              label="Total Tax"
              value={formatCurrency(taxes.totalTax)}
            />
            <CalculatorResult
              label="Net Income"
              value={formatCurrency(taxes.netIncome)}
              highlighted
            />
            <CalculatorResult
              label="Effective Tax Rate"
              value={`${taxes.effectiveTaxRate.toFixed(1)}%`}
            />
            <CalculatorResult
              label="Marginal Tax Rate"
              value={`${taxes.marginalTaxRate}%`}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Tax Distribution</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taxData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `$${(value / 1000)}k`} />
                <Tooltip
                  formatter={(value) => [formatCurrency(Number(value)), 'Amount']}
                />
                <Bar dataKey="amount" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </CalculatorLayout>
  );
}