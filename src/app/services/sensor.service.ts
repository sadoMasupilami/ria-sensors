import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import * as fromRoot from '../store/reducers';
import {selectSensorsStaleForMillis} from '../store/reducers';
import * as SensorActions from '../store/actions/sensor.actions';
import {deleteSensor} from '../store/actions/sensor.actions';
import * as MeasurementActions from '../store/actions/measurement.actions';
import * as _ from 'lodash';
import * as moment from 'moment';
import {IMqttMessage, MqttService} from 'ngx-mqtt';
import {from, interval, Subscription} from 'rxjs';
import {mergeMap, throttle} from 'rxjs/operators';
import {SensorWithMeasurements} from '../model/sensor.model';


interface SensorValue {
  key: string;
  type: string;
  // This is a simplification for the demo. This should be a string and parsed based on the value in 'type'
  value: number;
}

interface SensorEvent {
  timestamp: number;
  warehouseId?: string;
  assetId?: string;
  assetName: string;
  eventType?: string;
  refreshInterval?: number;
  values: SensorValue[];
}

@Injectable()
export class SensorService {

  readonly options = {
    clientId: 'webclient',
    username: 'rabbitmq',
    password: 'rabbitmq'
  };

  private values: number[] = [];

  private subscription: Subscription;


  constructor(
    private store: Store<fromRoot.State>,
    private mqttService: MqttService
  ) {
    this.registerToMqttTopics();
    this.startSensorMonitor();
  }

  private registerToMqttTopics() {
    this.subscription = this.mqttService.observe('/sensors/#').pipe(
      throttle(val => interval(100))
    ).subscribe((message: IMqttMessage) => {
      const sensorEvent = JSON.parse(message.payload.toString());
      this.dispatchActions(sensorEvent);
    });
  }

  private startSensorMonitor(): void {
    this.subscription.add(interval(1000).pipe(
      mergeMap(() => this.store.select(selectSensorsStaleForMillis, {gracePeriodMillis: 10000})),
      mergeMap((sensors: SensorWithMeasurements[]) => from(sensors))
    ).subscribe((sensor: SensorWithMeasurements) =>
      this.store.dispatch(deleteSensor({assetName: sensor.assetName}))));
  }

  private createFakeSensorEvent(): SensorEvent {
    const sensorNumber = _.random(1, 8);

    const currentValue = this.values[sensorNumber - 1] || _.random(0, 27);
    this.values[sensorNumber - 1] = currentValue + _.random(-0.01, 0.01);

    return {
      assetName: `sensor-${sensorNumber}`,
      assetId: `${sensorNumber}`,
      warehouseId: `w-${sensorNumber}`,
      timestamp: moment().valueOf(),
      values: [
        {
          key: 'temp',
          type: 'DOUBLE',
          value: this.values[sensorNumber - 1]
        },
        {
          key: 'voltage',
          type: 'DOUBLE',
          value: 20.4
        }
      ]

    };
  }

  private dispatchActions(sensorEvent: SensorEvent): void {
    this.store.dispatch(SensorActions.addSensor({
      assetName: sensorEvent.assetName,
      assetId: sensorEvent.assetId,
      warehouseId: sensorEvent.warehouseId
    }));

    sensorEvent.values.forEach(se => {
      this.store.dispatch(MeasurementActions.addMeasurement({
        assetName: sensorEvent.assetName,
        timestamp: new Date(sensorEvent.timestamp),
        key: se.key,
        value: se.value
      }));
    });
  }

}


