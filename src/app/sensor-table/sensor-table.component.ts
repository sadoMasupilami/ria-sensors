import {Component, OnInit} from '@angular/core';
import {DataSource} from '@angular/cdk/table';
import {Store} from '@ngrx/store';
import * as fromRoot from '../store/reducers';
import {SensorTableDataSource} from './sensor-table.datasource';
import {SensorWithMeasurements} from '../model/sensor.model';

@Component({
  selector: 'app-sensor-table',
  templateUrl: './sensor-table.component.html',
  styleUrls: ['./sensor-table.component.css']
})
export class SensorTableComponent implements OnInit {

  sensorData: DataSource<SensorWithMeasurements>;
  displayedColumns = ['assetName', 'assetId', 'warehouseId', 'lastMeasurementsReceived', 'lastValueReceivedAt', 'liveDataButton'];

  constructor(private store: Store<fromRoot.State>) {
    this.sensorData = new SensorTableDataSource(store);
  }

  ngOnInit() {
  }

}

