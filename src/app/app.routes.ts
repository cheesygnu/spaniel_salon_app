import { Routes } from '@angular/router';
import { DogDirectoryComponent } from './components/dogdirectory/dogdirectory.component';
import { AppointmentsComponent } from './components/appointments/appointments.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { DogDetailsQComponent } from './components/dog-detailsQ/dog-detailsQ.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './auth/auth.guard';
import { NavigationComponent } from './components/navigation/navigation.component';
import { NotImplementedYetComponent } from './components/not-implemented-yet/not-implemented-yet.component';
import { TestPageComponent } from './components/testpage/testpage.component';
import { MyMainComponent } from './components/my-main/my-main.component';
import { SettingsComponent } from './components/settings/settings.component';

export const routes: Routes = [
  //{ path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent},
  //{ path: 'navigation', component: NavigationComponent},
  { path: 'main', component: MyMainComponent, children: [
    { path: 'homepage', component: HomepageComponent},
    { path: 'dog-directory', title: 'Dog Directory', component: DogDirectoryComponent },
    { path: 'appointments', component: AppointmentsComponent, canActivate: [authGuard]},
    { path: 'settings', component: SettingsComponent},
  ]},
  { path: 'details/:id', component: DogDetailsQComponent},
  { path: 'testpage', component: TestPageComponent},
  { path: 'not-implemented-yet', component: NotImplementedYetComponent },
  //{ path: 'signup', component: NotImplementedYetComponent },
  //These are placeholders
  { path: 'signup', redirectTo: 'not-implemented-yet', pathMatch: 'full'},
];
