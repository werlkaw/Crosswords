import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { Router } from '@angular/router';
import { PathConstants } from 'src/app/constants/path-constants';

@Component({
  selector: 'app-saved-games',
  templateUrl: './saved-games.component.html',
  styleUrls: ['./saved-games.component.css']
})
export class SavedGamesComponent implements OnInit {

  public gamesList: string[] = []
  constructor(private db: DatabaseService, private router: Router) {
    db.getAllGamesForUser().once("value", (snap) => {
      for (var p in snap.val()) {
        this.gamesList.push(snap.val()[p])
      }
    })
  }

  public goToGamePage(game: string) {
    this.router.navigateByUrl(PathConstants.HOME_PATH + "?game=" + game)
  }

  ngOnInit() {
  }

}
