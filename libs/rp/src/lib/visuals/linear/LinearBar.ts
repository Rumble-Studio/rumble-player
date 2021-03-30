import { GenericVisual } from '../../GenericVisual';

export class LinearBar extends GenericVisual {
	protected _kind = 'LinearBar';

	div: HTMLDivElement;
	progressDiv: HTMLDivElement;

	constructor() {
		super();
	}

	protected createHTMLElements() {
		this.div = document.createElement('div');
		this.div.style.backgroundColor = 'red';
		this.div.style.height = '15px';
		this.progressDiv = document.createElement('div');
		this.progressDiv.style.width = '0%';
		this.progressDiv.style.height = '100%';
		this.progressDiv.style.backgroundColor = 'blue';
		this.div.style.cursor = 'pointer';
	}
	protected setInnerHTML() {
		this.div.appendChild(this.progressDiv);
		this.appendChild(this.div);
	}

	bindHTMLElements() {
		// custom bindings of events
		// in particular, a click emits a percentage based on width
		this.addEventListener('click', (event) => {

			const bcr = this.getBoundingClientRect();
			const percentage = (event.clientX - bcr.left) / bcr.width


			console.log('PERCENTAGE;',percentage)

			const clickEvent = new CustomEvent('seekPerPercentage', {
				detail: { percentage },
			});
			this.dispatchEvent(clickEvent);
		});
	}

	updateVisual() {
		this.progressDiv.style.width = 100*this.percentage + '%';
	}
}

customElements.define('rs-linear-bar', LinearBar);
