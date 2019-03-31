export class Hint {
    private hintNumber: number
    private hint: string
    private answer: string
    private _isStrikedOut: boolean = false

    public getNumber(): number {
        return this.hintNumber
    }

    public setNumber(data: number) {
        this.hintNumber = data
    }

    public getHint(): string {
        return this.hint
    }

    public setHint(data: string) {
        this.hint = data
    }

    public getAnswer(): string {
        return this.answer
    }

    public setAnswer(data: string) {
        this.answer = data
    }

    public isStrikedOut() {
        return this._isStrikedOut
    }
    public setStrikedOut(data: boolean) {
        this._isStrikedOut = data
    }
}

export class HintBuilder {
    private _hint : Hint = new Hint()

    public setHint(hint: string): HintBuilder {
        this._hint.setHint(hint)
        return this
    }

    public setAnswer(answer: string): HintBuilder {
        this._hint.setAnswer(answer)
        return this
    }

    public setNumber(data: number): HintBuilder {
        this._hint.setNumber(data)
        return this
    }

    public build(): Hint {
        return this._hint
    }
}