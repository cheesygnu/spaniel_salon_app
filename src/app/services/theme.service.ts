import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {

  constructor(){}

  // declare and initialize the darkMode property
  // which will be a BehaviorSubject
  darkMode = new BehaviorSubject("dark");

  // expose the BehaviorSubject as an Observable
  currentDarkMode = this.darkMode.asObservable();

  // function to update the value of the BehaviorSubject
  updateDarkMode(newDarkMode: string){
    this.darkMode.next(newDarkMode);
  }

  /*toggleTheme() {
    this.isDarkMode.next(!this.isDarkMode.value); // Update to use BehaviorSubject
    console.log(`Theme toggled. Dark mode is now ${this.isDarkMode.value ? 'enabled' : 'disabled'}.`);
    //document.body.classList.toggle('dark', this.isDarkMode.value);
  }

  isDarkModeEnabled(): boolean {
    console.log('isDarkModeEnabled within theme.service has been called')
    return this.isDarkMode.getValue(); // Updated to get the boolean value
  }

  uiMode(): string {
    console.log('uiMode function within theme.service has been called')
    return this.isDarkMode ? 'dark' : 'light';
  }

  get uiModeVal(): string {
    return this.uiMode();
}*/

}
