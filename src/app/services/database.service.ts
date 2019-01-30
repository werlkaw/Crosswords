import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

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
  constructor(private db: AngularFireDatabase) { }

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
}
