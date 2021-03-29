import { GenericVisual } from '../generic/GenericVisual';

export class PercentageBar extends GenericVisual {
	protected _kind = 'percentageBar';


	div: HTMLDivElement;
	p: HTMLParagraphElement;
	playButton: HTMLButtonElement;

	constructor() {
		super();
	}

	protected createHTMLElements() {
		// for percentageBar we only have a "p" element

		console.log('Create percentage elements');

		this.div = document.createElement('div');
		this.playButton = document.createElement('button');
		this.playButton.innerText = 'PERCENTAGE BAR BTN';
		this.p = document.createElement('p');
		this.p.innerText = 'blabla';
	}
	protected setInnerHTML() {
		console.log('setInnerHTML percentage ');
		this.appendChild(this.div);
		this.div.appendChild(this.playButton);
		this.playButton.appendChild(this.p);
		this.updateVisual();
	}
	updateVisual() {
		console.log('updatevisual percentage ');

		// for percentageBar the visual shows the percentage
		this.p.innerText = Math.round(this.percentage * 100) / 100 + '%';
	}
	bindHTMLElements() {
		this.addEventListener('click', () => {
			console.log('Clicked on percentage visual !');
		});
	}
}
customElements.define('rs-percentage-bar', PercentageBar);
