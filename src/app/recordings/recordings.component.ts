import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Recording} from '../model/recording.model';
import {Store} from '@ngrx/store';
import * as fromRoot from '../store/reducers';
import {savedRecordings} from '../store/reducers';

@Component({
  selector: 'app-recordings',
  templateUrl: './recordings.component.html',
  styleUrls: ['./recordings.component.css']
})
export class RecordingsComponent implements OnInit {

  recordings$: Observable<Recording[]>;

  displayedColumns: string[] = ['date', 'assetName', 'downloadCsv', 'delete'];

  constructor(private store: Store<fromRoot.State>) { }

  ngOnInit() {
    this.recordings$ = this.store.select(savedRecordings);
  }

}
