export const prepareChartData = (stockData: Record<string, any>, years: number) => {
  const today = new Date();
  const cutoffDate = new Date(today);
  cutoffDate.setFullYear(today.getFullYear() - years);

  const dates: string[] = [];
  const open: number[] = [];
  const high: number[] = [];
  const low: number[] = [];
  const close: number[] = [];

  Object.keys(stockData)
    .filter((date) => new Date(date) >= cutoffDate)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime()) // Sort dates ascending
    .forEach((date) => {
      const entry = stockData[date];
      dates.push(date);
      open.push(parseFloat(entry['1. open']));
      high.push(parseFloat(entry['2. high']));
      low.push(parseFloat(entry['3. low']));
      close.push(parseFloat(entry['4. close']));
    });

  return { dates, open, high, low, close };
};
