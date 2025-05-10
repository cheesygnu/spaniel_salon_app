import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StatusBarService {
  // use of BehaviourSubject learnt from https://medium.com/@mohsinogen/angular-17-data-sharing-with-behaviorsubjects-a-simple-guide-bab56530c832
  constructor(){}

  // declare and initialize the darkMode property
  // which will be a BehaviorSubject
  statusBarVisibility = new BehaviorSubject("show");

  // expose the BehaviorSubject as an Observable
  currentVisibility = this.statusBarVisibility.asObservable();

  // function to update the value of the BehaviorSubject
  updateVisibility(newVisibility: string){
    this.statusBarVisibility.next(newVisibility);
  }

}
