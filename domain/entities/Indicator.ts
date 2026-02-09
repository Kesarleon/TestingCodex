export type IndicatorDirection = 'positive' | 'negative';

export interface Indicator {
  id: string;
  name: string;
  value: number;
  min: number;
  max: number;
  weight: number;
  direction: IndicatorDirection;
}
