import {Action, createReducer, on} from '@ngrx/store';
import * as _ from 'lodash';
import {addMeasurement} from '../actions/measurement.actions';
import {produce} from 'immer';
import {Measurements} from '../../model/measurement.model';
import {deleteSensor} from '../actions/sensor.actions';

export interface State {
  [assetName: string]: Measurements;
}

const MAX_VALUES_PER_KEY = 500;

const measurementReducer = createReducer(
  {},
  on(addMeasurement, (state, action) => produce(state, draftState => {
    const value = {
      timestamp: action.timestamp,
      value: action.value
    };
    if (_.has(draftState, [action.assetName, action.key])) {
      draftState[action.assetName][action.key].push(value);
    } else {
      _.set(draftState, [action.assetName, action.key], [value]);
    }
    if (draftState[action.assetName][action.key].length > MAX_VALUES_PER_KEY) {
      draftState[action.assetName][action.key].shift();
    }
  })),
  on(deleteSensor, (state, action) => produce(state, draftState => {
    if (draftState[action.assetName]) {
      delete draftState[action.assetName];
    }
  }))
);

export function reducer(state: State | undefined, action: Action): State {
  return measurementReducer(state, action);
}



