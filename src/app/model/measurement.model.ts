export interface Measurement {
  timestamp: Date;
  value: number;
}

export interface Measurements {
  [key: string]: Measurement[];
}
