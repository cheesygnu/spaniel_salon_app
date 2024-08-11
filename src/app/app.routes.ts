import { Routes } from '@angular/router';
import { DogDirectoryComponent } from './components/dogdirectory/dogdirectory.component';
import { AppointmentsComponent } from './components/appointments/appointments.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { DogDetailsComponent } from './components/dog-details/dog-details.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './auth/auth.guard';
import { NavigationComponent } from './components/navigation/navigation.component';
import { NotImplementedYetComponent } from './components/not-implemented-yet/not-implemented-yet.component';

export const routes: Routes = [
  //{ path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent},
  { path: 'navigation', component: NavigationComponent},
  { path: 'homepage', component: HomepageComponent},
  { path: 'dog-directory', title: 'First component', component: DogDirectoryComponent },
  { path: 'appointments', component: AppointmentsComponent, canActivate: [authGuard]},
  { path: 'details/:id', component: DogDetailsComponent},
  { path: 'not-implemented-yet', component: NotImplementedYetComponent },
  //{ path: 'signup', component: NotImplementedYetComponent },
  //These are placeholders
  { path: 'signup', redirectTo: 'not-implemented-yet', pathMatch: 'full'},
];
