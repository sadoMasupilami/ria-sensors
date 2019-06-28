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

function loadInitialState(): State {
  if (typeof (Storage) !== 'undefined') {
    try {
      const rawSensorRecordings = localStorage.getItem('savedSensorRecordings');
      if (rawSensorRecordings) {
        const saveRecs = JSON.parse(rawSensorRecordings);
        return {
          activeRecordings: {},
          savedRecordings: saveRecs
        };
      }
    } catch (err) {
      console.log(err);
    }
  }
  // otherwise
  return {
    activeRecordings: {},
    savedRecordings: []
  };

}

const initialState: State = loadInitialState();

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
  on(RecordingActions.stopRecording, (state, action) => produce(state, draftState => {
    const activeRecording = draftState.activeRecordings[action.assetName];
    if (draftState.activeRecordings[action.assetName]) {
      draftState.savedRecordings.push(activeRecording);
      draftState.activeRecordings[action.assetName] = undefined;
    }
  })),
  on(RecordingActions.deleteRecording, (state, action) => ({
    activeRecordings: state.activeRecordings,
    savedRecordings: state.savedRecordings.filter(rec => rec.id !== action.id)
  }))
);

export function reducer(state: State | undefined, action: Action): State {
  return recordingReducer(state, action);
}




