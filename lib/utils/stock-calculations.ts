/**
 * Calculate stock investment returns including dividends
 */
export function calculateStockReturn(
  initialInvestment: number,
  shares: number,
  initialPrice: number,
  currentPrice: number,
  dividendHistory: { year: number; amount: number }[],
  reinvestDividends: boolean = false
) {
  let totalShares = shares;
  let totalDividends = 0;
  let reinvestedValue = 0;
  let yearlyData = [];
  
  // Sort dividend history by year
  const sortedDividends = [...dividendHistory].sort((a, b) => a.year - b.year);
  const years = sortedDividends.length > 0 ? 
    sortedDividends[sortedDividends.length - 1].year + 1 : 0;

  // Calculate price appreciation between initial and current price
  const priceAppreciation = (currentPrice - initialPrice) / initialPrice;
  let currentValue = totalShares * currentPrice;

  // Calculate returns year by year
  for (let year = 0; year <= years; year++) {
    const yearDividend = sortedDividends.find(d => d.year === year);
    const dividendAmount = yearDividend ? yearDividend.amount * totalShares : 0;
    totalDividends += dividendAmount;

    if (reinvestDividends && dividendAmount > 0) {
      const newShares = dividendAmount / currentPrice;
      totalShares += newShares;
      reinvestedValue += dividendAmount;
      currentValue = totalShares * currentPrice;
    }

    yearlyData.push({
      year,
      shares: totalShares,
      dividends: totalDividends,
      value: currentValue,
    });
  }

  const totalReturn = currentValue - initialInvestment + (reinvestDividends ? 0 : totalDividends);
  const percentReturn = (totalReturn / initialInvestment) * 100;
  const annualizedReturn = years > 0 ? 
    (Math.pow(1 + totalReturn / initialInvestment, 1 / years) - 1) * 100 : 
    percentReturn;

  return {
    currentValue,
    totalShares,
    totalDividends,
    reinvestedValue,
    totalReturn,
    percentReturn,
    annualizedReturn,
    priceAppreciation: priceAppreciation * 100,
    schedule: yearlyData,
  };
}

/**
 * Calculate dividend metrics
 */
export function calculateDividendYield(
  sharePrice: number,
  annualDividend: number,
  dividendGrowthRate: number,
  years: number
) {
  const currentYield = (annualDividend / sharePrice) * 100;
  let schedule = [];
  let totalDividends = 0;
  let currentDividend = annualDividend;

  for (let year = 0; year <= years; year++) {
    if (year > 0) {
      currentDividend *= (1 + dividendGrowthRate / 100);
      totalDividends += currentDividend;
    }

    schedule.push({
      year,
      dividend: currentDividend,
      yield: (currentDividend / sharePrice) * 100,
      cumulative: totalDividends,
    });
  }

  const finalYield = (currentDividend / sharePrice) * 100;
  const yieldOnCost = (currentDividend / sharePrice) * 100;

  return {
    currentYield,
    finalYield,
    yieldOnCost,
    totalDividends,
    schedule,
  };
}

/**
 * Calculate portfolio risk metrics
 */
export interface StockPosition {
  symbol: string;
  value: number;
  beta: number;
  volatility: number;
}

export function calculatePortfolioRisk(positions: StockPosition[]) {
  const totalValue = positions.reduce((sum, pos) => sum + pos.value, 0);
  
  // Calculate portfolio weights
  const weights = positions.map(pos => pos.value / totalValue);
  
  // Calculate weighted average beta
  const portfolioBeta = positions.reduce((sum, pos, i) => 
    sum + (pos.beta * weights[i]), 0);
  
  // Calculate weighted average volatility
  const portfolioVolatility = positions.reduce((sum, pos, i) => 
    sum + (pos.volatility * weights[i]), 0);

  // Calculate concentration metrics
  const sortedWeights = [...weights].sort((a, b) => b - a);
  const top3Concentration = sortedWeights.slice(0, 3).reduce((sum, w) => sum + w, 0) * 100;
  
  return {
    portfolioBeta,
    portfolioVolatility,
    top3Concentration,
    positions: positions.map((pos, i) => ({
      ...pos,
      weight: weights[i] * 100,
      contribution: weights[i] * pos.beta,
    })),
  };
}

/**
 * Calculate optimal asset allocation
 */
export interface AssetClass {
  name: string;
  expectedReturn: number;
  volatility: number;
  currentAllocation: number;
  targetAllocation: number;
}

export function calculateAssetAllocation(
  portfolio: AssetClass[],
  totalValue: number
) {
  const totalCurrent = portfolio.reduce((sum, asset) => 
    sum + asset.currentAllocation, 0);
  
  const totalTarget = portfolio.reduce((sum, asset) => 
    sum + asset.targetAllocation, 0);

  if (Math.abs(totalCurrent - 100) > 0.1 || Math.abs(totalTarget - 100) > 0.1) {
    throw new Error('Allocations must sum to 100%');
  }

  const results = portfolio.map(asset => {
    const currentValue = (asset.currentAllocation / 100) * totalValue;
    const targetValue = (asset.targetAllocation / 100) * totalValue;
    const difference = targetValue - currentValue;

    return {
      ...asset,
      currentValue,
      targetValue,
      difference,
      action: difference > 0 ? 'Buy' : difference < 0 ? 'Sell' : 'Hold',
    };
  });

  // Calculate portfolio metrics
  const expectedReturn = portfolio.reduce((sum, asset) => 
    sum + (asset.targetAllocation / 100 * asset.expectedReturn), 0);
  
  const portfolioVolatility = portfolio.reduce((sum, asset) => 
    sum + (asset.targetAllocation / 100 * asset.volatility), 0);

  return {
    assets: results,
    totalValue,
    expectedReturn,
    portfolioVolatility,
    rebalanceAmount: results.reduce((sum, asset) => 
      sum + Math.abs(asset.difference), 0) / 2,
  };
}