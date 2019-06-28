import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Recording} from '../model/recording.model';
import {Store} from '@ngrx/store';
import * as fromRoot from '../store/reducers';
import {savedRecordings} from '../store/reducers';
import {RecordingService} from '../services/recording.service';
import {saveAs} from 'file-saver';
import * as moment from 'moment';

@Component({
  selector: 'app-recordings',
  templateUrl: './recordings.component.html',
  styleUrls: ['./recordings.component.css']
})
export class RecordingsComponent implements OnInit {

  recordings$: Observable<Recording[]>;

  displayedColumns: string[] = ['date', 'assetName', 'downloadJson', 'delete'];

  constructor(
    private store: Store<fromRoot.State>,
    private recordingService: RecordingService
  ) { }

  ngOnInit() {
    this.recordings$ = this.store.select(savedRecordings);
  }

  downloadJson(recording: Recording) {
    const recordingJson = JSON.stringify(recording);

    const blob = new Blob([recordingJson], {type: 'text/json'});
    saveAs(blob, `${recording.assetName}-${moment(recording.date).format('YYYY-MM-DD_HHmmSS')}.json`);
  }

}
