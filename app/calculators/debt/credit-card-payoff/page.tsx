'use client';

import { Card } from '@/components/ui/card';
import { CalculatorLayout } from '@/components/calculator-layout';
import { CalculatorInput } from '@/components/calculator-input';
import { CalculatorResult } from '@/components/calculator-result';
import { formatCurrency } from '@/lib/utils/number-formatting';
import { calculateCreditCardPayoff } from '@/lib/utils/debt-calculations';
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

export default function CreditCardPayoffCalculator() {
  const [balance, setBalance] = useState(5000);
  const [annualRate, setAnnualRate] = useState(18.9);
  const [monthlyPayment, setMonthlyPayment] = useState(200);

  const {
    months,
    totalInterest,
    schedule,
  } = calculateCreditCardPayoff(balance, annualRate, monthlyPayment);

  const totalPayment = balance + totalInterest;
  const yearsToPayoff = months / 12;

  return (
    <CalculatorLayout
      title="Credit Card Payoff Calculator"
      description="Calculate how long it will take to pay off your credit card debt and see the impact of different payment strategies."
      groupId="debt"
      calculatorId="credit-card-payoff"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="space-y-4">
            <CalculatorInput
              id="balance"
              label="Current Balance"
              value={balance}
              onChange={setBalance}
              type="currency"
              min={0}
            />
            <CalculatorInput
              id="rate"
              label="Annual Interest Rate (APR)"
              value={annualRate}
              onChange={setAnnualRate}
              type="percent"
              min={0}
              max={50}
            />
            <CalculatorInput
              id="payment"
              label="Monthly Payment"
              value={monthlyPayment}
              onChange={setMonthlyPayment}
              type="currency"
              min={0}
            />
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-6 space-y-4">
            <CalculatorResult
              label="Time to Pay Off"
              value={`${Math.floor(yearsToPayoff)} years ${months % 12} months`}
              highlighted
            />
            <CalculatorResult
              label="Total Interest"
              value={formatCurrency(totalInterest)}
            />
            <CalculatorResult
              label="Total Payment"
              value={formatCurrency(totalPayment)}
            />
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={schedule}>
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