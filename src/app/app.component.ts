import {Component, OnInit} from '@angular/core';
import {SensorService} from './services/sensor.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    // This service has to be instantiated to listen to sensor data
    private sensorListener: SensorService) {}

  ngOnInit(): void {
  }

}
