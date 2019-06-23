import {Action, createReducer, on} from '@ngrx/store';
import {addSensor, deleteSensor} from '../actions/sensor.actions';
import {Sensor} from '../../model/sensor.model';
import produce from 'immer';

export interface State {
  [assetName: string]: Sensor;
}

const sensorReducer = createReducer(
  {},
  on(addSensor, (state, action) => {
    if (state[action.assetName]) {
      return state;
    } else {
      return {
        ...state,
        [action.assetName]: {
          assetName: action.assetName,
          assetId: action.assetId,
          warehouseId: action.warehouseId,
        }
      };
    }
  }),
  on(deleteSensor, (state, action) => produce(state, draftState => {
    if (draftState[action.assetName]) {
      delete draftState[action.assetName];
    }
  }))
);

export function reducer(state: State | undefined, action: Action): State {
  return sensorReducer(state, action);
}




