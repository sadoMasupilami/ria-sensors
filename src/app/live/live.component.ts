import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import * as fromRoot from '../store/reducers';
import {selectAllSensors, selectMeasurementsForAssetName} from '../store/reducers';
import {Sensor} from '../model/sensor.model';
import {ActivatedRoute} from '@angular/router';
import {filter, map} from 'rxjs/operators';
import {Observable, Subscription} from 'rxjs';
import * as _ from 'lodash';
import {Measurements} from '../model/measurement.model';

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.css'],
})
export class LiveComponent implements OnInit, OnDestroy {

  constructor(
    private store: Store<fromRoot.State>,
    private route: ActivatedRoute,
  ) {
  }

  sensorPlots$: Observable<any[]>;
  sensorMeasurements$: Observable<any>[] = [];

  assetName: string;

  private subscription: Subscription = new Subscription();

  public static createPlotMetadataForSensor(sensor: Sensor) {
    return {
      assetName: sensor.assetName,
      config: {
        displayModeBar: false
      },
      layout: {
        legend: {orientation: 'h'},
        autosize: true,
        font: {family: 'Roboto, "Helvetica Neue", sans-serif'},
        margin: {t: 70, b: 30, l: 40, r: 40},
      }
    };
  }

  ngOnInit() {
    this.subscription.add(this.route.params.subscribe(params => {
      if (params.assetName) {
        this.registerForSensor(params.assetName);
      } else {
        this.registerForAllSensors();
      }
    }));
  }

  private registerForSensor(assetName: any) {
    const sensors$ = this.store.select(selectAllSensors).pipe(
      filter(allSensors => !_.isEmpty(allSensors))
    );

    this.sensorPlots$ = sensors$.pipe(
      map(allSensors => allSensors
        .filter(sensor => sensor.assetName === assetName)
        .map(sensor => LiveComponent.createPlotMetadataForSensor(sensor)))
    );

    sensors$.subscribe(allSensors => {
      allSensors.map(sensor => {
        this.sensorMeasurements$[sensor.assetName] = this.store.select(selectMeasurementsForAssetName, {assetName: sensor.assetName}).pipe(
          filter(measurements => measurements !== undefined),
          map(measurements => Object.keys(measurements).map(key => {
            return {
              x: measurements[key].map(m => m.timestamp),
              y: measurements[key].map(m => m.value),
              type: 'scattergl',
              mode: 'lines+points',
              name: key,
              line: {
                shape: 'spline'
              }
            };
          })),
        );
      });
    });
  }

  private registerForAllSensors() {
    const sensors$ = this.store.select(selectAllSensors);

    this.sensorPlots$ = sensors$.pipe(
      filter(allSensors => !_.isEmpty(allSensors)),
      map(allSensors => allSensors.map(sensor => LiveComponent.createPlotMetadataForSensor(sensor)))
    );

    this.store.select(selectAllSensors).pipe(
      filter(allSensors => !_.isEmpty(allSensors)),
    ).subscribe(allSensors => {
      allSensors.map(sensor => {
        this.sensorMeasurements$[sensor.assetName] = this.store.select(selectMeasurementsForAssetName, {assetName: sensor.assetName}).pipe(
          filter(measurements => measurements !== undefined),
          map(this.createDataRecord),
        );
      });
    });
  }

  private createDataRecord(measurements: Measurements) {
    return Object.keys(measurements).map(key => {
      return {
        x: measurements[key].map(m => m.timestamp),
        y: measurements[key].map(m => m.value),
        type: 'scattergl',
        mode: 'lines+points',
        name: key
      };
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
