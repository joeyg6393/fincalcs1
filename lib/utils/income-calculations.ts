export interface SalaryBreakdown {
  annual: number;
  monthly: number;
  biweekly: number;
  weekly: number;
  hourly: number;
  dailyAverage: number;
}

export function calculateSalaryBreakdown(
  amount: number,
  frequency: 'hourly' | 'weekly' | 'biweekly' | 'monthly' | 'annual',
  hoursPerWeek = 40
): SalaryBreakdown {
  const workWeeksPerYear = 52;
  const workDaysPerYear = workWeeksPerYear * 5;
  const hoursPerYear = workWeeksPerYear * hoursPerWeek;

  let annual: number;

  switch (frequency) {
    case 'hourly':
      annual = amount * hoursPerYear;
      break;
    case 'weekly':
      annual = amount * workWeeksPerYear;
      break;
    case 'biweekly':
      annual = amount * (workWeeksPerYear / 2);
      break;
    case 'monthly':
      annual = amount * 12;
      break;
    case 'annual':
      annual = amount;
      break;
  }

  return {
    annual,
    monthly: annual / 12,
    biweekly: annual / (workWeeksPerYear / 2),
    weekly: annual / workWeeksPerYear,
    hourly: annual / hoursPerYear,
    dailyAverage: annual / workDaysPerYear,
  };
}

export interface BusinessExpense {
  id: string;
  name: string;
  amount: number;
}

export interface SelfEmploymentTaxBreakdown {
  grossIncome: number;
  totalExpenses: number;
  netEarnings: number;
  socialSecurityTax: number;
  medicareTax: number;
  totalSETax: number;
  taxDeduction: number;
  effectiveRate: number;
  quarterlyPayments: number;
}

export function calculateSelfEmploymentTax(
  income: number,
  expenses: BusinessExpense[],
): SelfEmploymentTaxBreakdown {
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const netEarnings = Math.max(0, income - totalExpenses);
  
  // Self-employment tax rates (2024)
  const socialSecurityRate = 0.124; // 12.4%
  const medicareRate = 0.029; // 2.9%
  const socialSecurityWageCap = 168600;
  
  // Calculate Social Security tax (subject to wage cap)
  const socialSecurityTax = Math.min(netEarnings, socialSecurityWageCap) * socialSecurityRate;
  
  // Calculate Medicare tax (no wage cap)
  const medicareTax = netEarnings * medicareRate;
  
  const totalSETax = socialSecurityTax + medicareTax;
  
  // 50% of SE tax is deductible
  const taxDeduction = totalSETax * 0.5;
  
  return {
    grossIncome: income,
    totalExpenses,
    netEarnings,
    socialSecurityTax,
    medicareTax,
    totalSETax,
    taxDeduction,
    effectiveRate: (totalSETax / netEarnings) * 100,
    quarterlyPayments: totalSETax / 4,
  };
}
export interface Deduction {
  id: string;
  name: string;
  amount: number;
  frequency: 'perPaycheck' | 'monthly' | 'annual';
  type: 'pretax' | 'posttax';
}

export interface NetIncomeBreakdown {
  grossIncome: number;
  pretaxDeductions: number;
  taxableIncome: number;
  federalTax: number;
  socialSecurity: number;
  medicare: number;
  posttaxDeductions: number;
  netIncome: number;
  annualNet: number;
  effectiveTaxRate: number;
}

export function calculateNetIncome(
  salary: number,
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'annual',
  deductions: Deduction[],
): NetIncomeBreakdown {
  // Convert everything to annual
  const periodsPerYear = {
    weekly: 52,
    biweekly: 26,
    monthly: 12,
    annual: 1,
  }[frequency];

  const annualSalary = frequency === 'annual' ? salary : salary * periodsPerYear;

  // Calculate annual deductions
  const annualDeductions = deductions.map(d => {
    const periodsForDeduction = {
      perPaycheck: periodsPerYear,
      monthly: 12,
      annual: 1,
    }[d.frequency];
    return {
      ...d,
      annualAmount: d.amount * periodsForDeduction,
    };
  });

  const pretaxDeductions = annualDeductions
    .filter(d => d.type === 'pretax')
    .reduce((sum, d) => sum + d.annualAmount, 0);

  const posttaxDeductions = annualDeductions
    .filter(d => d.type === 'posttax')
    .reduce((sum, d) => sum + d.annualAmount, 0);

  const taxableIncome = annualSalary - pretaxDeductions;
  const taxes = calculateTaxes(taxableIncome);

  const netIncome = taxableIncome - taxes.totalTax - posttaxDeductions;

  return {
    grossIncome: annualSalary / periodsPerYear,
    pretaxDeductions: pretaxDeductions / periodsPerYear,
    taxableIncome: taxableIncome / periodsPerYear,
    federalTax: taxes.federalTax / periodsPerYear,
    socialSecurity: taxes.socialSecurity / periodsPerYear,
    medicare: taxes.medicare / periodsPerYear,
    posttaxDeductions: posttaxDeductions / periodsPerYear,
    netIncome: netIncome / periodsPerYear,
    annualNet: netIncome,
    effectiveTaxRate: (taxes.totalTax / taxableIncome) * 100,
  };
}
export interface WithholdingAllowance {
  id: string;
  name: string;
  amount: number;
}

