'use client';

import { Card } from '@/components/ui/card';
import { CalculatorLayout } from '@/components/calculator-layout';
import { CalculatorInput } from '@/components/calculator-input';
import { CalculatorResult } from '@/components/calculator-result';
import { formatCurrency } from '@/lib/utils/number-formatting';
import { calculateLoanPayment } from '@/lib/utils/debt-calculations';
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

export default function LoanPayoffCalculator() {
  const [loanAmount, setLoanAmount] = useState(200000);
  const [annualRate, setAnnualRate] = useState(5.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [extraPayment, setExtraPayment] = useState(0);

  const {
    monthlyPayment,
    totalInterest,
    actualPayments,
    schedule,
  } = calculateLoanPayment(loanAmount, annualRate, loanTerm, extraPayment);

  const totalPayments = monthlyPayment * actualPayments + extraPayment * actualPayments;
  const yearsToPayoff = actualPayments / 12;

  return (
    <CalculatorLayout
      title="Loan Payoff Calculator"
      description="Calculate your loan payments and see how extra payments can help you become debt-free faster."
      groupId="debt"
      calculatorId="loan-payoff"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="space-y-4">
            <CalculatorInput
              id="amount"
              label="Loan Amount"
              value={loanAmount}
              onChange={setLoanAmount}
              type="currency"
              min={0}
            />
            <CalculatorInput
              id="rate"
              label="Annual Interest Rate"
              value={annualRate}
              onChange={setAnnualRate}
              type="percent"
              min={0}
              max={30}
            />
            <CalculatorInput
              id="term"
              label="Loan Term (Years)"
              value={loanTerm}
              onChange={setLoanTerm}
              type="number"
              min={1}
              max={50}
            />
            <CalculatorInput
              id="extra"
              label="Extra Monthly Payment"
              value={extraPayment}
              onChange={setExtraPayment}
              type="currency"
              min={0}
            />
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-6 space-y-4">
            <CalculatorResult
              label="Monthly Payment"
              value={formatCurrency(monthlyPayment + extraPayment)}
              highlighted
            />
            <CalculatorResult
              label="Total Interest"
              value={formatCurrency(totalInterest)}
            />
            <CalculatorResult
              label="Total Cost"
              value={formatCurrency(totalPayments)}
            />
            <CalculatorResult
              label="Years to Pay Off"
              value={yearsToPayoff.toFixed(1)}
            />
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={schedule}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="year"
                  tickFormatter={(value) => `${value}y`}
                />
                <YAxis
                  tickFormatter={(value) => `$${(value / 1000)}k`}
                />
                <Tooltip
                  formatter={(value) => [formatCurrency(Number(value)), 'Balance']}
                  labelFormatter={(value) => `Year ${value}`}
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