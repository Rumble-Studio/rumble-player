import { GenericVisual } from '../../GenericVisual';

export class LinearBar extends GenericVisual {
	protected _kind = 'LinearBar';

	div: HTMLDivElement = document.createElement('div');
	progressDiv: HTMLDivElement = document.createElement('div');
	percentage: number;

	constructor() {
		super();
		console.log('LINEAR BAR CONSTRUCTOR CALLED')
		this.createHTMLElements();
		this.setInnerHTML();
	}

	protected createHTMLElements() {
		console.log('%cLINEAR BAR createHTMLElements CALLED','color:red')

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

	protected bindHTMLElements() {
		// custom bindings of events
		// in particular, a click emits a percentage based on width
		this.addEventListener('click', (event) => {
			const bcr = this.getBoundingClientRect();
			const percentage = (event.clientX - bcr.left) / bcr.width;

			console.log('PERCENTAGE;', percentage);

			const clickEvent = new CustomEvent('seekPerPercentage', {
				detail: { percentage },
			});
			this.dispatchEvent(clickEvent);
		});
	}

	updateVisual() {
		this.progressDiv.style.width = 100 * this.percentage + '%';
	}
}

customElements.define('rs-linear-bar', LinearBar);
