import { RumblePlayer } from './player';

export class GenericSeekbar extends HTMLElement {
	private position: number;
	private bar: LinearBar;
	private totalDuration: number;
	private positionBuffer: number;
	private isPlaying: boolean;

	constructor() {
		super();
	}

	connectedCallback() {
		this.setInnerHTML();
	}

	private setInnerHTML() {
		this.bar = new LinearBar();
		this.appendChild(this.bar);
	}

	seek(position: number): void {
		this.position = position;
		const event = new CustomEvent('seek', { detail: { position } });
		this.dispatchEvent(event);
		console.log('seeked position: ', position);
	}
}

export class LinearBar extends HTMLElement {
	private div: HTMLDivElement;
	constructor() {
		super();
	}
	connectedCallback() {
		this.setInnerHTML();
	}

	private setInnerHTML() {
		this.div = document.createElement('div');
		this.appendChild(this.div);
		this.updateStyle();
	}
	updateStyle() {
		this.div.style.marginTop = '10px';
		this.div.style.width = '300px';
		this.div.style.height = '3px';
		this.div.style.backgroundColor = 'black';
	}
}

class LinearSeekBar extends GenericSeekbar {
	// TODO: Utiliser la classe CircularHandle et RectangleBar
	// Bar properties
	private barThickness: number;
	private barColor: string;
	// Handle properties
	private handleRadius: number;
	private handleColor: string;

	constructor() {
		super();
	}
}

class GenericHandle extends HTMLElement {
	private handleHTML: HTMLElement;
	constructor() {
		super();
	}
	connectedCallback() {
		this.setInnerHTML();
	}
	private setInnerHTML() {
		this.handleHTML = document.createElement('div');
		this.appendChild(this.handleHTML);
		this.updateStyle();
	}
	updateStyle() {
		this.handleHTML.style.width = '20px';
		this.handleHTML.style.height = '20px';
		this.handleHTML.style.backgroundColor = 'black';
	}
}
class CircularHandle {}
class GenericBar {}

class FunkyHandle {}
class FunkyBar {}

customElements.define('rs-seekbar', GenericSeekbar);
customElements.define('rs-linearbar', LinearBar);
