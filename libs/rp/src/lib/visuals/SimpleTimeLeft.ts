import { GenericVisual } from '@rumble-player/rp';

export class SimpleTimeLeft extends GenericVisual {
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
		const position = this.playerService.position;
		const duration = this.playerService.playlist[
			this.playerService.index
		].howl.duration();
		this.time.innerText =
			'Time Left : ' + Math.round(duration - position).toString();
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

customElements.define('rs-simple-time-left', SimpleTimeLeft);
