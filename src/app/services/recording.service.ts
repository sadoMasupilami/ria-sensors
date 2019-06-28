import {Injectable} from '@angular/core';
import {v4 as uuid} from 'uuid';
import {Store} from '@ngrx/store';
import * as fromRoot from '../store/reducers';
import {savedRecordings} from '../store/reducers';
import {deleteRecording, startRecording, stopRecording} from '../store/actions/recording.actions';

@Injectable()
export class RecordingService {

  constructor(private store: Store<fromRoot.State>) {
    this.setupStorage();
  }

  setupStorage() {
    if (typeof (Storage) !== 'undefined') {
      this.store.select(savedRecordings).subscribe(recs => {
        localStorage.setItem('savedSensorRecordings', JSON.stringify(recs));
      });
    }
  }

  startRecording(assetName: string) {
    this.store.dispatch(startRecording({
      id: uuid(),
      assetName,
      date: new Date()
    }));
  }

  stopRecording(assetName: string) {
    this.store.dispatch(stopRecording({
      assetName
    }));
  }

  deleteRecording(id: string) {
    this.store.dispatch(deleteRecording({id}));
  }

}
