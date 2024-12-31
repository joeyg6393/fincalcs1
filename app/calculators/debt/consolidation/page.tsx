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
  calculateDebtConsolidation,
  type DebtToConsolidate,
} from '@/lib/utils/debt-calculations';
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

export default function DebtConsolidationCalculator() {
  const [debts, setDebts] = useState<DebtToConsolidate[]>([
    { id: '1', name: 'Credit Card 1', balance: 5000, rate: 22.9, payment: 150 },
    { id: '2', name: 'Credit Card 2', balance: 3000, rate: 19.9, payment: 100 },
    { id: '3', name: 'Personal Loan', balance: 8000, rate: 12.9, payment: 300 },
  ]);

  const [consolidationRate, setConsolidationRate] = useState(8.9);
  const [consolidationTerm, setConsolidationTerm] = useState(3);

  const addDebt = () => {
    const newId = (Math.max(0, ...debts.map(d => parseInt(d.id))) + 1).toString();
    setDebts([...debts, {
      id: newId,
      name: `Debt ${newId}`,
      balance: 0,
      rate: 0,
      payment: 0,
    }]);
  };

  const removeDebt = (id: string) => {
    setDebts(debts.filter(d => d.id !== id));
  };

  const updateDebt = (id: string, field: keyof DebtToConsolidate, value: number | string) => {
    setDebts(debts.map(debt =>
      debt.id === id ? { ...debt, [field]: value } : debt
    ));
  };

  const {
    currentPlan,
    consolidatedPlan,
  } = calculateDebtConsolidation(debts, consolidationRate, consolidationTerm);

  const chartData = currentPlan.schedule.map((point, index) => {
    const consolidatedPoint = consolidatedPlan.schedule.find(p => p.month === point.month) || {
      balance: consolidatedPlan.schedule[consolidatedPlan.schedule.length - 1]?.balance || 0
    };
    return {
      month: point.month,
      currentBalance: point.balance,
      consolidatedBalance: consolidatedPoint.balance,
    };
  });

  return (
    <CalculatorLayout
      title="Debt Consolidation Calculator"
      description="Compare your current debts with a consolidated loan to see if consolidation makes sense for you."
      groupId="debt"
      calculatorId="debt-consolidation"
    >
      <div className="space-y-6">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Current Debts</h2>
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
                    id={`payment-${debt.id}`}
                    label="Monthly Payment"
                    value={debt.payment}
                    onChange={(value) => updateDebt(debt.id, 'payment', value)}
                    type="currency"
                    min={0}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <CalculatorInput
              id="consolidation-rate"
              label="Consolidation Loan Rate"
              value={consolidationRate}
              onChange={setConsolidationRate}
              type="percent"
              min={0}
              max={100}
            />
            <CalculatorInput
              id="consolidation-term"
              label="Loan Term (Years)"
              value={consolidationTerm}
              onChange={setConsolidationTerm}
              type="number"
              min={1}
              max={30}
            />
          </div>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Current Plan</h2>
            <div className="space-y-4">
              <CalculatorResult
                label="Monthly Payment"
                value={formatCurrency(currentPlan.monthlyPayment)}
              />
              <CalculatorResult
                label="Total Interest"
                value={formatCurrency(currentPlan.totalInterest)}
              />
              <CalculatorResult
                label="Time to Debt Free"
                value={`${Math.floor(currentPlan.months / 12)} years ${currentPlan.months % 12} months`}
              />
              <CalculatorResult
                label="Total Cost"
                value={formatCurrency(currentPlan.totalPayment)}
              />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Consolidated Plan</h2>
            <div className="space-y-4">
              <CalculatorResult
                label="Monthly Payment"
                value={formatCurrency(consolidatedPlan.monthlyPayment)}
              />
              <CalculatorResult
                label="Total Interest"
                value={formatCurrency(consolidatedPlan.totalInterest)}
              />
              <CalculatorResult
                label="Time to Debt Free"
                value={`${Math.floor(consolidatedPlan.months / 12)} years ${consolidatedPlan.months % 12} months`}
              />
              <CalculatorResult
                label="Total Cost"
                value={formatCurrency(consolidatedPlan.totalPayment)}
                highlighted
              />
              <CalculatorResult
                label="Potential Savings"
                value={formatCurrency(consolidatedPlan.savings)}
              />
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Balance Comparison</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
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
                <Legend />
                <Line
                  name="Current Plan"
                  type="monotone"
                  dataKey="currentBalance"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
                <Line
                  name="Consolidated Plan"
                  type="monotone"
                  dataKey="consolidatedBalance"
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