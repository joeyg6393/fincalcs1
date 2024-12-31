'use client';

import { Card } from '@/components/ui/card';
import { CalculatorLayout } from '@/components/calculator-layout';
import { CalculatorInput } from '@/components/calculator-input';
import { CalculatorResult } from '@/components/calculator-result';
import { formatCurrency } from '@/lib/utils/number-formatting';
import { calculateInvestmentGrowth } from '@/lib/utils/investment-calculations';
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

export default function InvestmentGrowthCalculator() {
  const [initialBalance, setInitialBalance] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [annualReturn, setAnnualReturn] = useState(8);
  const [years, setYears] = useState(20);
  const [contributionIncrease, setContributionIncrease] = useState(2);

  const result = calculateInvestmentGrowth(
    initialBalance,
    monthlyContribution,
    annualReturn,
    years,
    contributionIncrease
  );

  return (
    <CalculatorLayout
      title="Investment Growth Calculator"
      description="Project your investment growth over time with regular contributions and annual increases."
      groupId="investing"
      calculatorId="investment-growth"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="space-y-4">
            <CalculatorInput
              id="initial"
              label="Initial Balance"
              value={initialBalance}
              onChange={setInitialBalance}
              type="currency"
              min={0}
            />
            <CalculatorInput
              id="monthly"
              label="Monthly Contribution"
              value={monthlyContribution}
              onChange={setMonthlyContribution}
              type="currency"
              min={0}
            />
            <CalculatorInput
              id="return"
              label="Annual Return Rate"
              value={annualReturn}
              onChange={setAnnualReturn}
              type="percent"
              min={0}
              max={50}
            />
            <CalculatorInput
              id="years"
              label="Investment Period (Years)"
              value={years}
              onChange={setYears}
              type="number"
              min={1}
              max={50}
            />
            <CalculatorInput
              id="increase"
              label="Annual Contribution Increase"
              value={contributionIncrease}
              onChange={setContributionIncrease}
              type="percent"
              min={0}
              max={20}
            />
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-6 space-y-4">
            <CalculatorResult
              label="Final Balance"
              value={formatCurrency(result.finalBalance)}
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
                  name="Total Balance"
                  type="monotone"
                  dataKey="balance"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
                <Line
                  name="Total Contributions"
                  type="monotone"
                  dataKey="contributions"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </CalculatorLayout>
  );
}