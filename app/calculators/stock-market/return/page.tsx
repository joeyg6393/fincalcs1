'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalculatorLayout } from '@/components/calculator-layout';
import { CalculatorInput } from '@/components/calculator-input';
import { CalculatorResult } from '@/components/calculator-result';
import { formatCurrency } from '@/lib/utils/number-formatting';
import { calculateStockReturn } from '@/lib/utils/stock-calculations';
import { Plus, Trash2 } from 'lucide-react';
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

interface Dividend {
  id: string;
  year: number;
  amount: number;
}

export default function StockReturnCalculator() {
  const [initialInvestment, setInitialInvestment] = useState(10000);
  const [shares, setShares] = useState(100);
  const [initialPrice, setInitialPrice] = useState(100);
  const [currentPrice, setCurrentPrice] = useState(150);
  const [reinvestDividends, setReinvestDividends] = useState(false);
  const [dividends, setDividends] = useState<Dividend[]>([
    { id: '1', year: 1, amount: 2 },
    { id: '2', year: 2, amount: 2.2 },
    { id: '3', year: 3, amount: 2.4 },
  ]);

  const addDividend = () => {
    const newId = (Math.max(0, ...dividends.map(d => parseInt(d.id))) + 1).toString();
    const lastYear = Math.max(0, ...dividends.map(d => d.year));
    setDividends([...dividends, {
      id: newId,
      year: lastYear + 1,
      amount: 0,
    }]);
  };

  const removeDividend = (id: string) => {
    setDividends(dividends.filter(d => d.id !== id));
  };

  const updateDividend = (id: string, field: keyof Dividend, value: number) => {
    setDividends(dividends.map(dividend =>
      dividend.id === id ? { ...dividend, [field]: value } : dividend
    ));
  };

  const result = calculateStockReturn(
    initialInvestment,
    shares,
    initialPrice,
    currentPrice,
    dividends.map(({ year, amount }) => ({ year, amount })),
    reinvestDividends
  );

  return (
    <CalculatorLayout
      title="Stock Return Calculator"
      description="Calculate your total stock investment returns, including capital gains and dividends."
      groupId="stock-market"
      calculatorId="stock-return"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Investment Details</h2>
          <div className="space-y-4">
            <CalculatorInput
              id="initial-investment"
              label="Initial Investment"
              value={initialInvestment}
              onChange={setInitialInvestment}
              type="currency"
              min={0}
            />
            <CalculatorInput
              id="shares"
              label="Number of Shares"
              value={shares}
              onChange={setShares}
              type="number"
              min={0}
            />
            <CalculatorInput
              id="initial-price"
              label="Initial Share Price"
              value={initialPrice}
              onChange={setInitialPrice}
              type="currency"
              min={0}
            />
            <CalculatorInput
              id="current-price"
              label="Current Share Price"
              value={currentPrice}
              onChange={setCurrentPrice}
              type="currency"
              min={0}
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="reinvest"
                checked={reinvestDividends}
                onChange={(e) => setReinvestDividends(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="reinvest" className="text-sm font-medium">
                Reinvest Dividends
              </label>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Dividend History</h2>
            <Button onClick={addDividend} variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Dividend
            </Button>
          </div>
          
          <div className="space-y-6">
            {dividends.map((dividend) => (
              <div key={dividend.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Year {dividend.year}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDividend(dividend.id)}
                    className="h-9 px-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <CalculatorInput
                    id={`dividend-year-${dividend.id}`}
                    label="Year"
                    value={dividend.year}
                    onChange={(value) => updateDividend(dividend.id, 'year', value)}
                    type="number"
                    min={0}
                  />
                  <CalculatorInput
                    id={`dividend-amount-${dividend.id}`}
                    label="Amount per Share"
                    value={dividend.amount}
                    onChange={(value) => updateDividend(dividend.id, 'amount', value)}
                    type="currency"
                    min={0}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Investment Returns</h2>
          <div className="space-y-4">
            <CalculatorResult
              label="Current Value"
              value={formatCurrency(result.currentValue)}
              highlighted
            />
            <CalculatorResult
              label="Total Return"
              value={formatCurrency(result.totalReturn)}
            />
            <CalculatorResult
              label="Percent Return"
              value={`${result.percentReturn.toFixed(1)}%`}
            />
            <CalculatorResult
              label="Annualized Return"
              value={`${result.annualizedReturn.toFixed(1)}%`}
            />
            <CalculatorResult
              label="Price Appreciation"
              value={`${result.priceAppreciation.toFixed(1)}%`}
            />
            <CalculatorResult
              label="Total Dividends"
              value={formatCurrency(result.totalDividends)}
            />
            {reinvestDividends && (
              <CalculatorResult
                label="Reinvested Value"
                value={formatCurrency(result.reinvestedValue)}
              />
            )}
            <CalculatorResult
              label="Current Shares"
              value={result.totalShares.toFixed(4)}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Investment Growth</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={result.schedule}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="year"
                  tickFormatter={(value) => `Year ${value}`}
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
                  name="Investment Value"
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
                <Line
                  name="Cumulative Dividends"
                  type="monotone"
                  dataKey="dividends"
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