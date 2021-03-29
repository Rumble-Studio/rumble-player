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
		this.div = document.createElement('div');
		this.playButton = document.createElement('button');
		this.playButton.innerText = 'PERCENTAGE BAR BTN';
		this.p = document.createElement('p');
		this.p.innerText = 'blabla';
	}

	protected setInnerHTML() {
		this.div.appendChild(this.playButton);
		this.playButton.appendChild(this.p);
		this.appendChild(this.div);
		this.updateVisual();
	}

	// protected bindHTMLElements() {
	// 	this.addEventListener('click', () => {
	// 		console.log('Clicked on percentage visual !');
	// 	});
	// }


	updateVisual() {
		console.log('SHOULD UPDATE ('+this.kind+') BAR WITH:',this.percentage)
		this.p.innerText = Math.round(this.percentage * 100) / 100 + '%';
	}
}
customElements.define('rs-percentage-bar', PercentageBar);
