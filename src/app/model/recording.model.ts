import {Measurements} from './measurement.model';

export interface Recording {
  id: string;
  date: Date;
  assetName: string;
  measurements: Measurements;
}