export interface WithholdingBreakdown {
  grossPay: number;
  federalWithholding: number;
  socialSecurity: number;
  medicare: number;
  totalWithholding: number;
  netPay: number;
  annualWithholding: number;
  annualNet: number;
}

export function calculateWithholding(
  salary: number,
  frequency: 'weekly' | 'biweekly' | 'monthly',
  allowances: WithholdingAllowance[],
  additionalWithholding: number = 0
): WithholdingBreakdown {
  // Convert to annual for tax calculation
  const periodsPerYear = {
    weekly: 52,
    biweekly: 26,
    monthly: 12,
  }[frequency];

  const annualSalary = salary * periodsPerYear;
  const allowanceTotal = allowances.reduce((sum, a) => sum + a.amount, 0);
  const taxableIncome = Math.max(0, annualSalary - allowanceTotal);

  // Calculate annual tax and convert back to per-period
  const annualTax = calculateTaxes(taxableIncome);
  const periodFederalTax = (annualTax.federalTax / periodsPerYear) + additionalWithholding;
  const periodSocialSecurity = annualTax.socialSecurity / periodsPerYear;
  const periodMedicare = annualTax.medicare / periodsPerYear;
  const totalWithholding = periodFederalTax + periodSocialSecurity + periodMedicare;

  return {
    grossPay: salary,
    federalWithholding: periodFederalTax,
    socialSecurity: periodSocialSecurity,
    medicare: periodMedicare,
    totalWithholding,
    netPay: salary - totalWithholding,
    annualWithholding: totalWithholding * periodsPerYear,
    annualNet: annualSalary - (totalWithholding * periodsPerYear),
  };
}
export interface TaxBracket {
  rate: number;
  min: number;
  max: number | null;
}

export const federalTaxBrackets2024: TaxBracket[] = [
  { rate: 10, min: 0, max: 11600 },
  { rate: 12, min: 11600, max: 47150 },
  { rate: 22, min: 47150, max: 100525 },
  { rate: 24, min: 100525, max: 191950 },
  { rate: 32, min: 191950, max: 243725 },
  { rate: 35, min: 243725, max: 609350 },
  { rate: 37, min: 609350, max: null },
];

export interface TaxBreakdown {
  grossIncome: number;
  federalTax: number;
  socialSecurity: number;
  medicare: number;
  totalTax: number;
  netIncome: number;
  effectiveTaxRate: number;
  marginalTaxRate: number;
  brackets: {
    rate: number;
    amount: number;
    tax: number;
  }[];
}

export function calculateTaxes(income: number): TaxBreakdown {
  // Calculate federal income tax
  let federalTax = 0;
  let previousMax = 0;
  const brackets = [];
  let marginalRate = 0;

  for (const bracket of federalTaxBrackets2024) {
    const max = bracket.max ?? income;
    const taxableInBracket = Math.min(income - previousMax, max - previousMax);
    
    if (taxableInBracket > 0) {
      const taxInBracket = (taxableInBracket * bracket.rate) / 100;
      federalTax += taxInBracket;
      marginalRate = bracket.rate;
      
      brackets.push({
        rate: bracket.rate,
        amount: taxableInBracket,
        tax: taxInBracket,
      });
    }

    if (bracket.max === null || income <= bracket.max) break;
    previousMax = bracket.max;
  }

  // Calculate FICA taxes
  const socialSecurityRate = 6.2;
  const medicareRate = 1.45;
  const socialSecurityWageCap = 168600; // 2024 limit

  const socialSecurity = Math.min(income, socialSecurityWageCap) * (socialSecurityRate / 100);
  const medicare = income * (medicareRate / 100);
  
  const totalTax = federalTax + socialSecurity + medicare;
  const netIncome = income - totalTax;
  const effectiveTaxRate = (totalTax / income) * 100;

  return {
    grossIncome: income,
    federalTax,
    socialSecurity,
    medicare,
    totalTax,
    netIncome,
    effectiveTaxRate,
    marginalTaxRate: marginalRate,
    brackets,
  };
}