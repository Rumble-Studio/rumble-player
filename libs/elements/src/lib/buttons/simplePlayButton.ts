import { GenericVisual } from '../GenericVisual';

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
		this.playerHTML.addEventListener('newPlaylist', () => this.enable(1));
		this.playerHTML.addEventListener('play', () => this.disable());
		this.playerHTML.addEventListener('pause', () => this.enable(2));
		this.playerHTML.addEventListener('stop', () => this.enable(3));
	}

	disable() {
		this.button.disabled = true
	}
	enable(v) {
    this.button.disabled = !(this.playerHTML.playlist.length > 0);
	}
}

customElements.define('rs-simple-play-button', SimplePlayButton);
