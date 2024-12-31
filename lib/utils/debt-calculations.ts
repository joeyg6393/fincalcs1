/**
 * Calculate loan payment details
 */
export function calculateLoanPayment(
  principal: number,
  annualRate: number,
  years: number,
  extraPayment: number = 0
) {
  const monthlyRate = annualRate / 12 / 100;
  const totalPayments = years * 12;
  const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
    (Math.pow(1 + monthlyRate, totalPayments) - 1);

  let balance = principal;
  let totalInterest = 0;
  let actualPayments = 0;
  let schedule = [];

  while (balance > 0 && actualPayments < totalPayments * 1.5) { // 1.5x safety factor
    const interestPayment = balance * monthlyRate;
    const principalPayment = Math.min(balance, monthlyPayment + extraPayment - interestPayment);
    const totalPayment = interestPayment + principalPayment;

    totalInterest += interestPayment;
    balance -= principalPayment;
    actualPayments++;

    if (actualPayments % 12 === 0) { // Store yearly data points
      schedule.push({
        year: actualPayments / 12,
        balance: Math.round(balance),
        totalInterest: Math.round(totalInterest),
      });
    }
  }

  return {
    monthlyPayment,
    totalInterest,
    actualPayments,
    schedule,
  };
}

/**
 * Calculate credit card payoff details
 */
export function calculateCreditCardPayoff(
  balance: number,
  annualRate: number,
  monthlyPayment: number
) {
  const monthlyRate = annualRate / 12 / 100;
  let remainingBalance = balance;
  let totalInterest = 0;
  let months = 0;
  let schedule = [];

  while (remainingBalance > 0 && months < 600) { // 50 years max
    const interestCharge = remainingBalance * monthlyRate;
    const principalPayment = Math.min(remainingBalance, monthlyPayment - interestCharge);
    
    totalInterest += interestCharge;
    remainingBalance -= principalPayment;
    months++;

    if (months % 6 === 0) { // Store data every 6 months
      schedule.push({
        month: months,
        balance: Math.round(remainingBalance),
        totalInterest: Math.round(totalInterest),
      });
    }
  }

  return {
    months,
    totalInterest,
    schedule,
    monthlyPayment,
  };
}

export interface IncomeSource {
  id: string;
  name: string;
  amount: number;
  frequency: 'monthly' | 'annual';
}

export interface DebtPayment {
  id: string;
  name: string;
  payment: number;
}

export function calculateDebtToIncomeRatio(
  incomes: IncomeSource[],
  debts: DebtPayment[],
): {
  monthlyIncome: number;
  monthlyDebt: number;
  ratio: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'very-high';
} {
  const monthlyIncome = incomes.reduce((sum, income) => 
    sum + (income.frequency === 'annual' ? income.amount / 12 : income.amount),
    0
  );

  const monthlyDebt = debts.reduce((sum, debt) => sum + debt.payment, 0);
  const ratio = (monthlyDebt / monthlyIncome) * 100;

  const riskLevel = 
    ratio <= 28 ? 'low' :
    ratio <= 36 ? 'moderate' :
    ratio <= 43 ? 'high' :
    'very-high';

  return {
    monthlyIncome,
    monthlyDebt,
    ratio,
    riskLevel,
  };
}

export interface DebtToConsolidate {
  id: string;
  name: string;
  balance: number;
  rate: number;
  payment: number;
}

export interface ConsolidationOption {
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  months: number;
  schedule: { month: number; balance: number }[];
  savings: number;
}

export function calculateDebtConsolidation(
  debts: DebtToConsolidate[],
  consolidationRate: number,
  term: number,
): {
  currentPlan: ConsolidationOption;
  consolidatedPlan: ConsolidationOption;
} {
  const totalBalance = debts.reduce((sum, debt) => sum + debt.balance, 0);
  const currentMonthlyPayment = debts.reduce((sum, debt) => sum + debt.payment, 0);

  // Calculate current plan totals
  let currentSchedule = [];
  let currentBalance = totalBalance;
  let currentInterest = 0;
  let month = 0;
  let balances = debts.map(d => ({ ...d }));

  while (balances.some(d => d.balance > 0) && month < 600) {
    month++;
    balances.forEach(debt => {
      if (debt.balance <= 0) return;
      const interest = (debt.balance * debt.rate / 100) / 12;
      currentInterest += interest;
      debt.balance = Math.max(0, debt.balance + interest - debt.payment);
    });
    currentBalance = balances.reduce((sum, d) => sum + d.balance, 0);
    
    if (month % 6 === 0) {
      currentSchedule.push({ month, balance: Math.round(currentBalance) });
    }
  }

  // Calculate consolidated plan
  const consolidatedPayment = calculateLoanPayment(
    totalBalance,
    consolidationRate,
    term,
    0
  );

  return {
    currentPlan: {
      monthlyPayment: currentMonthlyPayment,
      totalInterest: currentInterest,
      totalPayment: totalBalance + currentInterest,
      months: month,
      schedule: currentSchedule,
      savings: 0,
    },
    consolidatedPlan: {
      monthlyPayment: consolidatedPayment.monthlyPayment,
      totalInterest: consolidatedPayment.totalInterest,
      totalPayment: totalBalance + consolidatedPayment.totalInterest,
      months: consolidatedPayment.actualPayments,
      schedule: consolidatedPayment.schedule.map(s => ({ 
        month: s.year * 12, 
        balance: s.balance 
      })),
      savings: (totalBalance + currentInterest) - (totalBalance + consolidatedPayment.totalInterest),
    },
  };
}