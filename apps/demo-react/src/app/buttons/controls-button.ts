import { GenericVisual } from '@rumble-player/elements';
import style from './styles';

export enum Tasks {
	'play' = 'play',
	'pause' = 'pause',
	'stop' = 'stop',
	'next' = 'next',
	'prev' = 'prev',
}

export class ControlButton extends GenericVisual {
	protected _kind = 'DemoPlayButton';
	protected displayName = '';
	protected task: Tasks;

	constructor(name: string, task: Tasks) {
		super();
		this.displayName = name;
		this.task = task;
		this.createHTMLElements();
		console.log('display name', this.displayName);
		console.log(task);
	}
	/** custom HTML elements  */
	button: HTMLInputElement | undefined;
	protected createHTMLElements() {
		document.head.appendChild(style);
		this.button = document.createElement('input');
		this.button.setAttribute('type', 'button');
		this.button.setAttribute('id', 'playButton');
		this.button.setAttribute('class', 'rs-controls');
		this.button.setAttribute('value', this.displayName);
	}
	protected setInnerHTML() {
		// custom creation of HTML children
		if (this.button) {
			this.appendChild(this.button);
		}
	}
	protected bindHTMLElements() {
		// custom bindings of events
		// in particular, play button can emit "play" on click
		// Toggle button won't work unless we implement toggle feature at playerService level
		// if initial state is true and clicked while playing, nothing will happen

		this.addEventListener('click', () => {
			console.log('should ', this.task);
			const e = new Event(this.task);
			this.dispatchEvent(e);
		});
	}
	updateVisual() {
		//
	}
}
customElements.define('rs-demo-my-play-button', ControlButton);

export default { ControlButton, Tasks };
