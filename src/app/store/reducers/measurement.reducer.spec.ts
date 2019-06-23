import {reducer, State} from './measurement.reducer';
import {addMeasurement} from '../actions/measurement.actions';
import {deleteSensor} from '../actions/sensor.actions';

describe('The action addMeasurement', () => {
  it('should add a sensor with the corresponding key and measurement', () => {
    const KEY = 'key1';
    const ASSET_NAME = 'sensor-1';
    const TIMESTAMP = new Date();

    const nextState: State = reducer(undefined, addMeasurement({
      timestamp: TIMESTAMP,
      assetName: ASSET_NAME,
      key: KEY,
      value: 1
    }));

    expect(nextState).toEqual({
        [ASSET_NAME]: {
          [KEY]: [{
            timestamp: TIMESTAMP,
            value: 1
          }]
        }
      }
    );
  });

  it('should add a value to an existing sensor and key', () => {
    const KEY = 'key1';
    const ASSET_NAME = 'sensor-1';
    const TIMESTAMP = new Date();

    const state = {
      [ASSET_NAME]: {
        [KEY]: [{
          timestamp: TIMESTAMP,
          value: 1
        }]
      }
    };

    const nextState: State = reducer(state, addMeasurement({
      timestamp: TIMESTAMP,
      assetName: ASSET_NAME,
      key: KEY,
      value: 2
    }));

    expect(nextState).toEqual({
        [ASSET_NAME]: {
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
      }
    );
  });

  it('should add a new key and value to an existing sensor and key', () => {
    const KEY1 = 'key1';
    const KEY2 = 'key2';
    const ASSET_NAME = 'sensor-1';
    const TIMESTAMP = new Date();

    const state = {
      [ASSET_NAME]: {
        [KEY1]: [{
          timestamp: TIMESTAMP,
          value: 1
        }]
      }
    };

    const nextState: State = reducer(state, addMeasurement({
      timestamp: TIMESTAMP,
      assetName: ASSET_NAME,
      key: KEY2,
      value: 2
    }));

    expect(nextState).toEqual({
        [ASSET_NAME]: {
          [KEY1]: [
            {
              timestamp: TIMESTAMP,
              value: 1
            }],
          [KEY2]: [
            {
              timestamp: TIMESTAMP,
              value: 2
            }
          ]
        }
      }
    );
  });

});

describe('The action deleteSensor', () => {
  it('deletes measurements for the given assetName', () => {
    const KEY = 'key1';
    const ASSET_NAME = 'sensor-1';
    const TIMESTAMP = new Date();

    const state = {
      [ASSET_NAME]: {
        [KEY]: [{
          timestamp: TIMESTAMP,
          value: 1
        }]
      }
    };

    const nextState = reducer(state, deleteSensor({assetName: ASSET_NAME}));

    expect(nextState[ASSET_NAME]).toBeUndefined();
  });
});
