'use client';

import { Card } from '@/components/ui/card';
import { CalculatorLayout } from '@/components/calculator-layout';
import { CalculatorInput } from '@/components/calculator-input';
import { CalculatorResult } from '@/components/calculator-result';
import { formatCurrency } from '@/lib/utils/number-formatting';
import { calculateDividendYield } from '@/lib/utils/stock-calculations';
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

export default function DividendYieldCalculator() {
  const [sharePrice, setSharePrice] = useState(50);
  const [annualDividend, setAnnualDividend] = useState(2);
  const [dividendGrowthRate, setDividendGrowthRate] = useState(5);
  const [years, setYears] = useState(10);

  const result = calculateDividendYield(
    sharePrice,
    annualDividend,
    dividendGrowthRate,
    years
  );

  return (
    <CalculatorLayout
      title="Dividend Yield Calculator"
      description="Calculate dividend yields and project future dividend income based on growth rates."
      groupId="stock-market"
      calculatorId="dividend-yield"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="space-y-4">
            <CalculatorInput
              id="share-price"
              label="Share Price"
              value={sharePrice}
              onChange={setSharePrice}
              type="currency"
              min={0}
            />
            <CalculatorInput
              id="annual-dividend"
              label="Annual Dividend per Share"
              value={annualDividend}
              onChange={setAnnualDividend}
              type="currency"
              min={0}
            />
            <CalculatorInput
              id="growth-rate"
              label="Annual Dividend Growth Rate"
              value={dividendGrowthRate}
              onChange={setDividendGrowthRate}
              type="percent"
              min={0}
              max={50}
            />
            <CalculatorInput
              id="years"
              label="Projection Years"
              value={years}
              onChange={setYears}
              type="number"
              min={1}
              max={50}
            />
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-6 space-y-4">
            <CalculatorResult
              label="Current Dividend Yield"
              value={`${result.currentYield.toFixed(2)}%`}
              highlighted
            />
            <CalculatorResult
              label="Final Dividend Yield"
              value={`${result.finalYield.toFixed(2)}%`}
            />
            <CalculatorResult
              label="Yield on Cost"
              value={`${result.yieldOnCost.toFixed(2)}%`}
            />
            <CalculatorResult
              label="Total Dividends"
              value={formatCurrency(result.totalDividends)}
            />
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={result.schedule}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="year"
                  tickFormatter={(value) => `Year ${value}`}
                />
                <YAxis yAxisId="left" />
                <YAxis 
                  yAxisId="right" 
                  orientation="right"
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  formatter={(value, name) => [
                    name === 'yield' ? `${Number(value).toFixed(2)}%` : formatCurrency(Number(value)),
                    name === 'yield' ? 'Yield' : 'Dividend'
                  ]}
                  labelFormatter={(value) => `Year ${value}`}
                />
                <Legend />
                <Line
                  name="Dividend Yield"
                  type="monotone"
                  dataKey="yield"
                  yAxisId="left"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
                <Line
                  name="Annual Dividend"
                  type="monotone"
                  dataKey="dividend"
                  yAxisId="right"
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