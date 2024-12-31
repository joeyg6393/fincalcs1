export interface BudgetCategory {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
}

export const defaultCategories: BudgetCategory[] = [
  { id: 'salary', name: 'Salary', type: 'income', color: 'hsl(var(--chart-1))' },
  { id: 'investments', name: 'Investment Income', type: 'income', color: 'hsl(var(--chart-2))' },
  { id: 'other-income', name: 'Other Income', type: 'income', color: 'hsl(var(--chart-3))' },
  { id: 'housing', name: 'Housing', type: 'expense', color: 'hsl(var(--chart-1))' },
  { id: 'transportation', name: 'Transportation', type: 'expense', color: 'hsl(var(--chart-2))' },
  { id: 'food', name: 'Food & Dining', type: 'expense', color: 'hsl(var(--chart-3))' },
  { id: 'utilities', name: 'Utilities', type: 'expense', color: 'hsl(var(--chart-4))' },
  { id: 'healthcare', name: 'Healthcare', type: 'expense', color: 'hsl(var(--chart-5))' },
];