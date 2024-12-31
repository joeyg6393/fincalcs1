export interface CompoundInterestResult {
  balance: number;
  totalContributions: number;
  totalInterest: number;
  schedule: {
    year: number;
    balance: number;
    contributions: number;
    interest: number;
  }[];
}

export function calculateCompoundInterest(
  principal: number,
  monthlyContribution: number,
  annualRate: number,
  years: number,
  compoundingFrequency: 'monthly' | 'quarterly' | 'annually' = 'monthly'
): CompoundInterestResult {
  const periodsPerYear = {
    monthly: 12,
    quarterly: 4,
    annually: 1,
  }[compoundingFrequency];

  const totalPeriods = years * periodsPerYear;
  const periodicRate = annualRate / 100 / periodsPerYear;
  const monthlyPerPeriod = monthlyContribution * (12 / periodsPerYear);

  let balance = principal;
  let totalContributions = principal;
  let schedule = [];

  for (let period = 1; period <= totalPeriods; period++) {
    const startBalance = balance;
    const contribution = monthlyPerPeriod;
    
    balance = (balance + contribution) * (1 + periodicRate);
    totalContributions += contribution;

    if (period % periodsPerYear === 0) {
      const year = period / periodsPerYear;
      schedule.push({
        year,
        balance: Math.round(balance),
        contributions: Math.round(totalContributions),
        interest: Math.round(balance - totalContributions),
      });
    }
  }

  return {
    balance,
    totalContributions,
    totalInterest: balance - totalContributions,
    schedule,
  };
}

export interface InvestmentGrowthResult {
  finalBalance: number;
  totalContributions: number;
  totalInterest: number;
  schedule: {
    year: number;
    balance: number;
    contributions: number;
    interest: number;
  }[];
}

export function calculateInvestmentGrowth(
  initialBalance: number,
  monthlyContribution: number,
  annualReturnRate: number,
  years: number,
  annualContributionIncrease: number = 0
): InvestmentGrowthResult {
  const monthlyRate = annualReturnRate / 12 / 100;
  let balance = initialBalance;
  let totalContributions = initialBalance;
  let currentMonthlyContribution = monthlyContribution;
  let schedule = [];

  for (let month = 1; month <= years * 12; month++) {
    // Increase contribution at the start of each year
    if (month % 12 === 1 && month > 1) {
      currentMonthlyContribution *= (1 + annualContributionIncrease / 100);
    }

    balance = (balance + currentMonthlyContribution) * (1 + monthlyRate);
    totalContributions += currentMonthlyContribution;

    if (month % 12 === 0) {
      schedule.push({
        year: month / 12,
        balance: Math.round(balance),
        contributions: Math.round(totalContributions),
        interest: Math.round(balance - totalContributions),
      });
    }
  }

  return {
    finalBalance: balance,
    totalContributions,
    totalInterest: balance - totalContributions,
    schedule,
  };
}

export interface Rule72Result {
  yearsToDouble: number;
  doubledAmount: number;
  schedule: {
    year: number;
    balance: number;
  }[];
}

export function calculateRule72(
  principal: number,
  annualRate: number
): Rule72Result {
  const yearsToDouble = 72 / annualRate;
  const doubledAmount = principal * 2;
  
  // Generate year-by-year schedule
  const schedule = [];
  const monthlyRate = annualRate / 12 / 100;
  let balance = principal;
  let months = 0;

  while (balance < doubledAmount && months < yearsToDouble * 12) {
    months++;
    balance *= (1 + monthlyRate);

    if (months % 12 === 0) {
      schedule.push({
        year: months / 12,
        balance: Math.round(balance),
      });
    }
  }

  return {
    yearsToDouble,
    doubledAmount,
    schedule,
  };
}