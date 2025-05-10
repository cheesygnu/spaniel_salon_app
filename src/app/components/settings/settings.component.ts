import { Component } from '@angular/core';
import { myAuthService } from '../../auth/auth.service';

import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { ThemeService } from '../../services/theme.service';
import { StatusBarService } from '../../services/statusBar.service';

@Component({
    selector: 'app-settings',
    imports: [FormsModule],
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.css'
})
export class SettingsComponent {

  constructor(public auth: myAuthService, private themeService: ThemeService, private statusBarService: StatusBarService) {}

  settingsCurrentDarkMode: string ='';
  settingsCurrentVisibility: string ='';
  isDarkMode: boolean = false;
  isVisible:boolean = true;
  darkModeIcon: string = '';


  ngOnInit(): void {
      // Subscribe the appCurrentDarkMode property of theme service to get real time value
      this.themeService.currentDarkMode.subscribe(
        // update the component's property
        darkMode => {
          this.settingsCurrentDarkMode = darkMode
          this.isDarkMode = darkMode === 'dark' ? true : false;
          this.darkModeIcon = darkMode === 'dark' ? 'dark_mode' : 'light_mode';
        }
      );
      // Subscribe the Show Status Bar property of statusBar service to get real time value
      this.statusBarService.currentVisibility.subscribe(
        // update the component's property
        statusBarVisibility => {
          this.settingsCurrentVisibility = statusBarVisibility
          this.isVisible = statusBarVisibility  === 'show' ? true : false;

        }
      );
    }

  // function to update the darkMode in the service
  submitDarkModeHandler(){
    this.themeService.updateDarkMode(this.settingsCurrentDarkMode);
     this.settingsCurrentDarkMode = "";
   }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.updateDarkMode(this.isDarkMode ? 'dark' : 'light');
  }

  // function to update the status bar visibility
  submitVisibilityHandler(){
    this.statusBarService.updateVisibility(this.settingsCurrentVisibility);
     this.settingsCurrentVisibility = "";
   }

  toggleStatusBar() {
    this.isVisible = !this.isVisible;
    this.statusBarService.updateVisibility(this.isVisible ? 'show' : 'hide');
  }

}
