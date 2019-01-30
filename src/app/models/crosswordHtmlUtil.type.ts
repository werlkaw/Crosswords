export class CssClasses {
    private classes: string[] = []

    public getClasses() {
        return this.classes
    }

    public addClass(data: string) {
        if (this.classes.indexOf(data) == -1) {
          this.classes.push(data)
        }
    }

    /* toHtmlClassList joins list of classes to HTML-ready space-separated string with classes. */
    public toHtmlClassList(): string {
        return this.classes.join(" ")
    }

    public removeClass(data: string) {
        let selected_word_index = this.classes.indexOf(data)
        if (selected_word_index > -1) {
          this.classes.splice(selected_word_index, 1)
        }
    }
}