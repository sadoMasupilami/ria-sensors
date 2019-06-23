import {Measurements} from './measurement.model';
import * as _ from 'lodash';

export interface Sensor {
  assetName: string;
  warehouseId?: string;
  assetId?: string;
}

export class SensorWithMeasurements implements Sensor {
  constructor(private sensor: Sensor, public measurements: Measurements) {
  }

  get assetName(): string {
    return this.sensor.assetName;
  }

  get assetId(): string {
    return this.sensor.assetId;
  }

  get warehouseId(): string {
    return this.sensor.warehouseId;
  }

  get lastMeasurementsReceived(): { key: string, value: number }[] {
    return Object.keys(this.measurements).map(key => ({
      key,
      value: _.last(this.measurements[key]).value,
    }));
  }

  get lastMeasurementReceivedAt(): Date {
    return _.max(Object.values(this.measurements)
      .map(ms => ms[ms.length - 1].timestamp));
  }
}
