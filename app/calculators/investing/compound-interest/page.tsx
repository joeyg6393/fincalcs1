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

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(10);
  const [monthlyContribution, setMonthlyContribution] = useState(100);

  const calculateCompoundInterest = () => {
    let data = [];
    let balance = principal;
    const monthlyRate = rate / 12 / 100;
    const totalMonths = years * 12;

    for (let month = 0; month <= totalMonths; month += 3) {
      data.push({
        month,
        balance: Math.round(balance),
      });
      for (let i = 0; i < 3 && month + i <= totalMonths; i++) {
        balance = balance * (1 + monthlyRate) + monthlyContribution;
      }
    }

    return data;
  };

  const data = calculateCompoundInterest();
  const finalBalance = data[data.length - 1].balance;
  const totalContributions = principal + monthlyContribution * 12 * years;
  const totalInterest = finalBalance - totalContributions;

  return (
    <CalculatorLayout
      title="Compound Interest Calculator"
      description="See how your investments can grow over time with compound interest."
      groupId="investing"
      calculatorId="compound-interest"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="space-y-4">
            <CalculatorInput
              id="principal"
              label="Initial Investment"
              value={principal}
              onChange={setPrincipal}
              type="currency"
              min={0}
            />
            <CalculatorInput
              id="rate"
              label="Annual Interest Rate"
              value={rate}
              onChange={setRate}
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
            <CalculatorInput
              id="monthly"
              label="Monthly Contribution"
              value={monthlyContribution}
              onChange={setMonthlyContribution}
              type="currency"
              min={0}
            />
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-6 space-y-4">
            <CalculatorResult
              label="Final Balance"
              value={formatCurrency(finalBalance)}
              highlighted
            />
            <CalculatorResult
              label="Total Contributions"
              value={formatCurrency(totalContributions)}
            />
            <CalculatorResult
              label="Total Interest Earned"
              value={formatCurrency(totalInterest)}
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