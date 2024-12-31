'use client';

import { Card } from '@/components/ui/card';
import { CalculatorLayout } from '@/components/calculator-layout';
import { CalculatorInput } from '@/components/calculator-input';
import { CalculatorResult } from '@/components/calculator-result';
import { formatCurrency } from '@/lib/utils/number-formatting';
import { useState } from 'react';

export default function EmergencyFundCalculator() {
  const [monthlyExpenses, setMonthlyExpenses] = useState(3000);
  const [monthsOfCoverage, setMonthsOfCoverage] = useState(6);
  const [currentSavings, setCurrentSavings] = useState(5000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);

  const targetAmount = monthlyExpenses * monthsOfCoverage;
  const remaining = Math.max(0, targetAmount - currentSavings);
  const monthsToGoal = remaining > 0 ? Math.ceil(remaining / monthlyContribution) : 0;

  return (
    <CalculatorLayout
      title="Emergency Fund Calculator"
      description="Calculate how much you should save for emergencies and track your progress."
      groupId="savings"
      calculatorId="emergency-fund"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="space-y-4">
            <CalculatorInput
              id="expenses"
              label="Monthly Expenses"
              value={monthlyExpenses}
              onChange={setMonthlyExpenses}
              type="currency"
              min={0}
            />
            <CalculatorInput
              id="months"
              label="Months of Coverage"
              value={monthsOfCoverage}
              onChange={setMonthsOfCoverage}
              type="number"
              min={1}
              max={24}
            />
            <CalculatorInput
              id="current"
              label="Current Emergency Savings"
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
              label="Recommended Emergency Fund"
              value={formatCurrency(targetAmount)}
              highlighted
            />
            <CalculatorResult
              label="Current Progress"
              value={`${Math.min(100, Math.round((currentSavings / targetAmount) * 100))}%`}
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
            <div className="mb-2 text-sm font-medium">Savings Progress</div>
            <div className="h-4 rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-green-500"
                style={{
                  width: `${Math.min(100, (currentSavings / targetAmount) * 100)}%`,
                }}
              />
            </div>
          </div>
        </Card>
      </div>
    </CalculatorLayout>
  );
}