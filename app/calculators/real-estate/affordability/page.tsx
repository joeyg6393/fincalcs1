'use client';

import { Card } from '@/components/ui/card';
import { CalculatorLayout } from '@/components/calculator-layout';
import { CalculatorInput } from '@/components/calculator-input';
import { CalculatorResult } from '@/components/calculator-result';
import { formatCurrency } from '@/lib/utils/number-formatting';
import { calculateHomeAffordability } from '@/lib/utils/mortgage-calculations';
import { useState } from 'react';

export default function HomeAffordabilityCalculator() {
  const [monthlyIncome, setMonthlyIncome] = useState(8000);
  const [monthlyDebts, setMonthlyDebts] = useState(500);
  const [downPayment, setDownPayment] = useState(60000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [propertyTaxRate, setPropertyTaxRate] = useState(1.2);
  const [insuranceRate, setInsuranceRate] = useState(0.3);
  const [loanTerm, setLoanTerm] = useState(30);

  const result = calculateHomeAffordability(
    monthlyIncome,
    monthlyDebts,
    downPayment,
    interestRate,
    propertyTaxRate,
    insuranceRate,
    loanTerm
  );

  return (
    <CalculatorLayout
      title="Home Affordability Calculator"
      description="Calculate how much house you can afford based on your income, debts, and down payment."
      groupId="real-estate"
      calculatorId="home-affordability"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Income & Debts</h2>
          <div className="space-y-4">
            <CalculatorInput
              id="monthly-income"
              label="Monthly Income"
              value={monthlyIncome}
              onChange={setMonthlyIncome}
              type="currency"
              min={0}
            />
            <CalculatorInput
              id="monthly-debts"
              label="Monthly Debt Payments"
              value={monthlyDebts}
              onChange={setMonthlyDebts}
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
            />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Loan Details</h2>
          <div className="space-y-4">
            <CalculatorInput
              id="interest-rate"
              label="Interest Rate"
              value={interestRate}
              onChange={setInterestRate}
              type="percent"
              min={0}
              max={20}
            />
            <CalculatorInput
              id="property-tax-rate"
              label="Property Tax Rate"
              value={propertyTaxRate}
              onChange={setPropertyTaxRate}
              type="percent"
              min={0}
              max={5}
            />
            <CalculatorInput
              id="insurance-rate"
              label="Insurance Rate"
              value={insuranceRate}
              onChange={setInsuranceRate}
              type="percent"
              min={0}
              max={2}
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
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Maximum Purchase Price</h2>
          <div className="space-y-4">
            <CalculatorResult
              label="Maximum Home Price"
              value={formatCurrency(result.maxHomePrice)}
              highlighted
            />
            <CalculatorResult
              label="Maximum Loan Amount"
              value={formatCurrency(result.maxLoanAmount)}
            />
            <CalculatorResult
              label="Down Payment"
              value={`${result.downPaymentPercent.toFixed(1)}% (${formatCurrency(downPayment)})`}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Monthly Payment Breakdown</h2>
          <div className="space-y-4">
            <CalculatorResult
              label="Principal & Interest"
              value={formatCurrency(result.monthlyPrincipalAndInterest)}
            />
            <CalculatorResult
              label="Property Tax"
              value={formatCurrency(result.monthlyPropertyTax)}
            />
            <CalculatorResult
              label="Insurance"
              value={formatCurrency(result.monthlyInsurance)}
            />
            <CalculatorResult
              label="Total Monthly Payment"
              value={formatCurrency(result.monthlyPayment)}
              highlighted
            />
          </div>
        </Card>

        <Card className="md:col-span-2 p-6">
          <h2 className="mb-4 text-xl font-semibold">Debt Ratios</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-4">
              <CalculatorResult
                label="Payment to Income Ratio"
                value={`${result.paymentToIncomeRatio.toFixed(1)}%`}
              />
              <div className="text-sm text-muted-foreground">
                <p>Recommended: Below 28%</p>
                <div className="mt-2 h-2 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${Math.min(100, (result.paymentToIncomeRatio / 28) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <CalculatorResult
                label="Debt to Income Ratio"
                value={`${result.debtToIncomeRatio.toFixed(1)}%`}
              />
              <div className="text-sm text-muted-foreground">
                <p>Recommended: Below 43%</p>
                <div className="mt-2 h-2 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${Math.min(100, (result.debtToIncomeRatio / 43) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </CalculatorLayout>
  );
}