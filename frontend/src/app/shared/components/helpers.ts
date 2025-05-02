export const hexToRgba = (hex: string, alpha: number): string => {
  const match = hex.trim().match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!match) return hex;

  const [, r, g, b] = match.map((v, i) => (i === 0 ? v : parseInt(v, 16)));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
