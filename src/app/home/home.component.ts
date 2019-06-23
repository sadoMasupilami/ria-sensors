import {Component} from '@angular/core';
import {Store} from '@ngrx/store';
import * as fromRoot from '../store/reducers';
import {selectSensorValuesAvailable} from '../store/reducers';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  sensorsAvailable$: Observable<boolean>;

  constructor(private store: Store<fromRoot.State>) {
    this.sensorsAvailable$ = store.select(selectSensorValuesAvailable);
  }
}
