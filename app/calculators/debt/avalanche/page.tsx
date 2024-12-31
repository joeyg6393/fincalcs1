'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalculatorLayout } from '@/components/calculator-layout';
import { CalculatorInput } from '@/components/calculator-input';
import { CalculatorResult } from '@/components/calculator-result';
import { formatCurrency } from '@/lib/utils/number-formatting';
import { calculateDebtRepayment, type Debt } from '@/lib/utils/debt-strategies';
import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function DebtAvalancheCalculator() {
  const [debts, setDebts] = useState<Debt[]>([
    { id: '1', name: 'Credit Card 1', balance: 5000, rate: 22.9, minimumPayment: 100 },
    { id: '2', name: 'Credit Card 2', balance: 8000, rate: 15.9, minimumPayment: 160 },
  ]);
  const [monthlyPayment, setMonthlyPayment] = useState(600);

  const addDebt = () => {
    const newId = (Math.max(0, ...debts.map(d => parseInt(d.id))) + 1).toString();
    setDebts([...debts, {
      id: newId,
      name: `Debt ${newId}`,
      balance: 0,
      rate: 0,
      minimumPayment: 0,
    }]);
  };

  const removeDebt = (id: string) => {
    setDebts(debts.filter(d => d.id !== id));
  };

  const updateDebt = (id: string, field: keyof Debt, value: any) => {
    setDebts(debts.map(debt => 
      debt.id === id ? { ...debt, [field]: value } : debt
    ));
  };

  const {
    schedule,
    debtProgress,
    totalMonths,
    totalInterest,
  } = calculateDebtRepayment(debts, monthlyPayment, 'avalanche');

  const totalBalance = debts.reduce((sum, debt) => sum + debt.balance, 0);
  const minimumTotal = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);

  return (
    <CalculatorLayout
      title="Debt Avalanche Calculator"
      description="Use the debt avalanche method to pay off your debts, starting with the highest interest rate first."
      groupId="debt"
      calculatorId="debt-avalanche"
    >
      <div className="space-y-6">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Debts</h2>
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
                    id={`name-${debt.id}`}
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
                <div className="grid gap-4 sm:grid-cols-3">
                  <CalculatorInput
                    id={`balance-${debt.id}`}
                    label="Balance"
                    value={debt.balance}
                    onChange={(value) => updateDebt(debt.id, 'balance', value)}
                    type="currency"
                    min={0}
                  />
                  <CalculatorInput
                    id={`rate-${debt.id}`}
                    label="Interest Rate"
                    value={debt.rate}
                    onChange={(value) => updateDebt(debt.id, 'rate', value)}
                    type="percent"
                    min={0}
                    max={100}
                  />
                  <CalculatorInput
                    id={`minimum-${debt.id}`}
                    label="Minimum Payment"
                    value={debt.minimumPayment}
                    onChange={(value) => updateDebt(debt.id, 'minimumPayment', value)}
                    type="currency"
                    min={0}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <CalculatorInput
              id="monthly-payment"
              label="Total Monthly Payment"
              value={monthlyPayment}
              onChange={setMonthlyPayment}
              type="currency"
              min={minimumTotal}
            />
            {monthlyPayment < minimumTotal && (
              <p className="mt-2 text-sm text-red-500">
                Monthly payment must be at least {formatCurrency(minimumTotal)} to cover minimum payments
              </p>
            )}
          </div>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <div className="space-y-4">
              <CalculatorResult
                label="Total Debt"
                value={formatCurrency(totalBalance)}
              />
              <CalculatorResult
                label="Total Interest"
                value={formatCurrency(totalInterest)}
              />
              <CalculatorResult
                label="Time to Debt Free"
                value={`${Math.floor(totalMonths / 12)} years ${totalMonths % 12} months`}
                highlighted
              />
              <CalculatorResult
                label="Total Cost"
                value={formatCurrency(totalBalance + totalInterest)}
              />
            </div>
          </Card>

          <Card className="p-6">
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
                    dataKey="totalBalance"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Payoff Order</h2>
          <div className="space-y-4">
            {debtProgress.map((debt, index) => (
              <div key={debt.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">{index + 1}. {debt.name}</span>
                    <span className="ml-2 text-sm text-muted-foreground">
                      (Paid off in {Math.floor(debt.monthsToPayoff / 12)} years {debt.monthsToPayoff % 12} months)
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Interest: {formatCurrency(debt.totalInterest)}
                  </div>
                </div>
                <div className="h-1 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${Math.min(100, (debt.monthsToPayoff / totalMonths) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </CalculatorLayout>
  );
}