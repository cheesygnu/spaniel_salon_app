import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StatusBarService {

  constructor(){}

  //Used to store status bar visibility configuration setting in local storage
  public visibilityConfigKey:string = 'visibilityConfig';

  // declare and initialize the darkMode property
  // which will be a BehaviorSubject
  private statusBarVisibilitySignal = signal<string>(localStorage.getItem(this.visibilityConfigKey) || 'hide');
  visibility = this.statusBarVisibilitySignal.asReadonly();

  updateVisibility(newVisibility: string) {
    this.statusBarVisibilitySignal.set(newVisibility);
    localStorage.setItem(this.visibilityConfigKey, newVisibility);
  }

}
