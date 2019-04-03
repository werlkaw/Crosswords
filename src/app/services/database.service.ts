import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { HintsComponent } from '../components/hints/hints.component';
import { TableComponent } from '../components/table/table.component';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  static GAMES_CHILD_NAME = "games"
  static PUZZLES_CHILD_NAME = "puzzles"
  static DATE_CHILD_NAME = "date"
  static GAME_DATA_CHILD_NAME = "game_data"
  static ACROSS_STRIKED_CHILD_NAME = "across_striked_hints"
  static DOWN_STRIKED_CHILD_NAME = "down_striked_hints"
  constructor(private db: AngularFireDatabase, private router: Router) { }

  public getGameRef(gameName: string) {
    return this.db.database.ref().child(DatabaseService.GAMES_CHILD_NAME).child(gameName)
  }
  
  public getGameDateRef(gameName: string) {
    return this.getGameRef(gameName).child(DatabaseService.DATE_CHILD_NAME)
  }

  public getGameDataRef(gameName: string) {
    return this.getGameRef(gameName).child(DatabaseService.GAME_DATA_CHILD_NAME)
  }

  public getGameRowRef(gameName: string, row: number) {
    return this.getGameRef(gameName).child(DatabaseService.GAME_DATA_CHILD_NAME).child(row.toString())
  }

  public getAcrossHintsRef(gameName: string) {
    return this.getGameRef(gameName).child(DatabaseService.ACROSS_STRIKED_CHILD_NAME)
  }

  public getDownHintsRef(gameName: string) {
    return this.getGameRef(gameName).child(DatabaseService.DOWN_STRIKED_CHILD_NAME)
  }

  public getPuzzleRef(date: Date) {
    var date_string = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate()
    return this.db.database.ref().child(DatabaseService.PUZZLES_CHILD_NAME).child(date_string)
  }

  public createGame(newGameName: string, table: TableComponent, gameDate: string,
                    acrossHints: HintsComponent, downHints: HintsComponent) {
    this.getGameRef(newGameName).once("value", (snap) => {
      if (snap.val() == null) {
        this.getGameRef(newGameName).set({
          game_data: table.getSnapshotForDatabase(),
          date: gameDate,
          across_striked_hints: acrossHints.getSnapshotForDatabase(),
          down_striked_hints: downHints.getSnapshotForDatabase(),
        }).then(() => {
          this.router.navigateByUrl("?game=" + newGameName)
          setTimeout(() => {
            window.location.reload()
          }, 100)
        })
      }
    })
  }
}
