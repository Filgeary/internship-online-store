export type CardProps = {
  title: string;
  icon: React.ReactNode;
  count: number;
  suffix?: string;
  prefix?: React.ReactNode | string;
  precision?: number;
  color?: string;
};
