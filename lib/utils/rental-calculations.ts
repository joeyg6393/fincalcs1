/**
 * Calculate rental property ROI and cash flow
 */
export function calculateRentalROI(
  purchasePrice: number,
  downPayment: number,
  closingCosts: number,
  repairCosts: number,
  monthlyRent: number,
  otherMonthlyIncome: number,
  propertyTaxRate: number,
  insuranceRate: number,
  maintenanceRate: number,
  vacancyRate: number,
  managementRate: number,
  mortgageRate: number,
  mortgageYears: number = 30,
  annualAppreciation: number = 3,
  holdingPeriod: number = 10
) {
  // Calculate loan details
  const loanAmount = purchasePrice - downPayment;
  const monthlyRate = mortgageRate / 12 / 100;
  const totalPayments = mortgageYears * 12;
  const monthlyMortgage = loanAmount * 
    (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
    (Math.pow(1 + monthlyRate, totalPayments) - 1);

  // Calculate monthly expenses
  const monthlyPropertyTax = (purchasePrice * propertyTaxRate / 100) / 12;
  const monthlyInsurance = (purchasePrice * insuranceRate / 100) / 12;
  const monthlyMaintenance = (purchasePrice * maintenanceRate / 100) / 12;
  const monthlyVacancy = (monthlyRent * vacancyRate / 100);
  const monthlyManagement = ((monthlyRent + otherMonthlyIncome) * managementRate / 100);

  // Calculate monthly cash flow
  const grossMonthlyIncome = monthlyRent + otherMonthlyIncome;
  const totalMonthlyExpenses = monthlyMortgage + monthlyPropertyTax + 
    monthlyInsurance + monthlyMaintenance + monthlyVacancy + monthlyManagement;
  const monthlyCashFlow = grossMonthlyIncome - totalMonthlyExpenses;

  // Calculate initial investment
  const totalInvestment = downPayment + closingCosts + repairCosts;

  // Generate yearly projections
  let schedule = [];
  let propertyValue = purchasePrice;
  let loanBalance = loanAmount;
  let totalRent = 0;
  let totalExpenses = 0;
  let totalEquity = 0;

  for (let year = 0; year <= holdingPeriod; year++) {
    if (year > 0) {
      propertyValue *= (1 + annualAppreciation / 100);
      totalRent += grossMonthlyIncome * 12;
      totalExpenses += totalMonthlyExpenses * 12;

      // Calculate loan paydown
      for (let month = 1; month <= 12; month++) {
        const interestPayment = loanBalance * monthlyRate;
        const principalPayment = monthlyMortgage - interestPayment;
        loanBalance = Math.max(0, loanBalance - principalPayment);
      }
    }

    totalEquity = propertyValue - loanBalance;

    schedule.push({
      year,
      propertyValue: Math.round(propertyValue),
      equity: Math.round(totalEquity),
      loanBalance: Math.round(loanBalance),
      totalRent: Math.round(totalRent),
      totalExpenses: Math.round(totalExpenses),
      totalProfit: Math.round(totalRent - totalExpenses),
    });
  }

  // Calculate returns
  const finalYear = schedule[holdingPeriod];
  const totalProfit = finalYear.totalProfit;
  const equityGain = finalYear.equity - totalInvestment;
  const totalReturn = totalProfit + equityGain;
  const annualCashFlow = monthlyCashFlow * 12;
  
  const cashOnCashReturn = (annualCashFlow / totalInvestment) * 100;
  const totalROI = (totalReturn / totalInvestment) * 100;
  const averageAnnualROI = totalROI / holdingPeriod;

  return {
    monthlyCashFlow,
    annualCashFlow,
    totalInvestment,
    grossMonthlyIncome,
    totalMonthlyExpenses,
    monthlyExpenseBreakdown: {
      mortgage: monthlyMortgage,
      propertyTax: monthlyPropertyTax,
      insurance: monthlyInsurance,
      maintenance: monthlyMaintenance,
      vacancy: monthlyVacancy,
      management: monthlyManagement,
    },
    schedule,
    totalProfit,
    equityGain,
    totalReturn,
    cashOnCashReturn,
    totalROI,
    averageAnnualROI,
  };
}