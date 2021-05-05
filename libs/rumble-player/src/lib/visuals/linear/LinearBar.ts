import { GenericVisual } from '../../GenericVisual';
import { playerServiceEvent, RumblePlayerService } from '../../playerService';

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
		this.progressDiv = document.createElement('div');
		this.progressDiv.setAttribute('id', 'progressBar');
		this.div.appendChild(this.progressDiv);
		this.list_of_children = [style, this.div];
	}

	protected setEmitters() {
		this.addEventListener('click', (event) => {
			const bcr = this.getBoundingClientRect();
			const percentage = (event.clientX - bcr.left) / bcr.width;
			const clickEvent = new CustomEvent('seekPerPercentage', {
				detail: { percentage },
			});
			this.playerHTML.processEventSeekPerPercentage(clickEvent);
		});
	}

	protected setListeners() {
		this.playerHTML.addEventListener('positionUpdate', this.updateVisual);
		this.playerHTML.addEventListener('seek', this.updateVisual);
	}

	updateVisual = (payload) => {
		if (payload) {
			this.percentage = payload.detail.percentage;
		}
		this._shadow.querySelector('style').textContent = this.generateStyle(
			this.percentage
		);
	};

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
			background-color: white;
			opacity:0.5
		}`;
	}
}

customElements.define('rs-linear-bar', LinearBar);
