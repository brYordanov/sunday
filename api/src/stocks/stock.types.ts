export type dataPerMonth = { [key: string]: { [key: string]: string } };

export enum TermTypes {
  ShortTerm = 'shortTerm',
  MidTerm = 'midTerm',
  LongTerm = 'longTerm',
}

export type Term = TermTypes;
