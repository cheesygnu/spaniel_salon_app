import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
//import { inject } from '@angular/core';
//import { AngularFireAuth } from '@angular/fire/compat/auth';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  //const angularFireAuth = inject(AngularFireAuth);
  //const user = await angularFireAuth.currentUser;
  console.log("Guard called");
  return false;
};
