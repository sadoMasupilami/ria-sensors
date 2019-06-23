import {createAction, props} from '@ngrx/store';
import {Sensor} from '../../model/sensor.model';

export enum SensorActionTypes {
  AddSensor = '[Sensor Service] Add Sensor',
  DeleteSensor = '[Sensor Service] Delete Sensor'
}

export const addSensor = createAction(
  SensorActionTypes.AddSensor,
  props<Sensor>()
);

export const deleteSensor = createAction(
  SensorActionTypes.DeleteSensor,
  props<{assetName: string}>()
);

