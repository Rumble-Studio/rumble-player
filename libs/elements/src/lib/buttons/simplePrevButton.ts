import { GenericVisual } from '../GenericVisual';

export class SimplePrevButton extends GenericVisual {
	protected _kind = 'SimplePrevButton';
	button: HTMLInputElement;

	constructor() {
		super();
    this.button = document.createElement('input');
    this.button.setAttribute('type', 'button');
    this.button.setAttribute('value', 'prev');
    this.button.disabled = true;

    this.appendChild(this.button)
	}

	protected setEmitters() {
		this.button.addEventListener('click', () => {
			this.playerHTML.prev();
		});
	}

	protected setListeners() {
		this.playerHTML.addEventListener('newPlaylist', ()=>this.onPlaylist());
	}
	onPlaylist (){
		this.button.disabled = !(this.playerHTML.playlist.length > 0);
	}
}

customElements.define('rs-simple-prev-button', SimplePrevButton);
