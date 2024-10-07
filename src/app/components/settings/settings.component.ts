import { Component } from '@angular/core';
import { myAuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

  constructor(public auth: myAuthService, private themeService: ThemeService) {}

  settingsCurrrentDarkMode: string ='';

  ngOnInit(): void {
      // Subscribe the appCurrentDarkMode property of theme service to get real time value
      this.themeService.currentDarkMode.subscribe(
        // update the component's property
        darkMode => this.settingsCurrrentDarkMode = darkMode
      );
    }

  // function to update the darkMode in the service
  submitHandler(){
    this.themeService.updateDarkMode(this.settingsCurrrentDarkMode);
     this.settingsCurrrentDarkMode="";
   }

  /*toggleTheme() {
    this.themeService.toggleTheme(); // Use the service to toggle the theme
  }

  get isDarkMode(): boolean {
    return this.themeService.isDarkModeEnabled(); // Check if dark mode is enabled
  }

  get myUImode(): string {
    return this.themeService.uiMode();
  }*/
}
