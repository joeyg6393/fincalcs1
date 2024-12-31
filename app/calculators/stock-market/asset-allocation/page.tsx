'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalculatorLayout } from '@/components/calculator-layout';
import { CalculatorInput } from '@/components/calculator-input';
import { CalculatorResult } from '@/components/calculator-result';
import { formatCurrency } from '@/lib/utils/number-formatting';
import { calculateAssetAllocation, type AssetClass } from '@/lib/utils/stock-calculations';
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

export default function AssetAllocationCalculator() {
  const [totalValue, setTotalValue] = useState(100000);
  const [assets, setAssets] = useState<AssetClass[]>([
    { name: 'US Stocks', expectedReturn: 8, volatility: 15, currentAllocation: 60, targetAllocation: 55 },
    { name: 'Bonds', expectedReturn: 4, volatility: 5, currentAllocation: 30, targetAllocation: 35 },
    { name: 'Cash', expectedReturn: 2, volatility: 1, currentAllocation: 10, targetAllocation: 10 },
  ]);

  const addAsset = () => {
    setAssets([...assets, {
      name: '',
      expectedReturn: 0,
      volatility: 0,
      currentAllocation: 0,
      targetAllocation: 0,
    }]);
  };

  const removeAsset = (index: number) => {
    setAssets(assets.filter((_, i) => i !== index));
  };

  const updateAsset = (index: number, field: keyof AssetClass, value: string | number) => {
    setAssets(assets.map((asset, i) =>
      i === index ? { ...asset, [field]: value } : asset
    ));
  };

  const result = calculateAssetAllocation(assets, totalValue);
  const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
  ];

  return (
    <CalculatorLayout
      title="Asset Allocation Calculator"
      description="Optimize your portfolio allocation and calculate rebalancing needs."
      groupId="stock-market"
      calculatorId="asset-allocation"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="mb-4 space-y-4">
            <h2 className="text-xl font-semibold">Portfolio Value</h2>
            <CalculatorInput
              id="total-value"
              label="Total Portfolio Value"
              value={totalValue}
              onChange={setTotalValue}
              type="currency"
              min={0}
            />
          </div>

          <div className="mt-8 mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Asset Classes</h2>
            <Button onClick={addAsset} variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Asset
            </Button>
          </div>
          
          <div className="space-y-6">
            {assets.map((asset, index) => (
              <div key={index} className="space-y-4">
                <div className="flex items-center justify-between">
                  <CalculatorInput
                    id={`name-${index}`}
                    label="Asset Name"
                    value={asset.name}
                    onChange={(value) => updateAsset(index, 'name', value)}
                    type="text"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAsset(index)}
                    className="h-9 px-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <CalculatorInput
                    id={`return-${index}`}
                    label="Expected Return (%)"
                    value={asset.expectedReturn}
                    onChange={(value) => updateAsset(index, 'expectedReturn', value)}
                    type="number"
                    min={0}
                    max={50}
                  />
                  <CalculatorInput
                    id={`volatility-${index}`}
                    label="Volatility (%)"
                    value={asset.volatility}
                    onChange={(value) => updateAsset(index, 'volatility', value)}
                    type="number"
                    min={0}
                    max={100}
                  />
                  <CalculatorInput
                    id={`current-${index}`}
                    label="Current Allocation (%)"
                    value={asset.currentAllocation}
                    onChange={(value) => updateAsset(index, 'currentAllocation', value)}
                    type="number"
                    min={0}
                    max={100}
                  />
                  <CalculatorInput
                    id={`target-${index}`}
                    label="Target Allocation (%)"
                    value={asset.targetAllocation}
                    onChange={(value) => updateAsset(index, 'targetAllocation', value)}
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
                label="Expected Return"
                value={`${result.expectedReturn.toFixed(1)}%`}
                highlighted
              />
              <CalculatorResult
                label="Portfolio Volatility"
                value={`${result.portfolioVolatility.toFixed(1)}%`}
              />
              <CalculatorResult
                label="Rebalancing Amount"
                value={formatCurrency(result.rebalanceAmount)}
              />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Current vs Target Allocation</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={result.assets}
                    dataKey="currentValue"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    label
                  >
                    {result.assets.map((entry, index) => (
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
          <h2 className="mb-4 text-xl font-semibold">Rebalancing Actions</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Asset</th>
                  <th className="text-right py-2">Current Value</th>
                  <th className="text-right py-2">Target Value</th>
                  <th className="text-right py-2">Difference</th>
                  <th className="text-right py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {result.assets.map((asset) => (
                  <tr key={asset.name} className="border-b">
                    <td className="py-2">{asset.name}</td>
                    <td className="text-right">{formatCurrency(asset.currentValue)}</td>
                    <td className="text-right">{formatCurrency(asset.targetValue)}</td>
                    <td className="text-right">{formatCurrency(asset.difference)}</td>
                    <td className="text-right font-medium">
                      <span className={
                        asset.action === 'Buy' ? 'text-green-600 dark:text-green-400' :
                        asset.action === 'Sell' ? 'text-red-600 dark:text-red-400' :
                        ''
                      }>
                        {asset.action}
                      </span>
                    </td>
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