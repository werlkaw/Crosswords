import { CssClasses } from "./crosswordHtmlUtil.type";

export class HintGroup {
  private hintNumber: number = 0
  private squares: CrosswordSquare[] = []

  constructor(hintNumber: number, squares: CrosswordSquare[]) {
    this.hintNumber = hintNumber
    this.squares = squares
  }

  public getHintNumber() {
    return this.hintNumber
  }

  public getSquares() {
    return this.squares
  }
}

export class CrosswordSquare {
  private cssClasses: CssClasses = new CssClasses()
  private letter: string = ""
  private answer: string = ""
  private staticText: string = ""
  private number: string = ""
  private black: boolean
  private tableLocation: [number, number]
  private acrossHintGroup: HintGroup
  private downHintGroup: HintGroup

  constructor(tableLocation: [number, number]) {
    this.tableLocation = tableLocation
  }

  public getAnswer() {
    return this.answer
  }

  public setAnswer(data: string) {
    this.answer = data
  }

  public getAcrossGroup() {
    return this.acrossHintGroup
  }

  public setAcrossGroup(data: HintGroup) {
    this.acrossHintGroup = data
  }

  public getDownGroup() {
    return this.downHintGroup
  }

  public setDownGroup(data: HintGroup) {
    this.downHintGroup = data
  }

  public isBlack() {
    return this.black
  }

  public setBlack(data: boolean) {
    this.black = data
  }

  public getNumber(): string {
    return this.number
  }

  public setNumber(data: string) {
    if (!this.number && /^([0-9]+)$/.test(data)) {
      this.number = data
    }
  }

  public getTableLocation() {
    return this.tableLocation
  }

  public getCssClasses() {
    return this.cssClasses
  }

  public getLetter(): string {
    return this.letter
  }

  public setLetter(data: string) {
    if (data.length > 1) {
      console.log("Square can only have one letter as text.")
      return
    } else if (!data) {
      this.letter = data
    } else {
      const charCode = data.charCodeAt(0);
      if ((charCode >= "A".charCodeAt(0) && charCode <= "Z".charCodeAt(0)) || 
          (charCode >= "a".charCodeAt(0) && charCode <= "z".charCodeAt(0))) {
            this.letter = data.toUpperCase()
      } else {
        this.letter = data
      }
    }
  }

  public toString(): string {
    var jsonObj = {}
    jsonObj["letter"] = this.letter
    jsonObj["classes"] = this.cssClasses.toHtmlClassList()
    jsonObj["black"] = this.isBlack()
    return JSON.stringify(jsonObj)
  }

  public isWritable() {
    return !this.isBlack() && !this.staticText
  }

  public setStaticText(data: string) {
    // staticText is immutable.
    if (!this.staticText) {
      this.staticText = data
    }
  }

  public toHtml(): string {
    let content = ""
    content += "<div class='num'>" + this.number + "</div>"
    if (this.letter) {
      content += "<div class='letter'>" + this.letter + "</div>"
    } else if (this.staticText) {
      content += "<div class='subst'>" + this.staticText + "</div>"
    }
    return content
  }

  public getIdForHtml() {
    var [row, col] = this.tableLocation
    return row + "-" + col
  }

  public getStaticText() {
    return this.staticText
  }

  /* wordIsFilled will return true if all squares in given array have a letter in them, false otherwise. */
  public static wordIsFilled(wordSquares: CrosswordSquare[]) {
    for (var square of wordSquares) {
      if (square.getLetter() == "" && !square.getStaticText()) {
        return false
      }
    }
    return true
  }
}
