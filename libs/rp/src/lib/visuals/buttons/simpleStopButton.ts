import { GenericVisual } from '../../GenericVisual';
import { playerServiceEvent } from '../../playerService';

export class SimpleStopButton extends GenericVisual {
	protected _kind = 'SimpleStopButton';
	button: HTMLInputElement;

	constructor() {
		super();
	}

	protected createHTMLElements() {
		this.button = document.createElement('input');
		this.button.setAttribute('type', 'button');
		this.button.setAttribute('value', 'stop');
    this.button.disabled = true
    this.list_of_children = [this.button];
	}

	protected bindHTMLElements() {
		this._playerService.stop()
	}
  protected updateState(state:playerServiceEvent) {
    super.updateState(state);
    if (state.type === 'play'){
      this.button.disabled = false
    }
    else if ( state.type === 'stop'){
      console.log('STATE STOPPED')
      this.button.disabled = true
    }
  }
}

customElements.define('rs-simple-stop-button', SimpleStopButton);
