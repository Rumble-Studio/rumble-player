import { GenericVisual } from "../../GenericVisual";

export class SimpleNextButton extends GenericVisual {
  protected _kind = 'SimpleNextButton';


  constructor() {
    super();
  }

  /** custom HTML elements  */
  button: HTMLInputElement;
  protected createHTMLElements() {
    this.button = document.createElement('input');
    this.button.setAttribute('type', 'button');
    this.button.setAttribute('value', 'next');
  }
  protected updateStyle() {
    super.updateStyle();
    this.shadowRoot.appendChild(this.button);
  }

  bindHTMLElements() {
    // custom bindings of events
    // in particular, play button can emit "play" on click
    this.addEventListener('click', () => {
      const e  = new Event('next')
      this.dispatchEvent(e);
    });
  }

  updateVisual(){
    //
  }
}

customElements.define('rs-simple-next-button', SimpleNextButton);
