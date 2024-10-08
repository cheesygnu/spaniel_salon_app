import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  // use of BehaviourSubject learnt from https://medium.com/@mohsinogen/angular-17-data-sharing-with-behaviorsubjects-a-simple-guide-bab56530c832
  constructor(){}

  // declare and initialize the darkMode property
  // which will be a BehaviorSubject
  darkMode = new BehaviorSubject("light");

  // expose the BehaviorSubject as an Observable
  currentDarkMode = this.darkMode.asObservable();

  // function to update the value of the BehaviorSubject
  updateDarkMode(newDarkMode: string){
    this.darkMode.next(newDarkMode);
  }

}
