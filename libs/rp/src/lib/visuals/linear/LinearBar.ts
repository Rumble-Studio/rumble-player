import { GenericVisual } from '../../GenericVisual';

export class LinearBar extends GenericVisual {
	protected _kind = 'LinearBar';

	div: HTMLDivElement = document.createElement('div');
	progressDiv: HTMLDivElement = document.createElement('div');
	percentage: number;

	constructor() {
		super();
	}

	protected createHTMLElements() {

		const style = document.createElement('style');

		this.div = document.createElement('div');
		this.div.setAttribute('id', 'bar');

		// this.div.style.backgroundColor = 'red';
		// this.div.style.height = '15px';
		// this.div.style.position = 'relative';
		// this.div.style.cursor = 'pointer';

		this.progressDiv = document.createElement('div');
		// this.progressDiv.style.width = '10px';
		// this.progressDiv.style.height = '20px';
		// this.progressDiv.style.backgroundColor = 'orange';
		this.progressDiv.setAttribute('id', 'progressBar');

		this.div.appendChild(this.progressDiv);
		this.list_of_children = [style, this.div];
	}

	protected bindHTMLElements() {
		this.addEventListener('click', (event) => {
			const bcr = this.getBoundingClientRect();
			const percentage = (event.clientX - bcr.left) / bcr.width;
			const clickEvent = new CustomEvent('seekPerPercentage', {
				detail: { percentage },
			});
			this.dispatchEvent(clickEvent);
		});
	}

	updateVisual() {
		this._shadow.querySelector('style').textContent = this.generateStyle(
			this.percentage
		);
		// this.progressDiv.style.width = 100 * this.percentage + 'px';
	}

	generateStyle(percentage: number) {
		return `
		#bar{
			height:15px;
			position:relative;
			background-color: red;
			cursor:pointer;
		}
		#progressBar {
			width: ${100 * percentage}%;
			height: 100%;
			background-color: blue;
		}
`;
	}
}

customElements.define('rs-linear-bar', LinearBar);