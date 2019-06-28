import {Component, OnInit} from '@angular/core';
import {DataSource} from '@angular/cdk/table';
import {Store} from '@ngrx/store';
import * as fromRoot from '../store/reducers';
import {activeRecordings} from '../store/reducers';
import {SensorTableDataSource} from './sensor-table.datasource';
import {SensorWithMeasurements} from '../model/sensor.model';
import {Observable} from 'rxjs';
import {Recording} from '../model/recording.model';
import {RecordingService} from '../services/recording.service';

@Component({
  selector: 'app-sensor-table',
  templateUrl: './sensor-table.component.html',
  styleUrls: ['./sensor-table.component.css']
})
export class SensorTableComponent implements OnInit {

  sensorData: DataSource<SensorWithMeasurements>;
  displayedColumns = [
    'assetName',
    'assetId',
    'warehouseId',
    'lastMeasurementsReceived',
    'lastValueReceivedAt',
    'liveDataButton',
    'recordButton'
  ];

  activeRecordings$: Observable<{ [assetName: string]: Recording }>;

  constructor(
    private store: Store<fromRoot.State>,
    private recordingService: RecordingService
  ) {
    this.sensorData = new SensorTableDataSource(store);
  }

  ngOnInit() {
    this.activeRecordings$ = this.store.select(activeRecordings);
  }

}

