export class DOMHandler {
  private static showControls = true;
  private static puzzlesSolved = 0;

  private static controlsDiv: HTMLElement;
  private static scoreDiv: HTMLElement;

  static init() {
    this.controlsDiv = document.querySelector("#controls")!;
    this.scoreDiv = document.querySelector("#score")!;

    this.scoreDiv.innerText = `Puzzles Solved: ${this.puzzlesSolved}`;
  }

  static toggleControls() {
    this.showControls = !this.showControls;
    this.controlsDiv.style.visibility = this.showControls
      ? "visible"
      : "hidden";
  }

  static incrementScore() {
    this.puzzlesSolved += 1;
    this.scoreDiv.innerText = `Puzzles Solved: ${this.puzzlesSolved}`;
  }
}
