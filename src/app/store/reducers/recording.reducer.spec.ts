import * as MeasurementActions from '../actions/measurement.actions';
import * as fromRecordings from './recording.reducer';
import * as RecordingActions from '../actions/recording.actions';

describe('The action startRecording', () => {
  it('adds a new recording for the given assetName', () => {
    const ASSET_NAME = 'sensor-1';
    const DATE = new Date();
    const RECORDING_ID = '1234';

    const nextState = fromRecordings.reducer(undefined, RecordingActions.startRecording({
      id: RECORDING_ID,
      date: DATE,
      assetName: ASSET_NAME
    }));

    expect(nextState.activeRecordings[ASSET_NAME].id).toEqual(RECORDING_ID);
    expect(nextState.activeRecordings[ASSET_NAME].assetName).toEqual(ASSET_NAME);
    expect(nextState.activeRecordings[ASSET_NAME].measurements).toEqual({});
    expect(nextState.activeRecordings[ASSET_NAME].date).toEqual(DATE);

    expect(nextState.savedRecordings).toEqual([]);
  });
});

describe('The action stopRecording', () => {
  it('adds the current recording for the given assetName to the saved recordings', () => {
    const ASSET_NAME = 'sensor-1';
    const KEY = 'key1';
    const TIMESTAMP = new Date();
    const DATE = new Date();
    const RECORDING_ID = '1234';

    const state: fromRecordings.State = {
      activeRecordings: {
        [ASSET_NAME]: {
          id: RECORDING_ID,
          assetName: ASSET_NAME,
          date: DATE,
          measurements: {
            [KEY]: [{
              timestamp: TIMESTAMP,
              value: 1
            }]
          }
        }
      },
      savedRecordings: []
    };

    const nextState = fromRecordings.reducer(state, RecordingActions.stopRecording({
      assetName: ASSET_NAME
    }));

    expect(nextState.activeRecordings[ASSET_NAME]).toBeUndefined();
    expect(nextState.savedRecordings).toEqual([
      {
        id: RECORDING_ID,
        assetName: ASSET_NAME,
        date: DATE,
        measurements: {
          [KEY]: [{
            timestamp: TIMESTAMP,
            value: 1
          }]
        }
      }
    ]);
  });
});


describe('The action addMeasurement', () => {
  it('should add a measurement for a new key to an active recording', () => {
    const KEY = 'key1';
    const ASSET_NAME = 'sensor-1';
    const DATE = new Date();
    const TIMESTAMP = new Date();
    const RECORDING_ID = '1234';

    const state: fromRecordings.State = {
      activeRecordings: {
        [ASSET_NAME]: {
          id: RECORDING_ID,
          assetName: ASSET_NAME,
          date: DATE,
          measurements: {}
        }
      },
      savedRecordings: []
    };

    const nextState: fromRecordings.State = fromRecordings.reducer(state, MeasurementActions.addMeasurement({
      timestamp: TIMESTAMP,
      assetName: ASSET_NAME,
      key: KEY,
      value: 1
    }));

    expect(nextState.activeRecordings[ASSET_NAME]).toBeDefined();
    expect(nextState.activeRecordings[ASSET_NAME].measurements).toEqual({
        [KEY]: [{
          timestamp: TIMESTAMP,
          value: 1
        }]
      }
    );
  });

  it('should add a measurement with an existing key to an active recording', () => {
    const KEY = 'key1';
    const ASSET_NAME = 'sensor-1';
    const DATE = new Date();
    const TIMESTAMP = new Date();
    const RECORDING_ID = '1234';

    const state: fromRecordings.State = {
      activeRecordings: {
        [ASSET_NAME]: {
          id: RECORDING_ID,
          assetName: ASSET_NAME,
          date: DATE,
          measurements: {
            [KEY]: [{
              timestamp: TIMESTAMP,
              value: 1
            }]
          }
        }
      },
      savedRecordings: []
    };

    const nextState: fromRecordings.State = fromRecordings.reducer(state, MeasurementActions.addMeasurement({
      timestamp: TIMESTAMP,
      assetName: ASSET_NAME,
      key: KEY,
      value: 2
    }));

    expect(nextState.activeRecordings[ASSET_NAME]).toBeDefined();
    expect(nextState.activeRecordings[ASSET_NAME].measurements).toEqual({
        [KEY]: [
          {
            timestamp: TIMESTAMP,
            value: 1
          },
          {
            timestamp: TIMESTAMP,
            value: 2
          }
        ]
      }
    );
  });
});
