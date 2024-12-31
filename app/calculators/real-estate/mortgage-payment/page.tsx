'use client';

import { Card } from '@/components/ui/card';
import { CalculatorLayout } from '@/components/calculator-layout';
import { CalculatorInput } from '@/components/calculator-input';
import { CalculatorResult } from '@/components/calculator-result';
import { formatCurrency } from '@/lib/utils/number-formatting';
import { calculateMortgage } from '@/lib/utils/mortgage-calculations';
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

export default function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState(400000);
  const [downPayment, setDownPayment] = useState(80000);
  const [annualRate, setAnnualRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [propertyTax, setPropertyTax] = useState(4800);
  const [insurance, setInsurance] = useState(1200);
  const [pmi, setPMI] = useState(0);

  const result = calculateMortgage(
    homePrice,
    annualRate,
    loanTerm,
    propertyTax,
    insurance,
    pmi,
    downPayment
  );

  return (
    <CalculatorLayout
      title="Mortgage Payment Calculator"
      description="Calculate your monthly mortgage payment including principal, interest, taxes, and insurance (PITI)."
      groupId="real-estate"
      calculatorId="mortgage-payment"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="space-y-4">
            <CalculatorInput
              id="home-price"
              label="Home Price"
              value={homePrice}
              onChange={setHomePrice}
              type="currency"
              min={0}
            />
            <CalculatorInput
              id="down-payment"
              label="Down Payment"
              value={downPayment}
              onChange={setDownPayment}
              type="currency"
              min={0}
              max={homePrice}
            />
            <CalculatorInput
              id="interest-rate"
              label="Interest Rate"
              value={annualRate}
              onChange={setAnnualRate}
              type="percent"
              min={0}
              max={20}
            />
            <CalculatorInput
              id="loan-term"
              label="Loan Term (Years)"
              value={loanTerm}
              onChange={setLoanTerm}
              type="number"
              min={1}
              max={50}
            />
            <CalculatorInput
              id="property-tax"
              label="Annual Property Tax"
              value={propertyTax}
              onChange={setPropertyTax}
              type="currency"
              min={0}
            />
            <CalculatorInput
              id="insurance"
              label="Annual Insurance"
              value={insurance}
              onChange={setInsurance}
              type="currency"
              min={0}
            />
            <CalculatorInput
              id="pmi"
              label="Annual PMI"
              value={pmi}
              onChange={setPMI}
              type="currency"
              min={0}
            />
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Monthly Payment Breakdown</h2>
            <div className="space-y-4">
              <CalculatorResult
                label="Principal & Interest"
                value={formatCurrency(result.monthlyPrincipalAndInterest)}
              />
              <CalculatorResult
                label="Property Tax"
                value={formatCurrency(result.monthlyTax)}
              />
              <CalculatorResult
                label="Insurance"
                value={formatCurrency(result.monthlyInsurance)}
              />
              {result.monthlyPMI > 0 && (
                <CalculatorResult
                  label="PMI"
                  value={formatCurrency(result.monthlyPMI)}
                />
              )}
              <CalculatorResult
                label="Total Monthly Payment"
                value={formatCurrency(result.monthlyTotal)}
                highlighted
              />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Loan Details</h2>
            <div className="space-y-4">
              <CalculatorResult
                label="Down Payment"
                value={`${result.downPaymentPercent}% (${formatCurrency(downPayment)})`}
              />
              <CalculatorResult
                label="Loan to Value"
                value={`${result.loanToValue}%`}
              />
              <CalculatorResult
                label="Total Interest"
                value={formatCurrency(result.totalInterest)}
              />
              <CalculatorResult
                label="Total Cost"
                value={formatCurrency(result.totalCost)}
              />
            </div>
          </Card>
        </div>

        <Card className="md:col-span-2 p-6">
          <h2 className="mb-4 text-xl font-semibold">Amortization Schedule</h2>
          <div className="h-[400px]">
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
                  name="Remaining Balance"
                  type="monotone"
                  dataKey="balance"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
                <Line
                  name="Principal Paid"
                  type="monotone"
                  dataKey="principalPaid"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                />
                <Line
                  name="Interest Paid"
                  type="monotone"
                  dataKey="totalInterest"
                  stroke="hsl(var(--chart-3))"
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