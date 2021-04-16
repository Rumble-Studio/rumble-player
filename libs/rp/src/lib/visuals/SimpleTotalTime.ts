import { GenericVisual } from '@rumble-player/rp';

export class SimpleTotalTime extends GenericVisual {
	private totalDuration = 0;
	private timeLeft = 0;
	private time: HTMLParagraphElement;

	constructor() {
		super();
	}

	protected createHTMLElements() {
		super.createHTMLElements();
		this.timeLeft = this.timeLeft ? this.timeLeft : 0;
		const wrapper = document.createElement('div');
		wrapper.setAttribute('id', 'wrapper');
		this.time = document.createElement('p');
		this.time.innerText = this.timeLeft.toString();
		const style = document.createElement('style');
		wrapper.appendChild(this.time);
		this.list_of_children = [style, wrapper];
	}

	protected bindHTMLElements() {
		super.bindHTMLElements();
	}

	protected updateVisual() {
		super.updateVisual();
		const duration = this.playerService.getSongTotalTime()
		this.time.innerText = 'Total Time : ' + Math.round(duration).toString();
		this._shadow.querySelector('style').textContent = this.generateStyle();
	}
	generateStyle() {
		return `
		#wrapper{
			width: fit-content;
		}
`;
	}
}

customElements.define('rs-simple-total-time', SimpleTotalTime);
