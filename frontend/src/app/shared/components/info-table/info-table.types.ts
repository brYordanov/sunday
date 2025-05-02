export type Column = {
  name: string;
  title: string;
  type?: 'Date' | 'Link';
  linkPath?: string;
  desktopOnly?: boolean;
};
