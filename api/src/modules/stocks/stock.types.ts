export type dataPerMonth = { [key: string]: { [key: string]: string } };

export enum TermTypes {
  ShortTerm = 'shortTerm',
  MidTerm = 'midTerm',
  LongTerm = 'longTerm',
}

export type Term = TermTypes;

export type TermData = {
  isStable: boolean;
  trend: 'up' | 'down' | 'run';
  change: number;
};

export type TermAnalysis = {
  [K in TermTypes]: TermData;
};

export type TermPredictability = {
  [K in TermTypes]: boolean;
};
