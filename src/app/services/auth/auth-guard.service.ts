import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/take';
import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { CanActivate, Router } from '@angular/router';

import { PathConstants } from '../../constants/PathConstants';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private _angularFireAuth: AngularFireAuth, private _router: Router) { }

  canActivate(): Observable<boolean> {
    return this._angularFireAuth.authState
      .take(1)
      .map((authState) => !!authState)
      .do(authenticated => {
        if (!authenticated) {
          console.log("not authenticated! redirecting...")
          this._router.navigate([PathConstants.LOGIN_PATH]);
        }
      });
  }
}
