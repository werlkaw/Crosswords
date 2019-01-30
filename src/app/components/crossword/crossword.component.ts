import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TableService } from '../../services/table.service';

import { TableComponent } from '../table/table.component';
import { HintsComponent } from '../hints/hints.component';
import { FormControl } from '@angular/forms';
import { CrosswordSquare } from 'src/app/models/crosswordSquare.type';
import { DatabaseService } from 'src/app/services/database.service';
import { DatePipe } from '@angular/common';

const CROSSWORD_KEY = "crossword"
const ACROSS_HINTS_KEY = "acrossHints"
const DOWN_HINTS_KEY = "downHints"

@Component({
  selector: 'app-crossword',
  templateUrl: './crossword.component.html',
  styleUrls: ['./crossword.component.css']
})
export class CrosswordComponent implements OnInit {
  @ViewChild('table') table: TableComponent
  @ViewChild('acrossHints') acrossHints: HintsComponent
  @ViewChild('downHints') downHints: HintsComponent
  @ViewChild('dateinput') dateinput: ElementRef
  public puzzleDate: FormControl = new FormControl(new Date())

  private parser: DOMParser = new DOMParser()
  private playingGameName: string = ""
  public isCheater: boolean
  private newGameName: string = ""

  constructor(private tableService: TableService, private db: DatabaseService, private route: ActivatedRoute,
              private router: Router, private datepipe: DatePipe) {}

  ngOnInit() {
    this.route.queryParams.subscribe(queryparams => {
      if (queryparams["game"] != undefined) {
        this.playingGameName = queryparams["game"]
      }
      var loadDate = this.puzzleDate.value
      if (this.isPlayingGame()) {
        this.db.getGameDateRef(this.playingGameName).once("value", (snap) => {
          if (snap.val()) {
            loadDate = new Date(snap.val())
          } else {
            window.alert("Game does not exist or data is corrupted")
            this.refreshPage()
          }
        }).then(() => {
          this.showCrossword(loadDate)
        })
      } else {
        // When a game is defined in the URL, we will first get a subscribe event
        // with an empty queryParams, then some time later will get another sub event
        // with the correct queryParams. If the game is defined and this is the
        // first subscribe event, wait 100ms before checking if we are already
        // playing a game (from the second sub event).
        setTimeout (() => {
          if (!this.isPlayingGame()) {
            this.showCrossword(this.puzzleDate.value)
          }
        }, 100)
      }
    })
  }

  updatedSquare(updatedSquare: CrosswordSquare) {
    var acrossHintNumber = updatedSquare.getAcrossGroup().getHintNumber()
    var downHintNumber = updatedSquare.getDownGroup().getHintNumber()
    var acrossWordFilled = CrosswordSquare.wordIsFilled(updatedSquare.getAcrossGroup().getSquares())
    var downWordFilled = CrosswordSquare.wordIsFilled(updatedSquare.getDownGroup().getSquares())

    this.acrossHints.getHintData().get(acrossHintNumber).setStrikedOut(acrossWordFilled)
    this.downHints.getHintData().get(downHintNumber).setStrikedOut(downWordFilled)
    
    // If playing game, push changes to database.
    if (this.isPlayingGame()) {
      var [row, col] = updatedSquare.getTableLocation()

      // Write only changes to json objects to pass to update function.
      var gameDataJsonUpdateObj = {}
      var acrossHintJsonUpdateObj = {}
      var downHintJsonUpdateObj = {}
      gameDataJsonUpdateObj[col.toString()] = updatedSquare.getLetter()
      acrossHintJsonUpdateObj[acrossHintNumber.toString()] = acrossWordFilled
      downHintJsonUpdateObj[downHintNumber.toString()] = downWordFilled

      // Update all parts of database independently.
      this.db.getGameRowRef(this.playingGameName, row).update(gameDataJsonUpdateObj)
      this.db.getAcrossHintsRef(this.playingGameName).update(acrossHintJsonUpdateObj)
      this.db.getDownHintsRef(this.playingGameName).update(downHintJsonUpdateObj)
    }
  }

  /* newFocusedSquare is executed everytime a new square is clicked on in the puzzle. */
  newFocusedSquare(focusedSquare: CrosswordSquare) {
    this.acrossHints.setFocusedHint(focusedSquare.getAcrossGroup().getHintNumber())
    this.downHints.setFocusedHint(focusedSquare.getDownGroup().getHintNumber())
  }

