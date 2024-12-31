export interface Debt {
  id: string;
  name: string;
  balance: number;
  rate: number;
  minimumPayment: number;
}

interface PaymentSchedule {
  month: number;
  remainingBalance: number;
  totalInterest: number;
}

interface DebtProgress {
  id: string;
  name: string;
  schedule: PaymentSchedule[];
  monthsToPayoff: number;
  totalInterest: number;
}

export function calculateDebtRepayment(
  debts: Debt[],
  monthlyPayment: number,
  strategy: 'snowball' | 'avalanche'
): {
  schedule: { month: number; totalBalance: number; totalInterest: number }[];
  debtProgress: DebtProgress[];
  totalMonths: number;
  totalInterest: number;
} {
  // Sort debts according to strategy
  const sortedDebts = [...debts].sort((a, b) => 
    strategy === 'snowball' 
      ? a.balance - b.balance 
      : b.rate - a.rate
  );

  let currentDebts = sortedDebts.map(debt => ({
    ...debt,
    currentBalance: debt.balance,
    totalInterest: 0,
    schedule: [{ month: 0, remainingBalance: debt.balance, totalInterest: 0 }],
  }));

  let month = 0;
  let totalSchedule = [];
  const maxMonths = 600; // 50 years maximum

  while (currentDebts.some(d => d.currentBalance > 0) && month < maxMonths) {
    month++;
    let availablePayment = monthlyPayment;

    // Pay minimum on all debts
    currentDebts.forEach(debt => {
      if (debt.currentBalance <= 0) return;
      
      const payment = Math.min(debt.minimumPayment, debt.currentBalance);
      availablePayment -= payment;
      
      const interest = (debt.currentBalance * debt.rate / 100) / 12;
      debt.totalInterest += interest;
      debt.currentBalance = Math.max(0, debt.currentBalance + interest - payment);
    });

    // Apply extra payment to target debt
    const targetDebt = currentDebts.find(d => d.currentBalance > 0);
    if (targetDebt && availablePayment > 0) {
      const interest = (targetDebt.currentBalance * targetDebt.rate / 100) / 12;
      targetDebt.totalInterest += interest;
      targetDebt.currentBalance = Math.max(0, targetDebt.currentBalance + interest - availablePayment);
    }

    // Record progress every 3 months
    if (month % 3 === 0) {
      const totalBalance = currentDebts.reduce((sum, d) => sum + d.currentBalance, 0);
      const totalInterest = currentDebts.reduce((sum, d) => sum + d.totalInterest, 0);
      
      totalSchedule.push({
        month,
        totalBalance: Math.round(totalBalance),
        totalInterest: Math.round(totalInterest),
      });

      currentDebts.forEach(debt => {
        if (debt.currentBalance > 0) {
          debt.schedule.push({
            month,
            remainingBalance: Math.round(debt.currentBalance),
            totalInterest: Math.round(debt.totalInterest),
          });
        }
      });
    }
  }

  const debtProgress = sortedDebts.map(debt => {
    const progress = currentDebts.find(d => d.id === debt.id)!;
    return {
      id: debt.id,
      name: debt.name,
      schedule: progress.schedule,
      monthsToPayoff: progress.schedule.length * 3,
      totalInterest: progress.totalInterest,
    };
  });

  return {
    schedule: totalSchedule,
    debtProgress,
    totalMonths: month,
    totalInterest: currentDebts.reduce((sum, d) => sum + d.totalInterest, 0),
  };
}