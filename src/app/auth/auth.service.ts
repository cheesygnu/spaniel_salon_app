import { Injectable } from '@angular/core';
import { Auth, User, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, setPersistence, UserCredential, browserLocalPersistence } from '@angular/fire/auth';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class myAuthService {

  userData: any

  constructor(private afAuth: Auth, private router: Router) {

    //code from https://github.com/ImeedAttia/angular-firebase-app
    onAuthStateChanged(this.afAuth, (user: any)=>{
      if(user){
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      }
      else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    })
  }

  //get User
    //get Authenticated user from firebase
    getAuthFire(){
      return this.afAuth.currentUser;
    }

  //get Authenticated user from Local Storage
  getAuthLocal(){
    const token = localStorage.getItem('user')
    const user = JSON.parse(token as string);
    return user;
  }

  //Check wither User Is logged in or not
  get isLoggedIn(): boolean {
    const token = localStorage.getItem('user')
    const user = JSON.parse(token as string);
    return user !== null ? true : false;
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

  async login(email: string, password: string): Promise<UserCredential> {
    return await this.afAuth.setPersistence(browserLocalPersistence)
      .then(() => {
        console.log('Nice, it worked!');
        localStorage.setItem('token', 'true');
        return signInWithEmailAndPassword(this.afAuth, email, password);
      })
      .then(userCredential => {
        this.router.navigate(['main/homepage']);
        return userCredential;
      })
      .catch(err => {
        console.log('Something went wrong with the login:', err.message);
        this.router.navigate(['/login']);
        throw err; // Re-throw the error to maintain Promise<UserCredential> return type
      });
  }

  logout() {
    signOut(this.afAuth).then(()=>{
      this.router.navigate(['/login']);
      console.log('logged out');
    })
    //return this.afAuth.signOut();
  }

  /*isLoggedIn(){
    let loggedInStatus: boolean = false;
    console.log(authState(this.afAuth));
    console.log(this.afAuth.currentUser)
    console.log('IsLoggedIn called');
    if (this.afAuth.currentUser===null){
      loggedInStatus = false;
    }
    else {
      loggedInStatus = true;
    }
    return loggedInStatus;
  }*/
}
