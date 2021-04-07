import { GenericVisual } from "../../GenericVisual";

export class SimplePrevButton extends GenericVisual {
  protected _kind = 'SimplePrevButton';


  constructor() {
    super();
  }

  /** custom HTML elements  */
  button: HTMLInputElement;
  protected createHTMLElements() {
    this.button = document.createElement('input');
    this.button.setAttribute('type', 'button');
    this.button.setAttribute('value', 'prev');
  }
  protected setInnerHTML() {
    // custom creation of HTML children
    this.appendChild(this.button);
  }

  bindHTMLElements() {
    // custom bindings of events
    // in particular, play button can emit "play" on click
    this.addEventListener('click', () => {
      const e  = new Event('prev')
      this.dispatchEvent(e);
    });
  }

  updateVisual(){
    //
  }
}

customElements.define('rs-simple-prev-button', SimplePrevButton);
