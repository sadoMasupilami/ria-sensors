import {reducer, State} from './sensor.reducer';
import {addSensor, deleteSensor} from '../actions/sensor.actions';

describe('The action AddSensor', () => {
  it('Adds a new sensor to the empty sensor state', () => {
    const assetName = 'sensor-1';
    const assetId = '1';
    const warehouseId = 'w1';
    const nextState = reducer(undefined, addSensor({
      assetName,
      assetId,
      warehouseId,
    }));

    expect(nextState[assetName]).not.toBeUndefined();
    expect(nextState[assetName]).toEqual({
      assetName,
      assetId,
      warehouseId,
    });
  });

  it('Adds a new sensor to the non-empty sensor state', () => {
    const sensor1 = {
      assetName: 'sensor-1',
      assetId: '1',
      warehouseId: 'w1',
    };

    const sensor2 = {
      assetName: 'sensor-2',
      assetId: '2',
      warehouseId: 'w2',
    };

    const state: State = {
      [sensor1.assetName]: sensor1
    };

    const nextState = reducer(state, addSensor(sensor2));

    expect(nextState[sensor1.assetName]).not.toBeUndefined();
    expect(nextState[sensor1.assetName]).toEqual(sensor1);
    expect(nextState[sensor2.assetName]).not.toBeUndefined();
    expect(nextState[sensor2.assetName]).toEqual(sensor2);
  });

});

describe('The action deleteSensor', () => {
  it('Removes sensor with assetName', () => {
    const assetName = 'sensor-1';
    const assetId = '1';
    const warehouseId1 = 'w1';

    const state: State = {
      [assetName]: {
        assetName,
        assetId,
        warehouseId: warehouseId1,
      }
    };

    const nextState = reducer(state, deleteSensor({assetName}));

    expect(nextState[assetName]).toBeUndefined();
  });
});
