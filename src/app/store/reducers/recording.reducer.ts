import {Action, createReducer, on} from '@ngrx/store';
import produce from 'immer';
import {Recording} from '../../model/recording.model';
import * as MeasurementActions from '../actions/measurement.actions';
import * as RecordingActions from '../actions/recording.actions';


const MAX_RECORDING_VALUES = 10000;


export interface State {
  activeRecordings: {
    [assetName: string]: Recording;
  };
  savedRecordings: Recording[];
}

const initialState: State = {
  activeRecordings: {},
  savedRecordings: []
};

const recordingReducer = createReducer(
  initialState,
  on(MeasurementActions.addMeasurement, (state, action) => produce(state, draftState => {
      const activeRecording = draftState.activeRecordings[action.assetName];
      if (activeRecording) {
        const value = {
          timestamp: action.timestamp,
          value: action.value
        };
        if (activeRecording.measurements[action.key]) {
          activeRecording.measurements[action.key].push(value);
        } else {
          activeRecording.measurements[action.key] = [value];
        }
        if (activeRecording.measurements[action.key].length > MAX_RECORDING_VALUES) {
          draftState.savedRecordings.push(activeRecording);
          draftState.activeRecordings[action.assetName] = undefined;
        }
      }
    })
  ),
  on(RecordingActions.startRecording, (state, action) => produce(state, draftState => {
      draftState.activeRecordings[action.assetName] = {
        id: action.id,
        date: action.date,
        assetName: action.assetName,
        measurements: {}
      };
    })
  ),
  on(RecordingActions.stopRecording, (state, action) => produce(state, drafState => {
    const activeRecording = drafState.activeRecordings[action.assetName];
    if (drafState.activeRecordings[action.assetName]) {
      drafState.savedRecordings.push(activeRecording);
      drafState.activeRecordings[action.assetName] = undefined;
    }
  }))
);

export function reducer(state: State | undefined, action: Action): State {
  return recordingReducer(state, action);
}




