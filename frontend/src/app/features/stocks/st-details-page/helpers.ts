export const prepareChartData = (stockData: Record<string, any>, years?: number) => {
  const parsed = Object.entries(stockData).map(([date, values]) => ({
    date,
    open: parseFloat(values['1. open']),
    high: parseFloat(values['2. high']),
    low: parseFloat(values['3. low']),
    close: parseFloat(values['4. close']),
  }));

  parsed.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (years) {
    const cutoffDate = new Date();
    cutoffDate.setFullYear(cutoffDate.getFullYear() - years);

    const filtered = parsed.filter((d) => new Date(d.date) >= cutoffDate);

    return {
      dates: filtered.map((d) => d.date),
      open: filtered.map((d) => d.open),
      high: filtered.map((d) => d.high),
      low: filtered.map((d) => d.low),
      close: filtered.map((d) => d.close),
    };
  }

  return {
    dates: parsed.map((d) => d.date),
    open: parsed.map((d) => d.open),
    high: parsed.map((d) => d.high),
    low: parsed.map((d) => d.low),
    close: parsed.map((d) => d.close),
  };
};
