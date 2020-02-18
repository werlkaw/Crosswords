import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PathConstants } from 'src/app/constants/path-constants';
import { FirebaseUserService } from 'src/app/services/auth/firebase-user.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {

  constructor(private router: Router, public firebaseUser: FirebaseUserService) { }

  ngOnInit() {
  }

  public toGamesPage() {
    this.router.navigate([PathConstants.ALL_GAMES_PATH])
  }

  public toHomePage() {
    this.router.navigate([PathConstants.HOME_PATH])
  }
}
