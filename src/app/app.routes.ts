import { Routes } from '@angular/router';
import { DogDirectoryComponent } from './components/dogdirectory/dogdirectory.component';
import { AppointmentsComponent } from './components/appointments/appointments.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { DogDetailsComponent } from './components/dog-details/dog-details.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent},
  { path: 'homepage', component: HomepageComponent},
  { path: 'dog-directory', title: 'First component', component: DogDirectoryComponent },
  { path: 'appointments', component: AppointmentsComponent, canActivate: [authGuard]},
  { path: 'details/:id', component: DogDetailsComponent},
];
