import { Routes } from '@angular/router';
import { DogDirectoryComponent } from './components/dogdirectory/dogdirectory.component';
import { AppointmentsComponent } from './components/appointments/appointments.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { DogDetailsComponent } from './dog-details/dog-details.component';

export const routes: Routes = [
  { path: '', redirectTo: 'homepage', pathMatch: 'full'},
  { path: 'homepage', component: HomepageComponent},
  { path: 'dog-directory', title: 'First component', component: DogDirectoryComponent },
  { path: 'appointments', component: AppointmentsComponent},
  { path: 'details/:id', component: DogDetailsComponent},
];
