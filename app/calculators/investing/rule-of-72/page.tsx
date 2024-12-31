'use client';

import { Card } from '@/components/ui/card';
import { CalculatorLayout } from '@/components/calculator-layout';
import { CalculatorInput } from '@/components/calculator-input';
import { CalculatorResult } from '@/components/calculator-result';
import { formatCurrency } from '@/lib/utils/number-formatting';
import { calculateRule72 } from '@/lib/utils/investment-calculations';
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

export default function RuleOf72Calculator() {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(7);

  const result = calculateRule72(principal, rate);

  return (
    <CalculatorLayout
      title="Rule of 72 Calculator"
      description="Calculate how long it will take your money to double based on your expected rate of return."
      groupId="investing"
      calculatorId="rule-of-72"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="space-y-4">
            <CalculatorInput
              id="principal"
              label="Initial Investment"
              value={principal}
              onChange={setPrincipal}
              type="currency"
              min={0}
            />
            <CalculatorInput
              id="rate"
              label="Annual Return Rate"
              value={rate}
              onChange={setRate}
              type="percent"
              min={0}
              max={50}
            />
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-6 space-y-4">
            <CalculatorResult
              label="Years to Double"
              value={`${result.yearsToDouble.toFixed(1)} years`}
              highlighted
            />
            <CalculatorResult
              label="Initial Amount"
              value={formatCurrency(principal)}
            />
            <CalculatorResult
              label="Doubled Amount"
              value={formatCurrency(result.doubledAmount)}
            />
          </div>

          <div className="h-[300px]">
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

        <Card className="md:col-span-2 p-6">
          <h2 className="text-xl font-semibold mb-4">About the Rule of 72</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              The Rule of 72 is a simple way to determine how long an investment will take to double given a fixed annual rate of return.
              Just divide 72 by the annual rate of return to get the approximate number of years.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg bg-muted p-4">
                <div className="font-medium mb-1">2% Return</div>
                <div className="text-sm">36 years to double</div>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <div className="font-medium mb-1">4% Return</div>
                <div className="text-sm">18 years to double</div>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <div className="font-medium mb-1">6% Return</div>
                <div className="text-sm">12 years to double</div>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <div className="font-medium mb-1">8% Return</div>
                <div className="text-sm">9 years to double</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </CalculatorLayout>
  );
}