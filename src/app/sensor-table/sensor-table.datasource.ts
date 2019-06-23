import {DataSource} from '@angular/cdk/table';
import {Store} from '@ngrx/store';
import * as fromRoot from '../store/reducers';
import {CollectionViewer} from '@angular/cdk/collections';
import {combineLatest, interval, Observable} from 'rxjs';
import * as fromSensors from '../store/reducers/sensor.reducer';
import * as fromMeasurements from '../store/reducers/measurement.reducer';
import {map, throttle} from 'rxjs/operators';
import {SensorWithMeasurements} from '../model/sensor.model';

export class SensorTableDataSource extends DataSource<SensorWithMeasurements> {

  constructor(private store: Store<fromRoot.State>) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<SensorWithMeasurements[] | ReadonlyArray<SensorWithMeasurements>> {
    const sensors$: Observable<fromSensors.State> = this.store.select(fromRoot.selectSensors);
    const measurements$: Observable<fromMeasurements.State> = this.store.select(fromRoot.selectMeasurements);

    return combineLatest([sensors$, measurements$]).pipe(
      throttle(() => interval(1000)),
      map(([sensors, measurements]) => {
          if (sensors && measurements) {
            return Object.keys(sensors)
              .filter(assetName => measurements[assetName])
              .map(assetName =>
                new SensorWithMeasurements(sensors[assetName], measurements[assetName]));
          } else {
            return [];
          }
        }
      )
    );
  }

  disconnect(collectionViewer: CollectionViewer): void {
  }
}
