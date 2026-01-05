import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { myAuthService } from './auth/auth.service';
import { NavigationComponent } from "./components/navigation/navigation.component";
import packageJson from '../../package.json';
import { ThemeService } from './services/theme.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-root',
    imports: [CommonModule, FormsModule, RouterOutlet, MatIconModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'beercsshtml';
  myappname = "Spaniel Salon App";
  public version: string = packageJson.version;


  //sjbUImode2: string = this.uiTheme.uiModeVal;

  constructor(public auth: myAuthService, private router: Router, public uiTheme: ThemeService, private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {}

  appCurrrentDarkMode: string ='';

  loginStatus= this.auth.isLoggedIn;

  ngOnInit(): void {
    console.log("B. Login Staus is ",this.loginStatus);
    if (!this.loginStatus){
      this.router.navigate(['login'])
    }
    else {
      console.log("C. Attempting main/homepage ");
      this.router.navigate(['main/homepage'])
    }

    // Subscribe the appCurrentDarkMode property of theme service to get real time value
    this.uiTheme.currentDarkMode.subscribe(
      // update the component's property
      darkMode => this.appCurrrentDarkMode = darkMode
    );

    //Register my own icons
    this.matIconRegistry.addSvgIconLiteral(
      'dog-barking-plus',
      this.domSanitizer.bypassSecurityTrustHtml(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
         <g transform="translate(-110, -100)">
         <path d="M194-80v-395h80v315h280v-193l105-105q29-29 45-65t16-77q0-40-16.5-76T659-741l-25-26-127 127H347l-43 43-57-56 67-67h160l160-160 82 82q40 40 62 90.5T800-600q0 57-22 107.5T716-402l-82 82v240H194Zm197-187L183-475q-11-11-17-26t-6-31q0-16 6-30.5t17-25.5l84-85 124 123q28 28 43.5 64.5T450-409q0 40-15 76.5T391-267Z"/>
         <path d="M860 -360 v 300 M710 -210 h 300" stroke="currentColor" stroke-width="90" stroke-linecap="round" />
         </g>
      </svg>
      `)
    );
  }

}
