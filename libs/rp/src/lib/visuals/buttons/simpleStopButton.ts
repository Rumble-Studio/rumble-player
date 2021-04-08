import { GenericVisual } from "../../GenericVisual";

export class SimpleStopButton extends GenericVisual {
  protected _kind = 'SimpleStopButton';


  constructor() {
    super();
  }

  /** custom HTML elements  */
  button: HTMLInputElement;
  protected createHTMLElements() {
    this.button = document.createElement('input');
    this.button.setAttribute('type', 'button');
    this.button.setAttribute('value', 'stop');
  }
  protected updateStyle() {
    super.updateStyle();
    this.shadowRoot.appendChild(this.button);
  }

  bindHTMLElements() {
    // custom bindings of events
    // in particular, play button can emit "play" on click
    this.addEventListener('click', () => {
      const e  = new Event('stop')
      this.dispatchEvent(e);
    });
  }

  updateVisual(){
    //
  }
}

customElements.define('rs-simple-stop-button', SimpleStopButton);
