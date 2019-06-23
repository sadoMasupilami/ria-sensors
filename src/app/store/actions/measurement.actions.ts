import {createAction, props} from '@ngrx/store';

export enum MeasurementActionTypes {
  AddMeasurement = '[Sensor Listener] Add Measurement',
}

export const addMeasurement = createAction(
  MeasurementActionTypes.AddMeasurement,
  props<{
    timestamp: Date;
    assetName: string;
    key: string;
    value: number;
  }>()
);
