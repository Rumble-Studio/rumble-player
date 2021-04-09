import { GenericVisual } from '../../GenericVisual';
import { playerServiceEvent } from '../../playerService';

export class SimplePauseButton extends GenericVisual {
	protected _kind = 'SimplePauseButton';
	button: HTMLInputElement;

	constructor() {
		super();
	}

	protected createHTMLElements() {
		this.button = document.createElement('input');
		this.button.setAttribute('type', 'button');
		this.button.setAttribute('value', 'pause');
    this.button.disabled = true
		this.list_of_children = [this.button];
	}

	protected bindHTMLElements() {
		this.button.addEventListener('click', () => {
			const e = new Event('pause');
			this.dispatchEvent(e);
		});
	}
  protected updateState(state:playerServiceEvent) {
    super.updateState(state);
    if (state.type === 'play'){
      this.button.disabled = false
    }
    else if (state.type === 'pause' || state.type === 'stop'){
      this.button.disabled = true
    }
  }
}

customElements.define('rs-simple-pause-button', SimplePauseButton);
