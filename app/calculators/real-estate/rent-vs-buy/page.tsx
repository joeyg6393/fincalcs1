'use client';

import { Card } from '@/components/ui/card';
import { CalculatorLayout } from '@/components/calculator-layout';
import { CalculatorInput } from '@/components/calculator-input';
import { CalculatorResult } from '@/components/calculator-result';
import { formatCurrency } from '@/lib/utils/number-formatting';
import { calculateRentVsBuy } from '@/lib/utils/mortgage-calculations';
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

export default function RentVsBuyCalculator() {
  const [homePrice, setHomePrice] = useState(400000);
  const [downPayment, setDownPayment] = useState(80000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [propertyTaxRate, setPropertyTaxRate] = useState(1.2);
  const [insuranceRate, setInsuranceRate] = useState(0.3);
  const [maintenanceRate, setMaintenanceRate] = useState(1);
  const [monthlyRent, setMonthlyRent] = useState(2000);
  const [rentIncrease, setRentIncrease] = useState(3);
  const [homeAppreciation, setHomeAppreciation] = useState(3);
  const [years, setYears] = useState(10);

  const result = calculateRentVsBuy(
    homePrice,
    downPayment,
    interestRate,
    propertyTaxRate,
    insuranceRate,
    maintenanceRate,
    monthlyRent,
    rentIncrease,
    homeAppreciation,
    years
  );

  return (
    <CalculatorLayout
      title="Rent vs. Buy Calculator"
      description="Compare the costs and benefits of renting versus buying a home over time."
      groupId="real-estate"
      calculatorId="rent-vs-buy"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Purchase Details</h2>
          <div className="space-y-4">
            <CalculatorInput
              id="home-price"
              label="Home Price"
              value={homePrice}
              onChange={setHomePrice}
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
              max={homePrice}
            />
            <CalculatorInput
              id="interest-rate"
              label="Interest Rate"
              value={interestRate}
              onChange={setInterestRate}
              type="percent"
              min={0}
              max={20}
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
              label="Annual Maintenance Rate"
              value={maintenanceRate}
              onChange={setMaintenanceRate}
              type="percent"
              min={0}
              max={5}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Rental & Market Details</h2>
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
              id="rent-increase"
              label="Annual Rent Increase"
              value={rentIncrease}
              onChange={setRentIncrease}
              type="percent"
              min={0}
              max={10}
            />
            <CalculatorInput
              id="home-appreciation"
              label="Annual Home Appreciation"
              value={homeAppreciation}
              onChange={setHomeAppreciation}
              type="percent"
              min={0}
              max={10}
            />
            <CalculatorInput
              id="years"
              label="Years to Compare"
              value={years}
              onChange={setYears}
              type="number"
              min={1}
              max={30}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Monthly Cost Comparison</h2>
          <div className="space-y-4">
            <CalculatorResult
              label="Monthly Mortgage Payment"
              value={formatCurrency(result.monthlyMortgage)}
            />
            <CalculatorResult
              label="Monthly Maintenance"
              value={formatCurrency(result.monthlyMaintenance)}
            />
            <CalculatorResult
              label="Initial Monthly Rent"
              value={formatCurrency(monthlyRent)}
            />
            <CalculatorResult
              label="Final Monthly Rent"
              value={formatCurrency(result.rentSchedule[years].monthlyRent)}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">After {years} Years</h2>
          <div className="space-y-4">
            <CalculatorResult
              label="Total Cost of Buying"
              value={formatCurrency(result.totalBuyerCost)}
            />
            <CalculatorResult
              label="Total Cost of Renting"
              value={formatCurrency(result.totalRenterCost)}
            />
            <CalculatorResult
              label="Home Value"
              value={formatCurrency(result.finalHomeValue)}
            />
            <CalculatorResult
              label="Home Equity"
              value={formatCurrency(result.finalEquity)}
              highlighted
            />
            <CalculatorResult
              label="Net Cost of Buying"
              value={formatCurrency(result.netBuyerCost)}
            />
          </div>
        </Card>

        <Card className="md:col-span-2 p-6">
          <h2 className="mb-4 text-xl font-semibold">Cost Comparison Over Time</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart>
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
                  name="Home Value"
                  type="monotone"
                  data={result.buySchedule}
                  dataKey="homeValue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
                <Line
                  name="Home Equity"
                  type="monotone"
                  data={result.buySchedule}
                  dataKey="equity"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                />
                <Line
                  name="Total Rent Paid"
                  type="monotone"
                  data={result.rentSchedule}
                  dataKey="rentPaid"
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