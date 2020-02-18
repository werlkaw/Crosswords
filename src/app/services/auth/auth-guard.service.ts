import { map, tap, first } from 'rxjs/operators'
import { Observable, of } from 'rxjs';

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
    .pipe(
      first(),
      map((authState) => !!authState),
      tap(authenticated => {
        if (!authenticated) {
          console.log("not authenticated! redirecting...")
          this.router.navigate([PathConstants.LOGIN_PATH]);
        }
      })
    );
  }
}
