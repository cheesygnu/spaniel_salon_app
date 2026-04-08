import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  constructor(){}

  //Used to store dark mode configuration setting in local storage
  public darkModeConfigKey = 'darkMode';

  // declare and initialize the darkMode property as a signal
  private darkModeSignal = signal<string>(localStorage.getItem(this.darkModeConfigKey) || 'light');
  darkMode = this.darkModeSignal.asReadonly();

  // function to update the value of the signal
  updateDarkMode(newDarkMode: string) {
    this.darkModeSignal.set(newDarkMode);
    localStorage.setItem(this.darkModeConfigKey, newDarkMode);
  }


}
