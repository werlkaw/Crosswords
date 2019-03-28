import * as firebase from 'firebase/app';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { PathConstants } from 'src/app/constants/PathConstants';

@Injectable({
  providedIn: 'root'
})
export class FirebaseUserService {
  private _user: firebase.User

  constructor(private _firebaseAuth: AngularFireAuth, private _router: Router) {
    this._firebaseAuth.authState.subscribe((authState) => {
      this._user = authState
    });
  }

  public loggedIn() {
    return this._user != null
  }

  public getUserPhotoUrl() {
    return this._user.photoURL
  }

  private signInWithProvider(provider) {
    this._firebaseAuth.auth.signInWithPopup(provider)
    .then((result) => {
      this._router.navigate([PathConstants.HOME_PATH]);
    })
    .catch((error) => {
      console.log(error.code)
      console.log(error.message)
      console.log(error.email)
      console.log(error.credential)
    });
  }

  public signInWithGoogle() {
    var googleProvider = new firebase.auth.GoogleAuthProvider()
    this.signInWithProvider(googleProvider)
  }

  public signOut() {
    this._firebaseAuth.auth.signOut().then(() => {
      this._router.navigate([PathConstants.LOGIN_PATH]);
    }).catch((error) => {
      console.log(error)
    });
  }
}