  getDateStringFromDate(date: Date): string {
    return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear()
  }

  isPlayingGame(): boolean {
    return this.playingGameName != "" && this.playingGameName != null
  }

  /* startGameListeners is called when a collaborative game is loaded. It initializes all the
     subscriptions necessary to keep the game updated when other people modify it. */
  private startGameListeners() {
    if (this.isPlayingGame()) {
      var updateGameDataCallback = (snap) => {
        if (this.table.isLoaded()) {
          this.table.updateFromDatabase(snap.child(DatabaseService.GAME_DATA_CHILD_NAME).val())
          this.acrossHints.updateFromDatabase(snap.child(DatabaseService.ACROSS_STRIKED_CHILD_NAME).val())
          this.downHints.updateFromDatabase(snap.child(DatabaseService.DOWN_STRIKED_CHILD_NAME).val())
        }
      }
      this.db.getGameRef(this.playingGameName).once("value", updateGameDataCallback)
      this.db.getGameRef(this.playingGameName).on("value", updateGameDataCallback)
    }
  }

  public showNewPuzzle() {
    this.puzzleDate.setValue(new Date(this.dateinput.nativeElement.value))
    if (this.isPlayingGame()) {
      console.log("sneaky sneaky, no changing the date while playing a game!")
      this.isCheater = true
      return
    }
    this.showCrossword(this.puzzleDate.value)
  }

  private refreshPage() {
    this.router.navigate([""])
    window.location.reload()
  }

  private startNewGame() {
    if (!/^[a-z0-9-]+$/i.test(this.newGameName)) {
      window.alert("Game name must not be empty and must be alpha-numeric")
    } else {
      this.newGameName = escape(this.newGameName)
      this.db.getGameRef(this.newGameName).once("value", (snap) => {
        if (snap.val() == null) {
          this.db.getGameRef(this.newGameName).set({
            game_data: this.table.getSnapshotForDatabase(),
            date: this.datepipe.transform(this.puzzleDate.value, 'MM/dd/yyyy'),
            across_striked_hints: this.acrossHints.getSnapshotForDatabase(),
            down_striked_hints: this.downHints.getSnapshotForDatabase(),
          }).then(() => {
            this.router.navigateByUrl("/?game=" + this.newGameName)
            window.location.reload()
          })
        } else {
          window.alert("Sorry, name is taken. Pick another one.")
        }
      })
    }
  }

  populateTableAndHints(data: Object) {
    this.table.populate(this.parser.parseFromString(data[CROSSWORD_KEY], "text/html"))
    this.acrossHints.setLabel("Across")
    this.downHints.setLabel("Down")
    this.acrossHints.populate(this.parser.parseFromString(data[ACROSS_HINTS_KEY], "text/html"))
    this.downHints.populate(this.parser.parseFromString(data[DOWN_HINTS_KEY], "text/html"))

    this.startGameListeners()
  }

  showCrossword(loadDate: Date) {
    if (loadDate != null) {
      this.puzzleDate.setValue(loadDate)

      var foundInDatabase = false
      // See if puzzle is already loaded in our realtime database. If it's not, fetch from external source.
      this.db.getPuzzleRef(loadDate).once("value", (snap) => {
        if (snap.val() != null) {
          foundInDatabase = true
          this.populateTableAndHints(snap.val())
        }
      }).then(() => {
        if (!foundInDatabase) {
          this.tableService.fetchCrossword(this.getDateStringFromDate(loadDate)).subscribe((_response: Object) => {
            if (_response[ACROSS_HINTS_KEY] == undefined) {
              window.alert("Sorry, could not find crossword for this date. Please select another date.")
              return
            }
    
            // Insert data into realtime database.
            var realtimeDbJson = {}
            realtimeDbJson[CROSSWORD_KEY] = _response[CROSSWORD_KEY]
            realtimeDbJson[ACROSS_HINTS_KEY] = _response[ACROSS_HINTS_KEY]
            realtimeDbJson[DOWN_HINTS_KEY] = _response[DOWN_HINTS_KEY]
            this.db.getPuzzleRef(loadDate).set(realtimeDbJson)
    
            this.populateTableAndHints(_response)
          });
        }
      })
    }
  }
}
