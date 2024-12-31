'use client';

import { Card } from '@/components/ui/card';
import { CalculatorLayout } from '@/components/calculator-layout';
import { CalculatorInput } from '@/components/calculator-input';
import { CalculatorResult } from '@/components/calculator-result';
import { formatCurrency } from '@/lib/utils/number-formatting';
import { calculateCompoundInterest } from '@/lib/utils/investment-calculations';
import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function FutureValueCalculator() {
  const [presentValue, setPresentValue] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [annualRate, setAnnualRate] = useState(7);
  const [years, setYears] = useState(30);
  const [compoundingFrequency, setCompoundingFrequency] = useState<'monthly' | 'quarterly' | 'annually'>('monthly');

  const result = calculateCompoundInterest(
    presentValue,
    monthlyContribution,
    annualRate,
    years,
    compoundingFrequency
  );

  const inflationAdjustedValue = result.balance / Math.pow(1.02, years);

  return (
    <CalculatorLayout
      title="Future Value Calculator"
      description="Calculate the future value of your investments considering different compounding frequencies and inflation."
      groupId="investing"
      calculatorId="future-value"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="space-y-4">
            <CalculatorInput
              id="present-value"
              label="Present Value"
              value={presentValue}
              onChange={setPresentValue}
              type="currency"
              min={0}
            />
            <CalculatorInput
              id="monthly-contribution"
              label="Monthly Contribution"
              value={monthlyContribution}
              onChange={setMonthlyContribution}
              type="currency"
              min={0}
            />
            <CalculatorInput
              id="annual-rate"
              label="Annual Return Rate"
              value={annualRate}
              onChange={setAnnualRate}
              type="percent"
              min={0}
              max={50}
            />
            <CalculatorInput
              id="years"
              label="Time Period (Years)"
              value={years}
              onChange={setYears}
              type="number"
              min={1}
              max={50}
            />
            <div className="space-y-2">
              <label className="text-sm font-medium">Compounding Frequency</label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={compoundingFrequency}
                onChange={(e) => setCompoundingFrequency(e.target.value as any)}
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
              </select>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-6 space-y-4">
            <CalculatorResult
              label="Future Value"
              value={formatCurrency(result.balance)}
              highlighted
            />
            <CalculatorResult
              label="Total Contributions"
              value={formatCurrency(result.totalContributions)}
            />
            <CalculatorResult
              label="Total Interest Earned"
              value={formatCurrency(result.totalInterest)}
            />
            <CalculatorResult
              label="Inflation-Adjusted Value (2% inflation)"
              value={formatCurrency(inflationAdjustedValue)}
            />
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={result.schedule}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="year"
                  tickFormatter={(value) => `${value}y`}
                />
                <YAxis
                  tickFormatter={(value) => `$${(value / 1000)}k`}
                />
                <Tooltip
                  formatter={(value) => [formatCurrency(Number(value)), '']}
                  labelFormatter={(value) => `Year ${value}`}
                />
                <Legend />
                <Line
                  name="Balance"
                  type="monotone"
                  dataKey="balance"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
                <Line
                  name="Contributions"
                  type="monotone"
                  dataKey="contributions"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="md:col-span-2 p-6">
          <h2 className="text-xl font-semibold mb-4">About Compounding Frequency</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              The frequency of compounding can have a significant impact on your investment's growth:
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-muted p-4">
                <div className="font-medium mb-1">Monthly Compounding</div>
                <div className="text-sm">Interest is calculated and reinvested 12 times per year</div>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <div className="font-medium mb-1">Quarterly Compounding</div>
                <div className="text-sm">Interest is calculated and reinvested 4 times per year</div>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <div className="font-medium mb-1">Annual Compounding</div>
                <div className="text-sm">Interest is calculated and reinvested once per year</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </CalculatorLayout>
  );
}