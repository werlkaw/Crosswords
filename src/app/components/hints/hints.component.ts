import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Hint, HintBuilder } from 'src/app/models/crosswordHint.type';

@Component({
  selector: 'app-hints',
  templateUrl: './hints.component.html',
  styleUrls: ['./hints.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HintsComponent implements OnInit {
  public label: string
  public hintData: Map<number, Hint>
  private focusedHint: Hint
  constructor() { }

  ngOnInit() {}

  public setLabel(label: string): void {
    this.label = label
  }

  public getHintData() {
    return this.hintData
  }

  public setFocusedHint(hintNumber: number) {
    this.focusedHint = this.hintData.get(hintNumber)
  }

  public getFocusedHint(): string {
    if (this.focusedHint) {
      return this.focusedHint.getNumber() + ". " + this.focusedHint.getHint()
    }
  }

  private getNumberFromHint(hint: string): number {
    try {
      return Number(hint.substr(0, hint.indexOf(".")))
    } catch(e) {
      console.log("Bad hint input")
      return -1
    }
  }

  private getEndOfNumber(hint: string): number {
    return hint.indexOf(". ")
  }

  private getStartOfHint(hint: string): number {
    return hint.indexOf(". ") + 2
  }

  private getEndOfHint(hint: string): number {
    return hint.indexOf(" : ")
  }

  private getStartOfAnswer(hint: string): number {
    return hint.indexOf(" : ") + 3
  }

  private getHintObjectFromString(hint_answer: string): Hint {
    var hint = hint_answer.substring(this.getStartOfHint(hint_answer), this.getEndOfHint(hint_answer))
    var answer = hint_answer.substring(this.getStartOfAnswer(hint_answer), hint_answer.length)
    var num = +hint_answer.substring(0, this.getEndOfNumber(hint_answer))
    return new HintBuilder().setHint(hint).setAnswer(answer).setNumber(num).build()
  }

  public getSnapshotForDatabase() {
    var strikedHints = {}
    this.hintData.forEach((value: Hint, key: number) => {
      strikedHints[key.toString()] = value.isStrikedOut()
    })
    return strikedHints
  }

  public updateFromDatabase(strikedHints) {
    var hintElem
    this.hintData.forEach((value: Hint, key: number) => {
      value.setStrikedOut(strikedHints[key.toString()])
      hintElem = document.getElementById(this.getIdForHtml(value))
      if (strikedHints[key.toString()]) {
        hintElem.classList.add('striked')
      } else {
        hintElem.classList.remove('striked')
      }
    })
  }

  private getIdForHtml(hint: Hint) {
    return this.label.substr(0, 1) + hint.getNumber().toString()
  }

  populate(data: Document) {
    this.hintData = new Map()
    this.focusedHint = null
    var all_hints = data.getElementsByTagName("div")[2]
    var split_hints = Array.prototype.slice.call(all_hints.getElementsByTagName("div"))
    for (var hint of split_hints) {
      this.hintData.set(this.getNumberFromHint(hint.innerHTML), this.getHintObjectFromString(hint.innerHTML))
    }
  }
}
