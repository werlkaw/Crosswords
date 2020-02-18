import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/take';
import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { CanActivate, Router } from '@angular/router';

import { PathConstants } from '../../constants/path-constants';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private angularFireAuth: AngularFireAuth, private router: Router) { }

  canActivate(): Observable<boolean> {
    return this.angularFireAuth.authState
      .take(1)
      .map((authState) => !!authState)
      .do(authenticated => {
        if (!authenticated) {
          console.log("not authenticated! redirecting...")
          this.router.navigate([PathConstants.LOGIN_PATH]);
        }
      });
  }
}
