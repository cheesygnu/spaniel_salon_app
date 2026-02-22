import { Component} from '@angular/core';
import { myAuthService } from '../../auth/auth.service';

import { FormsModule } from '@angular/forms';
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

  settingsCurrentDarkMode = this.themeService.darkMode;
  settingsCurrentVisibility = this.statusBarService.visibility;
  isDarkMode: boolean = false;
  isVisible:boolean = true;
  darkModeIcon: string = '';

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.updateDarkMode(this.isDarkMode ? 'dark' : 'light');
  }

  toggleStatusBar() {
    this.isVisible = !this.isVisible;
    this.statusBarService.updateVisibility(this.isVisible ? 'show' : 'hide');
  }

}
