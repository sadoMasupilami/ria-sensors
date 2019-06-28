import {Injectable} from '@angular/core';
import {v4 as uuid} from 'uuid';
import {Store} from '@ngrx/store';
import * as fromRoot from '../store/reducers';
import {startRecording, stopRecording} from '../store/actions/recording.actions';

@Injectable()
export class RecordingService {

  constructor(private store: Store<fromRoot.State>) {
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

}
