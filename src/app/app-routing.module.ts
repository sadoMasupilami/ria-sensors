import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {LiveComponent} from './live/live.component';
import {RecordingsComponent} from './recordings/recordings.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'live', component: LiveComponent},
  {path: 'live/:assetName', component: LiveComponent},
  {path: 'recordings', component: RecordingsComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
