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

export default function CollegeSavingsCalculator() {
  const [yearsUntilCollege, setYearsUntilCollege] = useState(10);
  const [estimatedYearlyCost, setEstimatedYearlyCost] = useState(25000);
  const [yearsOfCollege, setYearsOfCollege] = useState(4);
  const [currentSavings, setCurrentSavings] = useState(5000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [expectedReturn, setExpectedReturn] = useState(6);

  const calculateProjection = () => {
    let data = [];
    let balance = currentSavings;
    const monthlyRate = expectedReturn / 12 / 100;
    const totalMonths = yearsUntilCollege * 12;

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

  const totalCost = estimatedYearlyCost * yearsOfCollege;
  const projectedSavings = calculateProjection()[calculateProjection().length - 1].balance;
  const shortfall = Math.max(0, totalCost - projectedSavings);
  const data = calculateProjection();

  return (
    <CalculatorLayout
      title="College Savings Calculator"
      description="Plan ahead for education expenses and calculate how much you need to save for college."
      groupId="savings"
      calculatorId="college-savings"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="space-y-4">
            <CalculatorInput
              id="yearsUntil"
              label="Years Until College"
              value={yearsUntilCollege}
              onChange={setYearsUntilCollege}
              type="number"
              min={1}
              max={18}
            />
            <CalculatorInput
              id="yearlyCost"
              label="Estimated Yearly Cost"
              value={estimatedYearlyCost}
              onChange={setEstimatedYearlyCost}
              type="currency"
              min={0}
            />
            <CalculatorInput
              id="yearsOf"
              label="Years of College"
              value={yearsOfCollege}
              onChange={setYearsOfCollege}
              type="number"
              min={1}
              max={8}
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
              label="Expected Annual Return"
              value={expectedReturn}
              onChange={setExpectedReturn}
              type="percent"
              min={0}
              max={20}
            />
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-6 space-y-4">
            <CalculatorResult
              label="Total College Cost"
              value={formatCurrency(totalCost)}
              highlighted
            />
            <CalculatorResult
              label="Projected Savings"
              value={formatCurrency(projectedSavings)}
            />
            <CalculatorResult
              label="Potential Shortfall"
              value={formatCurrency(shortfall)}
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
                  labelFormatter={(value) => `${Math.floor(Number(value) / 12)} years`}
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