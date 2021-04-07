import { GenericVisual } from "../../GenericVisual";

export class SimpleBackwardButton extends GenericVisual {
  protected _kind = 'SimpleBackwardButton';
  private jump: number;


  constructor(jump?:number) {
    super();
    this.jump = jump ? jump : 15
  }

  /** custom HTML elements  */
  button: HTMLInputElement;
  protected createHTMLElements() {
    this.button = document.createElement('input');
    this.button.setAttribute('type', 'button');
    this.button.setAttribute('value', 'backward');
  }
  protected setInnerHTML() {
    // custom creation of HTML children
    this.appendChild(this.button);
  }

  bindHTMLElements() {
    // custom bindings of events
    // in particular, play button can emit "play" on click
    this.addEventListener('click', () => {
      const e  = new CustomEvent('seekPerPosition',{detail:{jump:-this.jump}})
      this.dispatchEvent(e);
    });
  }

  updateVisual(){
    //
  }
}

customElements.define('rs-simple-backward-button', SimpleBackwardButton);
