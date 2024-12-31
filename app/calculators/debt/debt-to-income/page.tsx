'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalculatorLayout } from '@/components/calculator-layout';
import { CalculatorInput } from '@/components/calculator-input';
import { CalculatorResult } from '@/components/calculator-result';
import { formatCurrency } from '@/lib/utils/number-formatting';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
  calculateDebtToIncomeRatio,
  type IncomeSource,
  type DebtPayment,
} from '@/lib/utils/debt-calculations';

export default function DebtToIncomeCalculator() {
  const [incomes, setIncomes] = useState<IncomeSource[]>([
    { id: '1', name: 'Primary Salary', amount: 5000, frequency: 'monthly' },
  ]);

  const [debts, setDebts] = useState<DebtPayment[]>([
    { id: '1', name: 'Mortgage', payment: 1500 },
    { id: '2', name: 'Car Loan', payment: 400 },
    { id: '3', name: 'Credit Cards', payment: 200 },
  ]);

  const addIncome = () => {
    const newId = (Math.max(0, ...incomes.map(i => parseInt(i.id))) + 1).toString();
    setIncomes([...incomes, {
      id: newId,
      name: `Income ${newId}`,
      amount: 0,
      frequency: 'monthly',
    }]);
  };

  const addDebt = () => {
    const newId = (Math.max(0, ...debts.map(d => parseInt(d.id))) + 1).toString();
    setDebts([...debts, {
      id: newId,
      name: `Debt ${newId}`,
      payment: 0,
    }]);
  };

  const removeIncome = (id: string) => {
    setIncomes(incomes.filter(i => i.id !== id));
  };

  const removeDebt = (id: string) => {
    setDebts(debts.filter(d => d.id !== id));
  };

  const updateIncome = (id: string, field: keyof IncomeSource, value: any) => {
    setIncomes(incomes.map(income =>
      income.id === id ? { ...income, [field]: value } : income
    ));
  };

  const updateDebt = (id: string, field: keyof DebtPayment, value: any) => {
    setDebts(debts.map(debt =>
      debt.id === id ? { ...debt, [field]: value } : debt
    ));
  };

  const {
    monthlyIncome,
    monthlyDebt,
    ratio,
    riskLevel,
  } = calculateDebtToIncomeRatio(incomes, debts);

  const getRiskDescription = () => {
    switch (riskLevel) {
      case 'low':
        return 'Your debt-to-income ratio is healthy. You should have no problems qualifying for new credit.';
      case 'moderate':
        return 'Your debt load is reasonable but try to avoid taking on significant new debt.';
      case 'high':
        return 'Your debt burden is high. Consider paying down some debts before taking on new credit.';
      case 'very-high':
        return 'Your debt burden is very high. Focus on debt reduction before considering any new credit.';
    }
  };

  const getRiskColor = () => {
    switch (riskLevel) {
      case 'low': return 'text-green-600 dark:text-green-400';
      case 'moderate': return 'text-yellow-600 dark:text-yellow-400';
      case 'high': return 'text-orange-600 dark:text-orange-400';
      case 'very-high': return 'text-red-600 dark:text-red-400';
    }
  };

  return (
    <CalculatorLayout
      title="Debt-to-Income Calculator"
      description="Calculate your debt-to-income ratio to understand your financial health and borrowing capacity."
      groupId="debt"
      calculatorId="debt-to-income"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Income Sources</h2>
              <Button onClick={addIncome} variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Income
              </Button>
            </div>
            
            <div className="space-y-6">
              {incomes.map((income) => (
                <div key={income.id} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <CalculatorInput
                      id={`income-name-${income.id}`}
                      label="Income Source"
                      value={income.name}
                      onChange={(value) => updateIncome(income.id, 'name', value)}
                      type="text"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeIncome(income.id)}
                      className="h-9 px-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <CalculatorInput
                      id={`income-amount-${income.id}`}
                      label="Amount"
                      value={income.amount}
                      onChange={(value) => updateIncome(income.id, 'amount', value)}
                      type="currency"
                      min={0}
                    />
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Frequency</label>
                      <select
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        value={income.frequency}
                        onChange={(e) => updateIncome(income.id, 'frequency', e.target.value)}
                      >
                        <option value="monthly">Monthly</option>
                        <option value="annual">Annual</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Monthly Debt Payments</h2>
              <Button onClick={addDebt} variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Debt
              </Button>
            </div>
            
            <div className="space-y-6">
              {debts.map((debt) => (
                <div key={debt.id} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <CalculatorInput
                      id={`debt-name-${debt.id}`}
                      label="Debt Name"
                      value={debt.name}
                      onChange={(value) => updateDebt(debt.id, 'name', value)}
                      type="text"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDebt(debt.id)}
                      className="h-9 px-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <CalculatorInput
                    id={`debt-payment-${debt.id}`}
                    label="Monthly Payment"
                    value={debt.payment}
                    onChange={(value) => updateDebt(debt.id, 'payment', value)}
                    type="currency"
                    min={0}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Results</h2>
            <div className="space-y-4">
              <CalculatorResult
                label="Monthly Income"
                value={formatCurrency(monthlyIncome)}
              />
              <CalculatorResult
                label="Monthly Debt Payments"
                value={formatCurrency(monthlyDebt)}
              />
              <CalculatorResult
                label="Debt-to-Income Ratio"
                value={`${ratio.toFixed(1)}%`}
                highlighted
              />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Risk Assessment</h2>
            <div className="space-y-4">
              <div>
                <div className="mb-2 text-sm font-medium">Risk Level</div>
                <div className={`text-xl font-semibold ${getRiskColor()}`}>
                  {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1).replace('-', ' ')}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {getRiskDescription()}
              </p>
              <div className="space-y-2">
                <div className="text-sm font-medium">DTI Ratio Guidelines</div>
                <div className="space-y-1 text-sm">
                  <p>≤ 28%: Low Risk</p>
                  <p>29-36%: Moderate Risk</p>
                  <p>37-43%: High Risk</p>
                  <p>≥ 44%: Very High Risk</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </CalculatorLayout>
  );
}