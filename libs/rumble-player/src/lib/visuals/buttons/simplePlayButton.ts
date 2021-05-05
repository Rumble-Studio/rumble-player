import { GenericVisual } from '../../GenericVisual';

export class SimplePlayButton extends GenericVisual {
	button: HTMLInputElement;
	index: number;

	constructor(index = -2) {
		super();
		this.index = index;

		this.button = document.createElement('input');
		this.button.setAttribute('type', 'button');
		this.button.setAttribute('value', 'play');

		this.appendChild(this.button);
	}

	protected setEmitters() {
		console.log('SET EMITTERS');

		this.button.addEventListener('click', () => {
			this.playerHTML.play({ index: this.index });
		});
	}

	protected setListeners() {
		console.log('SET LISTENERS');
		this.playerHTML.addEventListener('newPlaylist', () => this.enable());
		this.playerHTML.addEventListener('play', () => this.disable());
		this.playerHTML.addEventListener('pause', () => this.enable());
		this.playerHTML.addEventListener('stop', () => this.enable());
	}

	disable() {
		this.button.setAttribute('disabled', 'true');
	}
	enable() {
		if (this.playerHTML.playlist.length == 0) {
			this.disable();
			return;
		}
		this.button.removeAttribute('disabled');
	}
}

customElements.define('rs-simple-play-button', SimplePlayButton);
