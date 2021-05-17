import { GenericVisual } from '../GenericVisual';

export class SimpleTimeSpent extends GenericVisual {
	private totalDuration = 0;
	private timeLeft = 0;
	private time: HTMLParagraphElement;

	constructor() {
		super();
	}

	protected createHTMLElements() {
		this.timeLeft = this.timeLeft ? this.timeLeft : 0;
		const wrapper = document.createElement('div');
		wrapper.setAttribute('id', 'wrapper');
		this.time = document.createElement('p');
		this.time.innerText = this.timeLeft.toString();
		const style = document.createElement('style');
		wrapper.appendChild(this.time);
		//this.list_of_children = [style, wrapper];
	}

	protected setEmitters() {
		super.setEmitters();
	}

	protected setListeners() {
		this.playerHTML.addEventListener('positionUpdate', this.updateVisual);
	}

	protected updateVisual = () => {
		if (this.time) {
			const position = this.playerHTML.position;
			this.time.innerText =
				position >= 0
					? 'Time Spent : ' + Math.round(position).toString()
					: 'Time Spent : N/A';
			//this._shadow.querySelector('style').textContent = this.generateStyle();
		}
	};
	generateStyle() {
		return `
		#wrapper{
			width: fit-content;
		}
`;
	}
}

customElements.define('rs-simple-time-spent', SimpleTimeSpent);
