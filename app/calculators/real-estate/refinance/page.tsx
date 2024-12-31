'use client';

import { Card } from '@/components/ui/card';
import { CalculatorLayout } from '@/components/calculator-layout';
import { CalculatorInput } from '@/components/calculator-input';
import { CalculatorResult } from '@/components/calculator-result';
import { formatCurrency } from '@/lib/utils/number-formatting';
import { calculateRefinance } from '@/lib/utils/mortgage-calculations';
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

export default function RefinanceCalculator() {
  const [currentBalance, setCurrentBalance] = useState(300000);
  const [currentRate, setCurrentRate] = useState(7.5);
  const [currentTerm, setCurrentTerm] = useState(30);
  const [currentMonthlyPayment, setCurrentMonthlyPayment] = useState(2100);
  const [currentTermRemaining, setCurrentTermRemaining] = useState(28);
  const [newRate, setNewRate] = useState(6.5);
  const [newTerm, setNewTerm] = useState(30);
  const [closingCosts, setClosingCosts] = useState(4000);

  const result = calculateRefinance(
    currentBalance,
    currentRate,
    currentTerm,
    currentMonthlyPayment,
    currentTermRemaining,
    newRate,
    newTerm,
    closingCosts
  );

  return (
    <CalculatorLayout
      title="Refinance Calculator"
      description="Compare your current mortgage with refinancing options to see if refinancing makes sense for you."
      groupId="real-estate"
      calculatorId="refinance"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Current Mortgage</h2>
          <div className="space-y-4">
            <CalculatorInput
              id="current-balance"
              label="Current Balance"
              value={currentBalance}
              onChange={setCurrentBalance}
              type="currency"
              min={0}
            />
            <CalculatorInput
              id="current-rate"
              label="Current Interest Rate"
              value={currentRate}
              onChange={setCurrentRate}
              type="percent"
              min={0}
              max={20}
            />
            <CalculatorInput
              id="current-term"
              label="Original Loan Term (Years)"
              value={currentTerm}
              onChange={setCurrentTerm}
              type="number"
              min={1}
              max={50}
            />
            <CalculatorInput
              id="current-payment"
              label="Current Monthly Payment"
              value={currentMonthlyPayment}
              onChange={setCurrentMonthlyPayment}
              type="currency"
              min={0}
            />
            <CalculatorInput
              id="term-remaining"
              label="Years Remaining"
              value={currentTermRemaining}
              onChange={setCurrentTermRemaining}
              type="number"
              min={1}
              max={currentTerm}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">New Loan</h2>
          <div className="space-y-4">
            <CalculatorInput
              id="new-rate"
              label="New Interest Rate"
              value={newRate}
              onChange={setNewRate}
              type="percent"
              min={0}
              max={20}
            />
            <CalculatorInput
              id="new-term"
              label="New Loan Term (Years)"
              value={newTerm}
              onChange={setNewTerm}
              type="number"
              min={1}
              max={50}
            />
            <CalculatorInput
              id="closing-costs"
              label="Closing Costs"
              value={closingCosts}
              onChange={setClosingCosts}
              type="currency"
              min={0}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Monthly Payment Comparison</h2>
          <div className="space-y-4">
            <CalculatorResult
              label="Current Payment"
              value={formatCurrency(result.currentMonthlyPayment)}
            />
            <CalculatorResult
              label="New Payment"
              value={formatCurrency(result.newMonthlyPayment)}
            />
            <CalculatorResult
              label="Monthly Savings"
              value={formatCurrency(result.monthlyPaymentDiff)}
              highlighted
            />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Lifetime Cost Comparison</h2>
          <div className="space-y-4">
            <CalculatorResult
              label="Current Total Cost"
              value={formatCurrency(result.currentTotalCost)}
            />
            <CalculatorResult
              label="New Total Cost"
              value={formatCurrency(result.newTotalCost)}
            />
            <CalculatorResult
              label="Lifetime Savings"
              value={formatCurrency(result.lifetimeSavings)}
              highlighted
            />
            <CalculatorResult
              label="Break-even Time"
              value={`${result.breakevenMonths} months`}
            />
          </div>
        </Card>

        <Card className="md:col-span-2 p-6">
          <h2 className="mb-4 text-xl font-semibold">Balance Comparison</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart>
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
                  name="Current Loan"
                  type="monotone"
                  data={result.currentSchedule}
                  dataKey="balance"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
                <Line
                  name="New Loan"
                  type="monotone"
                  data={result.newSchedule}
                  dataKey="balance"
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