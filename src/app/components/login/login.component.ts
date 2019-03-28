import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FirebaseUserService } from 'src/app/services/auth/firebase-user.service';
import { PathConstants } from 'src/app/constants/PathConstants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private _firebaseUser: FirebaseUserService, private _firebaseAuth: AngularFireAuth, private _router: Router) {
    if (this._firebaseUser.loggedIn()) {
      this._router.navigate([PathConstants.HOME_PATH]);
    }
  }

  ngOnInit() {
  }

  public signInWithGoogle() {
    this._firebaseUser.signInWithGoogle()
  }
}