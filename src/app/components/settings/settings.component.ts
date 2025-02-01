import { Component } from '@angular/core';
import { myAuthService } from '../../auth/auth.service';

import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

  constructor(public auth: myAuthService, private themeService: ThemeService) {}

  settingsCurrrentDarkMode: string ='';
  isDarkMode: boolean = false;


  ngOnInit(): void {
      // Subscribe the appCurrentDarkMode property of theme service to get real time value
      this.themeService.currentDarkMode.subscribe(
        // update the component's property
        darkMode => {
          this.settingsCurrrentDarkMode = darkMode
          this.isDarkMode = darkMode === 'dark' ? true : false;
        }
      );
    }

  // function to update the darkMode in the service
  submitHandler(){
    this.themeService.updateDarkMode(this.settingsCurrrentDarkMode);
     this.settingsCurrrentDarkMode = "";
   }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.updateDarkMode(this.isDarkMode ? 'dark' : 'light');
  }

}
