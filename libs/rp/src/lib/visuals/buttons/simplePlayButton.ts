import { GenericVisual } from '../../GenericVisual';
import { playerServiceEvent } from '../../playerService';

export class SimplePlayButton extends GenericVisual {
	protected _kind = 'SimplePlayButton';
	button: HTMLInputElement;
	index: number;

	constructor(index = 0) {
		super();
		this.index = index;
	}

	protected createHTMLElements() {
		this.button = document.createElement('input');
		this.button.setAttribute('type', 'button');
		this.button.setAttribute('value', 'play');
		this.list_of_children = [this.button];
	}

	protected bindHTMLElements() {
		this.button.addEventListener('click', () => {
			this.playerService.play(this.index);
		});
	}
	protected updateState(state: playerServiceEvent) {
		super.updateState(state);
		if (state.type === 'play') {
			this.button.disabled = true;
		} else if (state.type === 'pause' || state.type === 'stop') {
			this.button.disabled = false;
		}
	}
}

customElements.define('rs-simple-play-button', SimplePlayButton);
