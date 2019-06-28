import {createAction, props} from '@ngrx/store';

export enum RecordingActionTypes {
  StartRecording = '[Recording Service] Start Recording',
  StopRecording = '[Recording Service] Stop Recording'
}

export const startRecording = createAction(
  RecordingActionTypes.StartRecording,
  props<{
    id: string;
    date: Date;
    assetName: string;
  }>()
);

export const stopRecording = createAction(
  RecordingActionTypes.StopRecording,
  props<{
    assetName: string;
  }>()
);
