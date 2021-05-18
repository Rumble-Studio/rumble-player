import { GenericVisual } from '../GenericVisual';

export class SimplePauseButton extends GenericVisual {
	protected _kind = 'SimplePauseButton';
	button: HTMLInputElement;

	constructor() {
    super();
    this.button = document.createElement('input');
    this.button.setAttribute('type', 'button');
    this.button.setAttribute('value', 'pause');
    this.button.disabled = true;
    this.appendChild(this.button);
  }

	protected setEmitters() {
		this.button.addEventListener('click', () => {
			this.playerHTML.pause({});
		});
	}

	protected setListeners() {
		this.playerHTML.addEventListener('play', ()=>this.disable());
		this.playerHTML.addEventListener('pause', ()=>this.enable());
		this.playerHTML.addEventListener('stop', ()=>this.enable());
	}
	disable () {

		this.button.disabled = false;
	}
	enable (){
		this.button.disabled = true;
	}
}

customElements.define('rs-simple-pause-button', SimplePauseButton);
