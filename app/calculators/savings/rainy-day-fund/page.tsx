'use client';

import { Card } from '@/components/ui/card';
import { CalculatorLayout } from '@/components/calculator-layout';
import { CalculatorInput } from '@/components/calculator-input';
import { CalculatorResult } from '@/components/calculator-result';
import { formatCurrency } from '@/lib/utils/number-formatting';
import { useState } from 'react';

export default function RainyDayFundCalculator() {
  const [monthlyIncome, setMonthlyIncome] = useState(5000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(3500);
  const [riskLevel, setRiskLevel] = useState(3);
  const [currentSavings, setCurrentSavings] = useState(2000);
  const [monthlyContribution, setMonthlyContribution] = useState(300);

  // Calculate recommended fund size based on risk level and monthly expenses
  const calculateRecommendedFund = () => {
    const baseMultiplier = {
      '1': 1, // Low risk - 1 month of expenses
      '2': 2, // Medium-low risk - 2 months of expenses
      '3': 3, // Medium risk - 3 months of expenses
      '4': 4, // Medium-high risk - 4 months of expenses
      '5': 6, // High risk - 6 months of expenses
    }[riskLevel.toString()] || 3; // Default to medium risk if invalid level

    return monthlyExpenses * baseMultiplier;
  };

  const recommendedAmount = calculateRecommendedFund();
  const surplus = monthlyIncome - monthlyExpenses;
  const remaining = Math.max(0, recommendedAmount - currentSavings);
  const monthsToGoal = remaining > 0 ? Math.ceil(remaining / monthlyContribution) : 0;

  return (
    <CalculatorLayout
      title="Rainy Day Fund Calculator"
      description="Calculate how much you should set aside for unexpected expenses based on your risk level and financial situation."
      groupId="savings"
      calculatorId="rainy-day-fund"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="space-y-4">
            <CalculatorInput
              id="income"
              label="Monthly Income"
              value={monthlyIncome}
              onChange={setMonthlyIncome}
              type="currency"
              min={0}
            />
            <CalculatorInput
              id="expenses"
              label="Monthly Expenses"
              value={monthlyExpenses}
              onChange={setMonthlyExpenses}
              type="currency"
              min={0}
            />
            <CalculatorInput
              id="risk"
              label="Risk Level (1-5)"
              value={riskLevel}
              onChange={setRiskLevel}
              type="number"
              min={1}
              max={5}
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
              id="contribution"
              label="Monthly Contribution"
              value={monthlyContribution}
              onChange={setMonthlyContribution}
              type="currency"
              min={0}
            />
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <CalculatorResult
              label="Recommended Rainy Day Fund"
              value={formatCurrency(recommendedAmount)}
              highlighted
            />
            <CalculatorResult
              label="Monthly Surplus"
              value={formatCurrency(surplus)}
            />
            <CalculatorResult
              label="Current Progress"
              value={`${Math.min(100, Math.round((currentSavings / recommendedAmount) * 100))}%`}
            />
            <CalculatorResult
              label="Amount Remaining"
              value={formatCurrency(remaining)}
            />
            {monthsToGoal > 0 && (
              <CalculatorResult
                label="Time to Reach Goal"
                value={`${monthsToGoal} months`}
              />
            )}
          </div>

          <div className="mt-6">
            <div className="mb-2 text-sm font-medium">Risk Level Explanation</div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>1 - Very stable income and expenses</p>
              <p>2 - Stable job, some variable expenses</p>
              <p>3 - Average stability</p>
              <p>4 - Variable income or expenses</p>
              <p>5 - Highly variable income or expenses</p>
            </div>
          </div>
        </Card>
      </div>
    </CalculatorLayout>
  );
}