'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalculatorLayout } from '@/components/calculator-layout';
import { CalculatorInput } from '@/components/calculator-input';
import { CalculatorResult } from '@/components/calculator-result';
import { formatCurrency } from '@/lib/utils/number-formatting';
import { calculatePortfolioRisk, type StockPosition } from '@/lib/utils/stock-calculations';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

export default function PortfolioRiskCalculator() {
  const [positions, setPositions] = useState<StockPosition[]>([
    { symbol: 'AAPL', value: 10000, beta: 1.2, volatility: 25 },
    { symbol: 'MSFT', value: 8000, beta: 1.1, volatility: 22 },
    { symbol: 'GOOGL', value: 12000, beta: 1.3, volatility: 28 },
  ]);

  const addPosition = () => {
    setPositions([...positions, {
      symbol: '',
      value: 0,
      beta: 1,
      volatility: 0,
    }]);
  };

  const removePosition = (index: number) => {
    setPositions(positions.filter((_, i) => i !== index));
  };

  const updatePosition = (index: number, field: keyof StockPosition, value: string | number) => {
    setPositions(positions.map((position, i) =>
      i === index ? { ...position, [field]: value } : position
    ));
  };

  const result = calculatePortfolioRisk(positions);
  const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
  ];

  return (
    <CalculatorLayout
      title="Portfolio Risk Calculator"
      description="Analyze your portfolio's risk metrics including beta, volatility, and concentration."
      groupId="stock-market"
      calculatorId="portfolio-risk"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Portfolio Positions</h2>
            <Button onClick={addPosition} variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Position
            </Button>
          </div>
          
          <div className="space-y-6">
            {positions.map((position, index) => (
              <div key={index} className="space-y-4">
                <div className="flex items-center justify-between">
                  <CalculatorInput
                    id={`symbol-${index}`}
                    label="Symbol"
                    value={position.symbol}
                    onChange={(value) => updatePosition(index, 'symbol', value)}
                    type="text"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePosition(index)}
                    className="h-9 px-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <CalculatorInput
                    id={`value-${index}`}
                    label="Value"
                    value={position.value}
                    onChange={(value) => updatePosition(index, 'value', value)}
                    type="currency"
                    min={0}
                  />
                  <CalculatorInput
                    id={`beta-${index}`}
                    label="Beta"
                    value={position.beta}
                    onChange={(value) => updatePosition(index, 'beta', value)}
                    type="number"
                    min={0}
                    step={0.1}
                  />
                  <CalculatorInput
                    id={`volatility-${index}`}
                    label="Volatility (%)"
                    value={position.volatility}
                    onChange={(value) => updatePosition(index, 'volatility', value)}
                    type="number"
                    min={0}
                    max={100}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Portfolio Metrics</h2>
            <div className="space-y-4">
              <CalculatorResult
                label="Portfolio Beta"
                value={result.portfolioBeta.toFixed(2)}
                highlighted
              />
              <CalculatorResult
                label="Portfolio Volatility"
                value={`${result.portfolioVolatility.toFixed(1)}%`}
              />
              <CalculatorResult
                label="Top 3 Concentration"
                value={`${result.top3Concentration.toFixed(1)}%`}
              />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Portfolio Allocation</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={result.positions}
                    dataKey="value"
                    nameKey="symbol"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    label
                  >
                    {result.positions.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <Card className="md:col-span-2 p-6">
          <h2 className="mb-4 text-xl font-semibold">Position Details</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Symbol</th>
                  <th className="text-right py-2">Value</th>
                  <th className="text-right py-2">Weight</th>
                  <th className="text-right py-2">Beta</th>
                  <th className="text-right py-2">Beta Contribution</th>
                  <th className="text-right py-2">Volatility</th>
                </tr>
              </thead>
              <tbody>
                {result.positions.map((position) => (
                  <tr key={position.symbol} className="border-b">
                    <td className="py-2">{position.symbol}</td>
                    <td className="text-right">{formatCurrency(position.value)}</td>
                    <td className="text-right">{position.weight.toFixed(1)}%</td>
                    <td className="text-right">{position.beta.toFixed(2)}</td>
                    <td className="text-right">{position.contribution.toFixed(3)}</td>
                    <td className="text-right">{position.volatility.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </CalculatorLayout>
  );
}