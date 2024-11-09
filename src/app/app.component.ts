import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router,RouterLink, RouterOutlet } from '@angular/router';
import { myAuthService } from './auth/auth.service';
import { NavigationComponent } from "./components/navigation/navigation.component";
import packageJson from '../../package.json';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink, NavigationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'beercsshtml';
  myappname = "Spaniel Salon App";
  public version: string = packageJson.version;


  //sjbUImode2: string = this.uiTheme.uiModeVal;

  constructor(public auth: myAuthService, private router: Router, public uiTheme: ThemeService) {}

  appCurrrentDarkMode: string ='';

  loginStatus= this.auth.isLoggedIn;

  ngOnInit(): void {
    console.log("B. Login Staus is ",this.loginStatus);
    if (!this.loginStatus){
      this.router.navigate(['login'])
    }
    else {
      this.router.navigate(['main/homepage'])
    }

    // Subscribe the appCurrentDarkMode property of theme service to get real time value
    this.uiTheme.currentDarkMode.subscribe(
      // update the component's property
      darkMode => this.appCurrrentDarkMode = darkMode
    );
  }

}
