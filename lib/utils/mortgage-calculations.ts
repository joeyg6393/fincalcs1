/**
 * Calculate monthly mortgage payment and amortization schedule
 */
export function calculateMortgage(
  principal: number,
  annualRate: number,
  years: number,
  propertyTax: number = 0,
  insurance: number = 0,
  pmi: number = 0,
  downPayment: number = 0
) {
  const monthlyRate = annualRate / 12 / 100;
  const totalPayments = years * 12;
  const loanAmount = principal - downPayment;
  
  // Calculate base monthly payment using loan amortization formula
  const monthlyPayment = loanAmount * 
    (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
    (Math.pow(1 + monthlyRate, totalPayments) - 1);

  // Calculate monthly tax and insurance
  const monthlyTax = propertyTax / 12;
  const monthlyInsurance = insurance / 12;
  const monthlyPMI = pmi / 12;

  // Generate amortization schedule
  let balance = loanAmount;
  let totalInterest = 0;
  let schedule = [];

  for (let month = 1; month <= totalPayments; month++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    
    totalInterest += interestPayment;
    balance -= principalPayment;

    if (month % 12 === 0) { // Store yearly data points
      schedule.push({
        year: month / 12,
        balance: Math.max(0, Math.round(balance)),
        totalInterest: Math.round(totalInterest),
        principalPaid: Math.round(loanAmount - balance),
      });
    }
  }

  const monthlyTotal = monthlyPayment + monthlyTax + monthlyInsurance + monthlyPMI;
  const loanToValue = ((loanAmount / principal) * 100).toFixed(1);

  return {
    monthlyPrincipalAndInterest: monthlyPayment,
    monthlyTax,
    monthlyInsurance,
    monthlyPMI,
    monthlyTotal,
    totalInterest,
    totalCost: loanAmount + totalInterest,
    schedule,
    loanToValue,
    downPaymentPercent: ((downPayment / principal) * 100).toFixed(1),
  };
}

/**
 * Calculate refinance comparison
 */
export function calculateRefinance(
  currentBalance: number,
  currentRate: number,
  currentTerm: number,
  currentMonthlyPayment: number,
  currentTermRemaining: number,
  newRate: number,
  newTerm: number,
  closingCosts: number = 0
) {
  // Calculate remaining cost of current loan
  const currentMonthlyRate = currentRate / 12 / 100;
  let currentBalance_ = currentBalance;
  let currentTotalInterest = 0;
  let currentSchedule = [];

  for (let month = 1; month <= currentTermRemaining * 12; month++) {
    const interestPayment = currentBalance_ * currentMonthlyRate;
    const principalPayment = currentMonthlyPayment - interestPayment;
    
    currentTotalInterest += interestPayment;
    currentBalance_ -= principalPayment;

    if (month % 12 === 0) {
      currentSchedule.push({
        year: month / 12,
        balance: Math.max(0, Math.round(currentBalance_)),
        totalInterest: Math.round(currentTotalInterest),
      });
    }
  }

  // Calculate new loan details
  const newMonthlyRate = newRate / 12 / 100;
  const newTotalPayments = newTerm * 12;
  const newMonthlyPayment = currentBalance * 
    (newMonthlyRate * Math.pow(1 + newMonthlyRate, newTotalPayments)) / 
    (Math.pow(1 + newMonthlyRate, newTotalPayments) - 1);

  let newBalance = currentBalance;
  let newTotalInterest = 0;
  let newSchedule = [];

  for (let month = 1; month <= newTotalPayments; month++) {
    const interestPayment = newBalance * newMonthlyRate;
    const principalPayment = newMonthlyPayment - interestPayment;
    
    newTotalInterest += interestPayment;
    newBalance -= principalPayment;

    if (month % 12 === 0) {
      newSchedule.push({
        year: month / 12,
        balance: Math.max(0, Math.round(newBalance)),
        totalInterest: Math.round(newTotalInterest),
      });
    }
  }

  const currentTotalCost = currentMonthlyPayment * (currentTermRemaining * 12);
  const newTotalCost = (newMonthlyPayment * newTotalPayments) + closingCosts;
  const lifetimeSavings = currentTotalCost - newTotalCost;
  const monthlyPaymentDiff = currentMonthlyPayment - newMonthlyPayment;
  const breakevenMonths = Math.ceil(closingCosts / monthlyPaymentDiff);

  return {
    currentMonthlyPayment,
    currentTotalInterest,
    currentTotalCost,
    currentSchedule,
    newMonthlyPayment,
    newTotalInterest,
    newTotalCost,
    newSchedule,
    lifetimeSavings,
    monthlyPaymentDiff,
    breakevenMonths,
  };
}

/**
 * Calculate home affordability based on income and debts
 */
export function calculateHomeAffordability(
  monthlyIncome: number,
  monthlyDebts: number,
  downPayment: number,
  interestRate: number,
  propertyTaxRate: number,
  insuranceRate: number,
  term: number = 30,
  maxDTI: number = 0.43,
  maxPTI: number = 0.28
) {
  const monthlyRate = interestRate / 12 / 100;
  const totalPayments = term * 12;
  
  // Maximum monthly payment based on DTI ratio
  const maxMonthlyDebtPayment = monthlyIncome * maxDTI - monthlyDebts;
  
  // Maximum monthly payment based on PTI ratio
  const maxMonthlyPITIPayment = monthlyIncome * maxPTI;
  
  // Use the lower of the two maximum payments
  const maxMonthlyPayment = Math.min(maxMonthlyDebtPayment, maxMonthlyPITIPayment);
  
  // Calculate maximum loan amount using mortgage payment formula
  // P = PMT * (1 - (1 + r)^-n) / r
  // where P is principal, PMT is monthly payment, r is monthly rate, n is total payments
  const maxLoanPayment = maxMonthlyPayment * 0.85; // Reserve 15% for taxes and insurance
  const maxLoanAmount = maxLoanPayment * 
    (1 - Math.pow(1 + monthlyRate, -totalPayments)) / monthlyRate;
  
  const maxHomePrice = maxLoanAmount + downPayment;
  const annualPropertyTax = maxHomePrice * (propertyTaxRate / 100);
  const annualInsurance = maxHomePrice * (insuranceRate / 100);
  
  // Calculate actual monthly payment
  const mortgage = calculateMortgage(
    maxHomePrice,
    interestRate,
    term,
    annualPropertyTax,
    annualInsurance,
    0,
    downPayment
  );
  
  return {
    maxHomePrice,
    maxLoanAmount,
    downPaymentPercent: (downPayment / maxHomePrice) * 100,
    monthlyPayment: mortgage.monthlyTotal,
    monthlyPrincipalAndInterest: mortgage.monthlyPrincipalAndInterest,
    monthlyPropertyTax: mortgage.monthlyTax,
    monthlyInsurance: mortgage.monthlyInsurance,
    totalMonthlyDebt: monthlyDebts + mortgage.monthlyTotal,
    debtToIncomeRatio: ((monthlyDebts + mortgage.monthlyTotal) / monthlyIncome) * 100,
    paymentToIncomeRatio: (mortgage.monthlyTotal / monthlyIncome) * 100,
  };
}

/**
 * Calculate rent vs. buy comparison
 */
export function calculateRentVsBuy(
  homePrice: number,
  downPayment: number,
  interestRate: number,
  propertyTaxRate: number,
  insuranceRate: number,
  maintenanceRate: number,
  monthlyRent: number,
  rentIncrease: number,
  homeAppreciation: number,
  years: number
) {
  const annualPropertyTax = homePrice * (propertyTaxRate / 100);
  const annualInsurance = homePrice * (insuranceRate / 100);
  const annualMaintenance = homePrice * (maintenanceRate / 100);
  
  const mortgage = calculateMortgage(
    homePrice,
    interestRate,
    30,
    annualPropertyTax,
    annualInsurance,
    0,
    downPayment
  );

  let buySchedule = [];
  let rentSchedule = [];
  let homeValue = homePrice;
  let currentRent = monthlyRent;
  let totalRentPaid = 0;
  let totalMaintenance = 0;
  
  for (let year = 0; year <= years; year++) {
    if (year > 0) {
      homeValue *= (1 + homeAppreciation / 100);
      currentRent *= (1 + rentIncrease / 100);
      totalRentPaid += currentRent * 12;
      totalMaintenance += annualMaintenance;
    }

    const yearlyMortgage = mortgage.schedule.find(s => s.year === year);
    const remainingBalance = yearlyMortgage ? yearlyMortgage.balance : 0;
    const buyerEquity = homeValue - remainingBalance;

    buySchedule.push({
      year,
      homeValue: Math.round(homeValue),
      equity: Math.round(buyerEquity),
      maintenance: Math.round(totalMaintenance),
      mortgageBalance: Math.round(remainingBalance),
    });

    rentSchedule.push({
      year,
      rentPaid: Math.round(totalRentPaid),
      monthlyRent: Math.round(currentRent),
    });
  }

  const finalYear = years;
  const totalBuyerCost = downPayment + 
    (mortgage.monthlyTotal * 12 * finalYear) + 
    totalMaintenance;
  const totalRenterCost = totalRentPaid;
  
  return {
    buySchedule,
    rentSchedule,
    monthlyMortgage: mortgage.monthlyTotal,
    monthlyMaintenance: annualMaintenance / 12,
    totalBuyerCost,
    totalRenterCost,
    finalHomeValue: homeValue,
    finalEquity: homeValue - (buySchedule[finalYear]?.mortgageBalance || 0),
    netBuyerCost: totalBuyerCost - (homeValue - homePrice),
  };
}