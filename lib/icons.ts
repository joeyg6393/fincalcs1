import { TrendingUp, Home, PiggyBank, Wallet, DollarSign, LineChart } from 'lucide-react';

export const calculatorIcons = {
  TrendingUp,
  Home,
  PiggyBank,
  Wallet,
  DollarSign,
  LineChart,
} as const;

export type IconName = keyof typeof calculatorIcons;