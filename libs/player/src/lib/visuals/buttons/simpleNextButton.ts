import { GenericVisual } from '../../GenericVisual';

export class SimpleNextButton extends GenericVisual {
	protected _kind = 'SimpleNextButton';
	button: HTMLInputElement;

	constructor() {
		super();
    this.button = document.createElement('input');
    this.button.setAttribute('type', 'button');
    this.button.setAttribute('value', 'next');
    this.button.disabled = true;
    this.appendChild(this.button)
	}


	protected setEmitters() {
		this.button.addEventListener('click', () => {
		  console.log('On next')
		  this.playerHTML.next()
		});
	}
	protected setListeners() {
		this.playerHTML.addEventListener('newPlaylist', ()=>this.onPlaylist());
	}
	onPlaylist (){
		this.button.disabled = !(this.playerHTML.playlist.length > 0);
	}
}

customElements.define('rs-simple-next-button', SimpleNextButton);
