export const prepareChartData = (stockData: Record<string, any>, years?: number) => {
  const parsed = Object.entries(stockData).map(([date, values]) => ({
    date,
    open: parseFloat(values.open),
    high: parseFloat(values.high),
    low: parseFloat(values.low),
    close: parseFloat(values.close),
  }));

  parsed.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let finalData = parsed;

  if (years) {
    const cutoffDate = new Date();
    cutoffDate.setFullYear(cutoffDate.getFullYear() - years);

    finalData = parsed.filter((d) => new Date(d.date) >= cutoffDate);
  }

  return {
    dates: finalData.map((d) => d.date),
    open: finalData.map((d) => d.open),
    high: finalData.map((d) => d.high),
    low: finalData.map((d) => d.low),
    close: finalData.map((d) => d.close),
  };
};
