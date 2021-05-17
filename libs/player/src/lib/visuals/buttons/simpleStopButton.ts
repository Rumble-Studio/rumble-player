import { GenericVisual } from '../../GenericVisual';

export class SimpleStopButton extends GenericVisual {
	protected _kind = 'SimpleStopButton';
	button: HTMLInputElement;

	constructor() {
		super();
    this.button = document.createElement('input');
    this.button.setAttribute('type', 'button');
    this.button.setAttribute('value', 'stop');
    this.button.disabled = true;
    this.appendChild(this.button)
	}


	protected setEmitters() {
		this.button.addEventListener('click', () => {
			this.playerHTML.stop();
		});
	}
	protected setListeners() {
		this.playerHTML.addEventListener('play', ()=>this.disable());
		this.playerHTML.addEventListener('stop', ()=>this.enable());
	}
	disable (){
		this.button.disabled = false;
	}
	enable () {
		this.button.disabled = true;
	}
}

customElements.define('rs-simple-stop-button', SimpleStopButton);
