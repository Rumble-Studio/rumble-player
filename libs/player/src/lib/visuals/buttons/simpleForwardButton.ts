import { GenericVisual } from '../../GenericVisual';

export class SimpleForwardButton extends GenericVisual {
	protected _kind = 'SimpleForwardButton';
	button: HTMLInputElement;
	private jump: number;

	constructor(jump = 15) {
		super(); // true to delay HTML logic and let jump be set
		this.jump = jump;
		this.createHTMLElements();
		this.setEmitters();
	}

	protected createHTMLElements() {
		this.button = document.createElement('input');
		this.button.setAttribute('type', 'button');
		this.button.setAttribute('value', 'forward(' + this.jump + 's)');
		this.button.disabled = true;
    this.appendChild(this.button)
	}

	protected setEmitters() {
		this.button.addEventListener('click', () => {
			const e = new CustomEvent('seekPerPosition', {
				detail: { jump: this.jump },
			});
			this.playerHTML.seekForJump(e);
		});
	}
	protected setListeners() {
		this.playerHTML.addEventListener('newPlaylist', ()=>this.onPlaylist());
	}
	onPlaylist (){
		this.button.disabled = !(this.playerHTML.playlist.length > 0);
	}
}

customElements.define('rs-simple-forward-button', SimpleForwardButton);
