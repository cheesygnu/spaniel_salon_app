import { Injectable } from '@angular/core';
import { Auth, authState, User, user, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@angular/fire/auth';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class myAuthService {

  user: any //Observable<firebase.User| null>;

  constructor(private afAuth: Auth, private router: Router) {

    this.user = afAuth.currentUser;
  }

  signup(email: string, password: string) {
      createUserWithEmailAndPassword(this.afAuth, email, password)
      .then(value => {
        console.log('Success!', value);
      })
      .catch(err => {
        console.log('Something went wrong:',err.message);
      });
  }

  login(email: string, password: string) {
      signInWithEmailAndPassword(this.afAuth, email, password)
      .then(value => {
        console.log('Nice, it worked!');
      })
      .catch(err => {
        console.log('Something went wrong:',err.message);
      });
  }

  logout() {
    return this.afAuth.signOut();
  }

  isLoggedIn(){
    console.log(authState(this.afAuth));
    console.log('IsLoggedIn called');
    return false;
  }
}
