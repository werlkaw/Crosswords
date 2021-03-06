import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { CrosswordSquare, HintGroup } from 'src/app/models/crosswordSquare.type';
import { HtmlHelperService } from 'src/app/services/html-helper.service';

const SELECTED_SQUARE_CLASS = "selected-square"
const HIGHLIGHTED_WORD_CLASS = "highlighted-word"

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TableComponent implements OnInit {
  @Output() outputChangedSquare = new EventEmitter<CrosswordSquare>();
  @Output() outputFocusedSquare = new EventEmitter<CrosswordSquare>();
  @ViewChild("puzzleInput", { static: true }) puzzleInput: ElementRef

  private isVertical: boolean = false
  private isLoaded: boolean
  private focusedSquare: CrosswordSquare
  private successAudio: HTMLAudioElement = new Audio()
  private playedSuccessAudio = false
  public puzzleTableId: string = "puzzle-table-id"
  public tableData: CrosswordSquare[][] = new Array()

  constructor(private htmlHelper: HtmlHelperService) {
    this.successAudio.src = "../../assets/success.wav"
  }

  ngOnInit() {}

  private updateFocusedSquare(square: CrosswordSquare, emit: boolean = true) {
    this.puzzleInput.nativeElement.focus()
    this.focusedSquare = square
    if (emit) {
      this.outputFocusedSquare.emit(this.focusedSquare)
    }
    this.highlightWord(this.focusedSquare)
  }

  private findSquareByNumber(hintNumber: number) {
    for (let row = 0; row < this.tableData.length; row++) {
      for (let column = 0; column < this.tableData[row].length; column++) {
        if (+this.tableData[row][column].getNumber() == hintNumber) {
          return this.tableData[row][column]
        }
      }
    }
  }

  public updateFocusedSquareByClickedHint(hintNumber: number) {
    this.updateFocusedSquare(this.findSquareByNumber(hintNumber), false)
  }

  private writeToSquare(square: CrosswordSquare, data: string) {
    square.setLetter(data)
    this.outputChangedSquare.emit(square)
  }

  public getTableData() {
    return this.tableData
  }

  /* moveWithArrow changes the focused square based on the directional arrow pressed. */
  private moveWithArrow(direction: string) {
    var [row, col] = this.focusedSquare.getTableLocation()
    if (direction == "ArrowDown" && row + 1 < this.tableData.length && this.tableData[row + 1][col].isWritable()) {
      this.updateFocusedSquare(this.tableData[row+1][col])
    } else if (direction == "ArrowUp" && row - 1 >= 0 && this.tableData[row - 1][col].isWritable()) {
      this.updateFocusedSquare(this.tableData[row - 1][col])
    } else if (direction == "ArrowLeft" && col - 1 >= 0 && this.tableData[row][col - 1].isWritable()) {
      this.updateFocusedSquare(this.tableData[row][col - 1])
    } else if (direction == "ArrowRight" && col + 1 < this.tableData[row].length && this.tableData[row][col + 1].isWritable()) {
      this.updateFocusedSquare(this.tableData[row][col + 1])
    }
  }

  /* onKeyDown captures when the backspace key is pressed. */
  public onKeyDown(event: any) {
    var input: string = event.key
    if (input == "Backspace") {
      // If the current square is empty, delete the previous square.
      if (!this.focusedSquare.getLetter()) {
        this.focusPreviousSquare(this.focusedSquare)
      }
      this.writeToSquare(this.focusedSquare, "")
    } else if (input == "ArrowUp" || input == "ArrowDown" || input == "ArrowLeft" || input == "ArrowRight") {
      this.moveWithArrow(input)
    }
  }

  /* onInputChange executes every time the user types in a letter on the crossword puzzle. */
  public onInputChange(event: any) {
    var input: string = event.target.value
    // If we have a focused square and we pressed a letter, fill the focused square.
    if (this.focusedSquare !== null) {
      this.writeToSquare(this.focusedSquare, input)
      this.focusNextSquare(this.focusedSquare)
    }
    event.target.value = ""

    // Checks if the puzzle is completed.
    this.checkFinishedState()
  }

  public onSquareClick(clickedSquare: CrosswordSquare) {
    if (!clickedSquare.isWritable()) {
      return
    }
    if (clickedSquare == this.focusedSquare) {
      this.isVertical = !this.isVertical
    }
    this.updateFocusedSquare(clickedSquare)
  }

  /* removeHightlightsFromTable removes the background color from all squares in the crossword table. */
  private removeHighlightsFromTable(): void {
    for (let row = 0; row < this.tableData.length; row++) {
      for (let column = 0; column < this.tableData[row].length; column++) {
        let current_square = this.tableData[row][column]
        current_square.getCssClasses().removeClass(SELECTED_SQUARE_CLASS)
        current_square.getCssClasses().removeClass(HIGHLIGHTED_WORD_CLASS)
      }
    }
  }

  /* getDownWord returns an array of squares that make up the vertical word of which
     the given square is a part of. */
  private getDownWord(square: CrosswordSquare): CrosswordSquare[] {
    var squares: CrosswordSquare[] = []
    var row = square.getTableLocation()[0]
    var col = square.getTableLocation()[1]

    // Go to start of word.
    while (row > 0 && !this.tableData[row - 1][col].isBlack()) {
      row--
    }
    // Add all squares until the end of the puzzzle or we hit a black square.
    while (row < this.tableData.length && !this.tableData[row][col].isBlack()) {
      squares.push(this.tableData[row][col])
      row++
    }
    return squares
  }

  /* getHorizontalWord returns an array of squares that make up the horizontal word of which
     the given square is a part of. */
  private getHorizontalWord(square: CrosswordSquare): CrosswordSquare[] {
    let squares: CrosswordSquare[] = []
    let [row, col] = square.getTableLocation()

    // Go to start of word.
    while (col > 0 && !this.tableData[row][col - 1].isBlack()) {
      col--
    }
    // Add all squares until the end of the puzzzle or we hit a black square.
    while (col < this.tableData[row].length && !this.tableData[row][col].isBlack()) {
      squares.push(this.tableData[row][col])
      col++
    }
    return squares
  }

  /* highlightWord applies classes to the squares in the currently selected word
     to give it a background color. */
  private highlightWord(clicked_square: CrosswordSquare): void {
    this.removeHighlightsFromTable()

    let wordToHighlight = this.isVertical ? this.getDownWord(clicked_square) : this.getHorizontalWord(clicked_square)
    for (let square of wordToHighlight) {
      if (square != clicked_square) {
        square.getCssClasses().addClass(HIGHLIGHTED_WORD_CLASS)
      } else {
        clicked_square.getCssClasses().addClass(SELECTED_SQUARE_CLASS)
      }
    }
  }

  /* getNextSquare focuses the next square relative to the current square. */
  private focusNextSquare(current_square: CrosswordSquare): void {
    let [next_row, next_col] = current_square.getTableLocation()
    if (this.isVertical) {
      next_row++
    } else {
      next_col++
    }
    if (next_row < this.tableData.length && 
        next_col < this.tableData[next_row].length &&
        !this.tableData[next_row][next_col].isBlack()) {
      // Squares with static text cannot be focused.
      if (this.tableData[next_row][next_col].getStaticText()) {
        this.focusNextSquare(this.tableData[next_row][next_col])
      } else {
        this.updateFocusedSquare(this.tableData[next_row][next_col])
      }
    }
  }

  /* focusPreviousSquare focuses the previous square relative to the current square. */
  private focusPreviousSquare(current_square: CrosswordSquare): void {
    let [next_row, next_col] = current_square.getTableLocation()
    if (this.isVertical) {
      next_row--
    } else {
      next_col--
    }
    if (next_row >= 0 && next_col >= 0 && !this.tableData[next_row][next_col].isBlack()) {
      // Squares with static text cannot be focused.
      if (this.tableData[next_row][next_col].getStaticText()) {
        this.focusPreviousSquare(this.tableData[next_row][next_col])
      } else {
        this.updateFocusedSquare(this.tableData[next_row][next_col])
      }
    }
  }

  /* addHintGroups modifies the table data to include the across and down
     answers that each square is a part of. It also includes the group of squares
     that make up the answer to its across and down hints for each square. */
  private addHintGroups(): void {
    // If tableData is empty, return
    if (!this.tableData.length) {
      return
    }
    // Iterate across each row and populate acrossGroup data
    var acrossNumber: number
    for (let row = 0; row < this.tableData.length; row++) {
      for(let column = 0; column < this.tableData[row].length; column++) {
        if (column == 0 || this.tableData[row][column-1].isBlack()) {
          acrossNumber = +this.tableData[row][column].getNumber()
        }
        this.tableData[row][column].setAcrossGroup(new HintGroup(acrossNumber, this.getHorizontalWord(this.tableData[row][column])))
      }
    }

    // Iterate down each column and populate downGroup data
    var downNumber: number
    for (let column = 0; column < this.tableData[0].length; column++) {
      for(let row = 0; row < this.tableData.length; row++) {
        if (row == 0 || this.tableData[row-1][column].isBlack()) {
          downNumber = +this.tableData[row][column].getNumber()
        }
        this.tableData[row][column].setDownGroup(new HintGroup(downNumber, this.getDownWord(this.tableData[row][column])))
      }
    }
  }

  public getIsLoaded() {
    return this.isLoaded
  }

  public getFocusedSquare() {
    return this.focusedSquare
  }

  public setVertical(vertical: boolean) {
    this.isVertical = vertical
  }

  public getIsVertical() {
    return this.isVertical
  }

  public getSnapshotForDatabase(): string[][] {
    var gameState: string[][] = new Array()
    for (var row = 0; row < this.tableData.length; row++) {
      gameState.push(new Array())
      for (var col = 0; col < this.tableData[row].length; col++) {
        gameState[row].push(this.tableData[row][col].getLetter())
      }
    }
    return gameState
  }

  private showMessage(message: string) {
    this.htmlHelper.runAfterRender(() => { window.alert(message)})
  }

  // Checks if the puzzle is completed. If it is, runs some end-game code.
  private checkFinishedState() {
    let somethingIsWrong = false
    let emptySquare = false
    this.tableData.forEach((row) => {
      row.forEach((square) => {
        somethingIsWrong = somethingIsWrong || (square.isWritable() && (!square.getLetter() || square.getLetter() != square.getAnswer()))
        emptySquare = emptySquare || (square.isWritable() && !square.getLetter())
      })
      if (emptySquare) {
        return
      }
    })

    if (!emptySquare) {
      if (!somethingIsWrong && !this.playedSuccessAudio) {
        this.successAudio.play()
        this.playedSuccessAudio = true
        this.showMessage("congrats, you did it!")
      } else if (somethingIsWrong) {
        this.showMessage("hmm... something's wrong, keep trying!")
      }
    }
  }

  public updateFromDatabase(databaseData: string[][], firstLoad: boolean) {
    if (databaseData.length != this.tableData.length) {
      console.log("data is corrupt, number of rows don't match")
      return
    }
    var htmlElement, currentSquare: CrosswordSquare
    for (var row = 0; row < databaseData.length; row++) {
      if (databaseData[row].length != this.tableData[row].length) {
        console.log("data is corrupt, number of columns don't match")
        return
      }
      for (var col = 0; col < databaseData[row].length; col++) {
        currentSquare = this.tableData[row][col]
        if (currentSquare.isWritable()) {
          currentSquare.setLetter(databaseData[row][col])
          htmlElement = document.getElementById(currentSquare.getIdForHtml())
          if (htmlElement != null) {
            htmlElement.innerHTML = currentSquare.toHtml()
          }
        }
      }
    }
    if (!firstLoad) {
      this.checkFinishedState()
    }
  }

  public populate(data: Document) {
    // Initialize data and answers to empty arrays
    this.isLoaded = false;
    this.tableData = new Array();
    let rows = data.getElementsByTagName("tr");
    for (let row = 0; row < rows.length; row++) {
      this.tableData.push(new Array())
      let columns = rows[row].getElementsByTagName("td")
      for (let column = 0; column < columns.length; column++) {
        let currentSquare = new CrosswordSquare([row, column]);
        if (columns[column].getAttribute("class") !== null) {
          for (let cssClass of columns[column].getAttribute("class").split(" ")) {
            currentSquare.getCssClasses().addClass(cssClass)
          }
        }

        // Some puzzles have prefilled static text. This should catch that.
        let nonLetterTextElem = columns[column].getElementsByClassName("subst")
        if (nonLetterTextElem.length > 0) {
          currentSquare.setStaticText(nonLetterTextElem[0].innerHTML)
        }
        currentSquare.setBlack(columns[column].getAttribute("class") === "black")
        let letterElem = columns[column].getElementsByClassName("letter")
        if (letterElem.length > 0) {
          currentSquare.setAnswer(letterElem[0].innerHTML)
        }
        let numberElem = columns[column].getElementsByClassName("num")
        if (numberElem.length > 0) {
          currentSquare.setNumber(numberElem[0].innerHTML)
        }
        this.tableData[row].push(currentSquare)
      }
    }
    this.addHintGroups()
    this.isLoaded = true
  }
}
