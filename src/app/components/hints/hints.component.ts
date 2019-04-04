import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { Hint, HintBuilder } from 'src/app/models/crosswordHint.type';
import { HtmlHelperService } from 'src/app/services/html-helper.service';

const HIGHLIGHT_HINT_BACKGROUND = "#D3D3D3"
const HINTS_MAIN_ID = "hints-main"

@Component({
  selector: 'app-hints',
  templateUrl: './hints.component.html',
  styleUrls: ['./hints.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HintsComponent implements OnInit {
  @Output() hintForMobile = new EventEmitter<string>();
  @Output() clickedHint = new EventEmitter<number>();
  public label: string
  public hintData: Map<number, Hint> = new Map()
  private focusedHint: Hint

  constructor(private htmlHelper: HtmlHelperService) { }

  ngOnInit() {}

  public setLabel(label: string): void {
    this.label = label
  }

  public getHintData() {
    return this.hintData
  }

  public clearHighlightedHints() {
    this.hintData.forEach((hint) => {
      var elem = document.getElementById(this.getIdForHtml(hint))
      elem.style.backgroundColor = ""
    })
  }

  public setFocusedHint(hintNumber: number, scroll: boolean = true) {
    this.clearHighlightedHints()
    this.focusedHint = this.hintData.get(hintNumber)

    // Highlight and scroll to hint in list.
    var hintElemId = this.getIdForHtml(this.focusedHint)
    var hintElem = document.getElementById(hintElemId)
    var hintsContainer = document.getElementById(HINTS_MAIN_ID)
    hintElem.style.backgroundColor = HIGHLIGHT_HINT_BACKGROUND
    if (scroll) {
      hintsContainer.scrollTop = hintElem.offsetTop
    }
    if (this.htmlHelper.isMobile()) {
      this.hintForMobile.emit(this.getFocusedHint())
    }
  }

  public getFocusedHint(): string {
    if (this.focusedHint) {
      return this.focusedHint.getNumber() + ". " + this.focusedHint.getHint()
    }
  }

  private getEndOfHint(hint: string): number {
    return hint.indexOf(" : ")
  }

  private getStartOfAnswer(hint: string): number {
    return hint.indexOf(" : ") + 3
  }

  private getHintObjectFromString(hint_number: number, hint_answer: string): Hint {
    var hint = hint_answer.substring(0, this.getEndOfHint(hint_answer))
    var answer = hint_answer.substring(this.getStartOfAnswer(hint_answer), hint_answer.length)
    return new HintBuilder().setHint(hint).setAnswer(answer).setNumber(hint_number).build()
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
    var allHints = data.getElementsByClassName("numclue")[0]
    if (!allHints) {
      console.log("something went wrong in hints populate")
      return
    }
    var split_hints = Array.prototype.slice.call(allHints.getElementsByTagName("div"))
    for (var i = 0; i < split_hints.length; i = i + 2) {
      var hint_number = Number(split_hints[i].textContent)
      this.hintData.set(hint_number, this.getHintObjectFromString(hint_number, split_hints[i + 1].textContent))
    }
  }
}
