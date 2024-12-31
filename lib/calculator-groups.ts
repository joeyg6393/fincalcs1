import { type IconName } from './icons';

export interface Calculator {
  id: string;
  title: string;
  description: string;
  path: string;
}

export interface CalculatorGroup {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  calculators: Calculator[];
}

export const calculatorGroups: CalculatorGroup[] = [
  {
    id: 'savings',
    title: 'Savings & Budgeting',
    description: 'Plan your savings goals and manage your budget effectively',
    icon: 'PiggyBank',
    calculators: [
      {
        id: 'savings-goal',
        title: 'Savings Goal Calculator',
        description: 'Calculate how much you need to save to reach your financial goals',
        path: '/calculators/savings/savings-goal',
      },
      {
        id: 'budget-planner',
        title: 'Budget Planner',
        description: 'Create and manage your monthly budget with ease',
        path: '/calculators/savings/budget-planner',
      },
      {
        id: 'emergency-fund',
        title: 'Emergency Fund Calculator',
        description: 'Determine how much you should save for emergencies',
        path: '/calculators/savings/emergency-fund',
      },
      {
        id: 'college-savings',
        title: 'College Savings Calculator',
        description: 'Plan for future education expenses',
        path: '/calculators/savings/college-savings',
      },
      {
        id: 'rainy-day-fund',
        title: 'Rainy Day Fund Calculator',
        description: 'Calculate your ideal rainy day fund amount',
        path: '/calculators/savings/rainy-day-fund',
      },
    ],
  },
  {
    id: 'debt',
    title: 'Debt Management',
    description: 'Take control of your debt with smart repayment strategies',
    icon: 'Wallet',
    calculators: [
      {
        id: 'loan-payoff',
        title: 'Loan Payoff Calculator',
        description: 'Plan your loan repayment strategy',
        path: '/calculators/debt/loan-payoff',
      },
      {
        id: 'credit-card-payoff',
        title: 'Credit Card Payoff Calculator',
        description: 'Create a plan to become debt-free',
        path: '/calculators/debt/credit-card-payoff',
      },
      {
        id: 'debt-snowball',
        title: 'Debt Snowball Calculator',
        description: 'Use the snowball method to pay off debt',
        path: '/calculators/debt/snowball',
      },
      {
        id: 'debt-avalanche',
        title: 'Debt Avalanche Calculator',
        description: 'Optimize debt repayment with the avalanche method',
        path: '/calculators/debt/avalanche',
      },
      {
        id: 'debt-to-income',
        title: 'Debt-to-Income Calculator',
        description: 'Calculate your debt-to-income ratio',
        path: '/calculators/debt/debt-to-income',
      },
    ],
  },
  {
    id: 'income',
    title: 'Income & Taxes',
    description: 'Understand your income and tax obligations',
    icon: 'DollarSign',
    calculators: [
      {
        id: 'salary',
        title: 'Salary Calculator',
        description: 'Calculate your annual, monthly, and hourly pay',
        path: '/calculators/income/salary',
      },
      {
        id: 'tax-withholding',
        title: 'Tax Withholding Calculator',
        description: 'Estimate your tax withholdings',
        path: '/calculators/income/tax-withholding',
      },
      {
        id: 'net-income',
        title: 'Net Income Calculator',
        description: 'Calculate your take-home pay',
        path: '/calculators/income/net-income',
      },
      {
        id: 'self-employment-tax',
        title: 'Self-Employment Tax Calculator',
        description: 'Estimate your self-employment tax obligations',
        path: '/calculators/income/self-employment-tax',
      },
    ],
  },
  {
    id: 'investing',
    icon: 'TrendingUp',
    title: 'Investing & Growth',
    description: 'Grow your wealth with smart investment strategies',
    calculators: [
      {
        id: 'compound-interest',
        title: 'Compound Interest Calculator',
        description: 'See the power of compound growth over time',
        path: '/calculators/investment/compound-interest',
      },
      {
        id: 'investment-growth',
        title: 'Investment Growth Calculator',
        description: 'Project your investment growth over time',
        path: '/calculators/investing/growth',
      },
      {
        id: 'rule-of-72',
        title: 'Rule of 72 Calculator',
        description: 'Estimate how long it takes to double your money',
        path: '/calculators/investing/rule-of-72',
      },
      {
        id: 'future-value',
        title: 'Future Value Calculator',
        description: 'Calculate the future value of your investments',
        path: '/calculators/investing/future-value',
      },
    ],
  },
  {
    id: 'real-estate',
    title: 'Real Estate',
    description: 'Make informed real estate investment decisions',
    icon: 'Home',
    calculators: [
      {
        id: 'mortgage-payment',
        title: 'Mortgage Payment Calculator',
        description: 'Calculate your monthly mortgage payment',
        path: '/calculators/real-estate/mortgage-payment',
      },
      {
        id: 'refinance',
        title: 'Refinance Calculator',
        description: 'Compare refinancing options',
        path: '/calculators/real-estate/refinance',
      },
      {
        id: 'home-affordability',
        title: 'Home Affordability Calculator',
        description: 'Determine how much house you can afford',
        path: '/calculators/real-estate/affordability',
      },
      {
        id: 'rent-vs-buy',
        title: 'Rent vs. Buy Calculator',
        description: 'Compare the costs of renting and buying',
        path: '/calculators/real-estate/rent-vs-buy',
      },
      {
        id: 'property-roi',
        title: 'Rental Property ROI Calculator',
        description: 'Calculate return on investment for rental properties',
        path: '/calculators/real-estate/rental-roi',
      },
    ],
  },
  {
    id: 'stock-market',
    title: 'Stock Market',
    description: 'Analyze and optimize your stock portfolio',
    icon: 'LineChart',
    calculators: [
      {
        id: 'stock-return',
        title: 'Stock Return Calculator',
        description: 'Calculate your stock investment returns',
        path: '/calculators/stock-market/return',
      },
      {
        id: 'dividend-yield',
        title: 'Dividend Yield Calculator',
        description: 'Calculate dividend yields and income',
        path: '/calculators/stock-market/dividend-yield',
      },
      {
        id: 'portfolio-risk',
        title: 'Portfolio Risk Calculator',
        description: 'Analyze your portfolio risk metrics',
        path: '/calculators/stock-market/portfolio-risk',
      },
      {
        id: 'asset-allocation',
        title: 'Asset Allocation Calculator',
        description: 'Optimize your portfolio allocation',
        path: '/calculators/stock-market/asset-allocation',
      },
    ],
  },
];