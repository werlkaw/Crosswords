import { Component, OnInit } from '@angular/core';
import { FirebaseUserService } from 'src/app/services/auth/firebase-user.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {
  public gameTitle: string = "CrossWithFriends"
  constructor(public firebaseUser: FirebaseUserService) { }

  ngOnInit() {
  }
}
