import { dataPerMonth, Term, TermTypes } from './stock.types';

const termMapping: Record<Term, { firstPeriodArg: number; secondPeriodArg: [number, number] }> = {
  longTerm: { firstPeriodArg: 10, secondPeriodArg: [20, 10] },
  midTerm: { firstPeriodArg: 5, secondPeriodArg: [10, 5] },
  shortTerm: { firstPeriodArg: 1, secondPeriodArg: [2, 1] },
};

export function createBody(stockData) {
  const dataPerMonth = stockData['Monthly Time Series'];
  const entries = Object.entries(dataPerMonth);
  const [oldestRecordDate, oldestRecordValue] = entries[entries.length - 1];
  const [newestRecordDate, newestRecordValue] = entries[0];
  const symbol = stockData['Meta Data']['2. Symbol'];
  const termAnalysis = Object.fromEntries(
    Object.entries(termMapping).map(([key, term]) => [
      key,
      analyzeStockDataForPeriod(dataPerMonth, term.firstPeriodArg),
    ]),
  );
  const predictability = Object.fromEntries(
    Object.entries(termMapping).map(([key]) => [
      key,
      getIsPredictable(dataPerMonth, key as TermTypes),
    ]),
  );

  return { oldestRecordDate, newestRecordDate, symbol, termAnalysis, predictability };
}

function getIsPredictable(dataPerMonth, term: Term) {
  const { firstPeriodArg, secondPeriodArg } = termMapping[term];

  const { change: firstPeriodChange } = analyzeStockDataForPeriod(dataPerMonth, firstPeriodArg);
  const { change: secondPeriodChange } = analyzeStockDataForPeriod(
    dataPerMonth,
    ...secondPeriodArg,
  );

  return Math.abs(firstPeriodChange - secondPeriodChange) <= 7 ? true : false;
}

function getCertainValues(data, valueName) {
  return data.map(([_, values]) => parseFloat(values[valueName]));
}

function calculateChange(values: number[]) {
  const firstClose = values[0];
  const lastClose = values[values.length - 1];
  const changePercentage = ((lastClose - firstClose) / firstClose) * 100;

  return changePercentage;
}

function analyzeStockDataForPeriod(
  dataPerMonth: dataPerMonth,
  yearsBackEnd: number,
  yearsBackStart: number = 0,
) {
  const sortedData = getDataForPeriod(dataPerMonth, yearsBackEnd, yearsBackStart);
  const closeValues: number[] = getCertainValues(sortedData, '4. close');

  const { isStable, trend } = determineTrendAndStability(closeValues);
  const changePercentage = calculateChange(closeValues);

  return {
    isStable,
    trend,
    change: Number(changePercentage.toFixed(2)),
  };
}

function getDataForPeriod(
  dataPerMonth: dataPerMonth,
  yearsBackEnd: number,
  yearsBackStart: number,
) {
  const currentDate = new Date();
  const startDate = new Date();
  const endDate = new Date();
  startDate.setFullYear(currentDate.getFullYear() - yearsBackStart);
  endDate.setFullYear(currentDate.getFullYear() - yearsBackEnd);

  const filteredData = Object.entries(dataPerMonth).filter(([date]) => {
    const stockDate = new Date(date);
    return stockDate >= endDate && stockDate <= startDate;
  });

  // (descending order)
  const sortedData = filteredData.sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime());

  return sortedData;
}

function determineTrendAndStability(values: number[]) {
  let increaseCount = 0;
  let decreaseCount = 0;

  for (let i = 1; i < values.length; i++) {
    if (values[i] > values[i - 1]) {
      increaseCount++;
    } else if (values[i] < values[i - 1]) {
      decreaseCount++;
    }
  }

  const totalMonths = values.length - 1;
  const isStable = increaseCount / totalMonths >= 0.7 || decreaseCount / totalMonths >= 0.7;

  let trend: string;
  if (increaseCount > decreaseCount) {
    trend = 'up';
  } else if (decreaseCount > increaseCount) {
    trend = 'down';
  } else {
    trend = 'run';
  }

  return { isStable, trend };
}
