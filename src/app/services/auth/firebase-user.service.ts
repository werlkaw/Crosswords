import * as firebase from 'firebase/app';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { PathConstants } from 'src/app/constants/PathConstants';

@Injectable({
  providedIn: 'root'
})
export class FirebaseUserService {
  private user: firebase.User

  constructor(private firebaseAuth: AngularFireAuth, private router: Router) {
    this.firebaseAuth.authState.subscribe((authState) => {
      this.user = authState
    });
  }

  public loggedIn() {
    return this.user != null
  }

  public getUserId() {
    return this.user.uid
  }

  public getUserPhotoUrl() {
    return this.user.photoURL
  }

  private signInWithProvider(provider) {
    this.firebaseAuth.auth.signInWithPopup(provider)
    .then((result) => {
      this.router.navigate([PathConstants.HOME_PATH]);
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
    this.firebaseAuth.auth.signOut().then(() => {
      this.router.navigate([PathConstants.LOGIN_PATH]);
    }).catch((error) => {
      console.log(error)
    });
  }
}
