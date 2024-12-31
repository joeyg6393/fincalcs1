'use client';

import { Card } from '@/components/ui/card';
import { CalculatorLayout } from '@/components/calculator-layout';
import { CalculatorInput } from '@/components/calculator-input';
import { CalculatorResult } from '@/components/calculator-result';
import { formatCurrency } from '@/lib/utils/number-formatting';
import { calculateRentalROI } from '@/lib/utils/rental-calculations';
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

export default function RentalROICalculator() {
  const [purchasePrice, setPurchasePrice] = useState(300000);
  const [downPayment, setDownPayment] = useState(60000);
  const [closingCosts, setClosingCosts] = useState(5000);
  const [repairCosts, setRepairCosts] = useState(10000);
  const [monthlyRent, setMonthlyRent] = useState(2500);
  const [otherMonthlyIncome, setOtherMonthlyIncome] = useState(0);
  const [propertyTaxRate, setPropertyTaxRate] = useState(1.2);
  const [insuranceRate, setInsuranceRate] = useState(0.5);
  const [maintenanceRate, setMaintenanceRate] = useState(1);
  const [vacancyRate, setVacancyRate] = useState(5);
  const [managementRate, setManagementRate] = useState(8);
  const [mortgageRate, setMortgageRate] = useState(6.5);
  const [mortgageYears, setMortgageYears] = useState(30);
  const [annualAppreciation, setAnnualAppreciation] = useState(3);
  const [holdingPeriod, setHoldingPeriod] = useState(10);

  const result = calculateRentalROI(
    purchasePrice,
    downPayment,
    closingCosts,
    repairCosts,
    monthlyRent,
    otherMonthlyIncome,
    propertyTaxRate,
    insuranceRate,
    maintenanceRate,
    vacancyRate,
    managementRate,
    mortgageRate,
    mortgageYears,
    annualAppreciation,
    holdingPeriod
  );

  return (
    <CalculatorLayout
      title="Rental Property ROI Calculator"
      description="Analyze the potential return on investment for rental properties, including cash flow and appreciation."
      groupId="real-estate"
      calculatorId="rental-roi"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Property Details</h2>
          <div className="space-y-4">
            <CalculatorInput
              id="purchase-price"
              label="Purchase Price"
              value={purchasePrice}
              onChange={setPurchasePrice}
              type="currency"
              min={0}
            />
            <CalculatorInput
              id="down-payment"
              label="Down Payment"
              value={downPayment}
              onChange={setDownPayment}
              type="currency"
              min={0}
              max={purchasePrice}
            />
            <CalculatorInput
              id="closing-costs"
              label="Closing Costs"
              value={closingCosts}
              onChange={setClosingCosts}
              type="currency"
              min={0}
            />
            <CalculatorInput
              id="repair-costs"
              label="Initial Repair Costs"
              value={repairCosts}
              onChange={setRepairCosts}
              type="currency"
              min={0}
            />
            <CalculatorInput
              id="mortgage-rate"
              label="Mortgage Rate"
              value={mortgageRate}
              onChange={setMortgageRate}
              type="percent"
              min={0}
              max={20}
            />
            <CalculatorInput
              id="mortgage-years"
              label="Mortgage Term (Years)"
              value={mortgageYears}
              onChange={setMortgageYears}
              type="number"
              min={1}
              max={50}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Income & Expenses</h2>
          <div className="space-y-4">
            <CalculatorInput
              id="monthly-rent"
              label="Monthly Rent"
              value={monthlyRent}
              onChange={setMonthlyRent}
              type="currency"
              min={0}
            />
            <CalculatorInput
              id="other-income"
              label="Other Monthly Income"
              value={otherMonthlyIncome}
              onChange={setOtherMonthlyIncome}
              type="currency"
              min={0}
            />
            <CalculatorInput
              id="property-tax-rate"
              label="Property Tax Rate"
              value={propertyTaxRate}
              onChange={setPropertyTaxRate}
              type="percent"
              min={0}
              max={5}
            />
            <CalculatorInput
              id="insurance-rate"
              label="Insurance Rate"
              value={insuranceRate}
              onChange={setInsuranceRate}
              type="percent"
              min={0}
              max={2}
            />
            <CalculatorInput
              id="maintenance-rate"
              label="Maintenance Rate"
              value={maintenanceRate}
              onChange={setMaintenanceRate}
              type="percent"
              min={0}
              max={5}
            />
            <CalculatorInput
              id="vacancy-rate"
              label="Vacancy Rate"
              value={vacancyRate}
              onChange={setVacancyRate}
              type="percent"
              min={0}
              max={20}
            />
            <CalculatorInput
              id="management-rate"
              label="Property Management Rate"
              value={managementRate}
              onChange={setManagementRate}
              type="percent"
              min={0}
              max={15}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Monthly Cash Flow</h2>
          <div className="space-y-4">
            <CalculatorResult
              label="Gross Monthly Income"
              value={formatCurrency(result.grossMonthlyIncome)}
            />
            <CalculatorResult
              label="Monthly Expenses"
              value={formatCurrency(result.totalMonthlyExpenses)}
            />
            <CalculatorResult
              label="Net Monthly Cash Flow"
              value={formatCurrency(result.monthlyCashFlow)}
              highlighted
            />
          </div>

          <h3 className="mt-6 mb-4 text-lg font-semibold">Monthly Expenses Breakdown</h3>
          <div className="space-y-2">
            <CalculatorResult
              label="Mortgage"
              value={formatCurrency(result.monthlyExpenseBreakdown.mortgage)}
            />
            <CalculatorResult
              label="Property Tax"
              value={formatCurrency(result.monthlyExpenseBreakdown.propertyTax)}
            />
            <CalculatorResult
              label="Insurance"
              value={formatCurrency(result.monthlyExpenseBreakdown.insurance)}
            />
            <CalculatorResult
              label="Maintenance"
              value={formatCurrency(result.monthlyExpenseBreakdown.maintenance)}
            />
            <CalculatorResult
              label="Vacancy"
              value={formatCurrency(result.monthlyExpenseBreakdown.vacancy)}
            />
            <CalculatorResult
              label="Property Management"
              value={formatCurrency(result.monthlyExpenseBreakdown.management)}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Investment Returns</h2>
          <div className="space-y-4">
            <CalculatorResult
              label="Total Investment"
              value={formatCurrency(result.totalInvestment)}
            />
            <CalculatorResult
              label="Cash on Cash Return"
              value={`${result.cashOnCashReturn.toFixed(1)}%`}
            />
            <CalculatorResult
              label="Total Profit (Cash Flow)"
              value={formatCurrency(result.totalProfit)}
            />
            <CalculatorResult
              label="Equity Gain"
              value={formatCurrency(result.equityGain)}
            />
            <CalculatorResult
              label="Total Return"
              value={formatCurrency(result.totalReturn)}
              highlighted
            />
            <CalculatorResult
              label="Total ROI"
              value={`${result.totalROI.toFixed(1)}%`}
            />
            <CalculatorResult
              label="Average Annual ROI"
              value={`${result.averageAnnualROI.toFixed(1)}%`}
            />
          </div>
        </Card>

        <Card className="md:col-span-2 p-6">
          <h2 className="mb-4 text-xl font-semibold">Investment Performance Over Time</h2>
          <div className="h-[400px]">
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
                  formatter={(value) => [formatCurrency(Number(value)), '']}
                  labelFormatter={(value) => `Year ${value}`}
                />
                <Legend />
                <Line
                  name="Property Value"
                  type="monotone"
                  dataKey="propertyValue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
                <Line
                  name="Equity"
                  type="monotone"
                  dataKey="equity"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                />
                <Line
                  name="Total Profit"
                  type="monotone"
                  dataKey="totalProfit"
                  stroke="hsl(var(--chart-3))"
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