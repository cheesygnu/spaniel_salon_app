import { Routes } from '@angular/router';
import { DogDirectoryComponent } from './components/dogdirectory/dogdirectory.component';
import { AppointmentsComponent } from './components/appointments/appointments.component';
import { HomepageComponent } from './components/homepage/homepage.component';

export const routes: Routes = [
  { path: 'homepage', component: HomepageComponent},
  { path: 'dog-directory', title: 'First component', component: DogDirectoryComponent},
  { path: 'appointments', component: AppointmentsComponent},
];
