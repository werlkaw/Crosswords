import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseUserService } from 'src/app/services/auth/firebase-user.service';
import { PathConstants } from 'src/app/constants/path-constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private firebaseUser: FirebaseUserService, private router: Router) {
    if (this.firebaseUser.loggedIn()) {
      this.router.navigate([PathConstants.HOME_PATH]);
    }
  }

  ngOnInit() {
  }

  public signInWithGoogle() {
    this.firebaseUser.signInWithGoogle()
  }
}