import {ActionReducerMap, createSelector, MetaReducer} from '@ngrx/store';
import {environment} from '../../../environments/environment';
import * as fromMeasurements from './measurement.reducer';
import * as fromSensors from './sensor.reducer';
import {SensorWithMeasurements} from '../../model/sensor.model';
import * as moment from 'moment';

export interface State {
  measurements: fromMeasurements.State;
  sensors: fromSensors.State;
}

export const reducers: ActionReducerMap<State> = {
  measurements: fromMeasurements.reducer,
  sensors: fromSensors.reducer
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];

export const selectSensors = (state: State) => state.sensors;
export const selectMeasurements = (state: State) => state.measurements;

export const selectAllSensors = createSelector(
  selectSensors,
  (sensorState) => Object.values(sensorState)
);

export const selectMeasurementsForAssetName = createSelector(
  selectMeasurements,
  (state: fromMeasurements.State, props) => {
    return state[props.assetName];
  }
);

export const selectAllSensorsWithMeasurements = createSelector(
  selectSensors,
  selectMeasurements,
  (allSensors: fromSensors.State, allMeasurements: fromMeasurements.State) => {
    return Object.keys(allSensors)
      .filter(assetName => allMeasurements[assetName])
      .map(assetName =>
        new SensorWithMeasurements(allSensors[assetName], allMeasurements[assetName]));
  }
);

export const selectSensorsStaleForMillis = createSelector(
  selectAllSensorsWithMeasurements,
  (allSensors: SensorWithMeasurements[], props) => {
    return allSensors.filter((sensor: SensorWithMeasurements) =>
      moment().diff(moment(sensor.lastMeasurementReceivedAt)) > props.gracePeriodMillis);
  }
);

export const selectSensorValuesAvailable = createSelector(
  selectSensors,
  (state: fromSensors.State) => Object.keys(state).length > 0
);

export const selectSensorByAssetName = createSelector(
  selectSensors,
  (state: fromSensors.State, props) => {
    console.log(state[props.assetName]);
    return state[props.assetName];
  }
);
