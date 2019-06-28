import {SensorService} from './services/sensor.service';
import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PlotlyModule} from 'angular-plotly.js';
import {FlexLayoutModule} from '@angular/flex-layout';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatGridListModule,
  MatInputModule,
  MatMenuModule,
  MatNativeDateModule,
  MatSelectModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule
} from '@angular/material';
import {HttpClientModule} from '@angular/common/http';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HomeComponent} from './home/home.component';
import {LiveComponent} from './live/live.component';
import {StoreModule} from '@ngrx/store';
import {metaReducers, reducers} from './store/reducers';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {environment} from '../environments/environment';
import {SensorTableComponent} from './sensor-table/sensor-table.component';
import {MqttModule} from 'ngx-mqtt';
import {RecordingsComponent} from './recordings/recordings.component';
import {RecordingService} from './services/recording.service';

PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LiveComponent,
    SensorTableComponent,
    RecordingsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatSlideToggleModule,
    MatCardModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatGridListModule,
    MatDialogModule,
    MatMenuModule,
    MatSelectModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatTableModule,
    MatTabsModule,
    MatDialogModule,
    PlotlyModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    StoreModule.forRoot(reducers, {metaReducers}),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    MqttModule.forRoot(environment.mqttBroker)
  ],
  providers: [SensorService, RecordingService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
