'use client';

import { Card } from '@/components/ui/card';
import { CalculatorLayout } from '@/components/calculator-layout';
import { CalculatorInput } from '@/components/calculator-input';
import { CalculatorResult } from '@/components/calculator-result';
import { formatCurrency } from '@/lib/utils/number-formatting';
import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function SavingsGoalCalculator() {
  const [targetAmount, setTargetAmount] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(200);
  const [annualReturn, setAnnualReturn] = useState(7);
  const [currentSavings, setCurrentSavings] = useState(1000);

  const calculateTimeToGoal = () => {
    let balance = currentSavings;
    let months = 0;
    const monthlyRate = annualReturn / 12 / 100;

    while (balance < targetAmount && months < 600) {
      balance = balance * (1 + monthlyRate) + monthlyContribution;
      months++;
    }

    return months;
  };

  const generateProjectionData = () => {
    const months = calculateTimeToGoal();
    let data = [];
    let balance = currentSavings;
    const monthlyRate = annualReturn / 12 / 100;

    for (let month = 0; month <= months; month += 3) {
      data.push({
        month,
        balance: Math.round(balance),
      });
      for (let i = 0; i < 3 && month + i <= months; i++) {
        balance = balance * (1 + monthlyRate) + monthlyContribution;
      }
    }

    return data;
  };

  const months = calculateTimeToGoal();
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  const totalContributions = monthlyContribution * months + currentSavings;
  const data = generateProjectionData();

  return (
    <CalculatorLayout
      title="Savings Goal Calculator"
      description="Calculate how long it will take to reach your savings goal with regular contributions."
      groupId="savings"
      calculatorId="savings-goal"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="space-y-4">
            <CalculatorInput
              id="target"
              label="Target Amount"
              value={targetAmount}
              onChange={setTargetAmount}
              type="currency"
              min={0}
            />
            <CalculatorInput
              id="current"
              label="Current Savings"
              value={currentSavings}
              onChange={setCurrentSavings}
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
              max={100}
            />
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-6 space-y-4">
            <CalculatorResult
              label="Time to Reach Goal"
              value={`${years} years${remainingMonths ? ` ${remainingMonths} months` : ''}`}
              highlighted
            />
            <CalculatorResult
              label="Total Contributions"
              value={formatCurrency(totalContributions)}
            />
            <CalculatorResult
              label="Investment Returns"
              value={formatCurrency(targetAmount - totalContributions)}
            />
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickFormatter={(value) => `${Math.floor(value / 12)}y`}
                />
                <YAxis
                  tickFormatter={(value) => `$${(value / 1000)}k`}
                />
                <Tooltip
                  formatter={(value) => [formatCurrency(Number(value)), 'Balance']}
                  labelFormatter={(value) => `${Math.floor(Number(value) / 12)} years ${Number(value) % 12} months`}
                />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="hsl(var(--primary))"
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