import { RumblePlayer } from './player';

export class GenericSeekbar extends HTMLElement {
	private position: number;
	protected bar: GenericBar;
	protected totalDuration: number;
	private positionBuffer: number;
	private isPlaying: boolean;

	constructor() {
		super();
	}

	setTotalDuration(duration: number) {
		this.totalDuration = duration;
		console.log('New song duration is: ', duration);
	}
	seek(position: number): void {
		this.position = position;
		const event = new CustomEvent('seek', { detail: { position } });
		this.dispatchEvent(event);
		console.log('seeked position: ', position);
	}
}
export class LinearSeekBar extends GenericSeekbar {
	// TODO: Utiliser la classe CircularHandle et RectangleBar
	// Bar properties
	private barThickness: number;
	private barColor: string;
	protected bar: LinearBar;
	// Handle properties
	private handleRadius: number;
	private handleColor: string;

	constructor(barThickness?: number, barColor?: string, duration?: number) {
		super();
		this.barThickness = barThickness ? barThickness : 3;
		this.barColor = barColor ? barColor : 'black';
		this.totalDuration = duration ? duration : 0;
		this.bar = new LinearBar(this.barThickness, this.barColor);
		this.bar.addEventListener('seekTo', (evt: CustomEvent) => {
			console.log('total duration is ', this.totalDuration);
			super.seek((evt.detail.percentage * this.totalDuration) / 100);
		});
	}
	connectedCallback() {
		this.setInnerHTML();
	}

	private setInnerHTML() {
		this.appendChild(this.bar);
	}
	setBarProgression(value: number) {
		this.bar.progress = (100 * value) / this.totalDuration;
	}
}

class GenericBar extends HTMLElement {
	protected barThickness: number;
	protected barColor: string;
	constructor(barThickness: number, barColor: string) {
		super();
		this.barThickness = barThickness;
		this.barColor = barColor;
	}
	protected seek(percentage: number) {
		console.log(percentage);
		const e = new CustomEvent('seekTo', { detail: { percentage } });
		this.dispatchEvent(e);
	}
}
export class LinearBar extends GenericBar {
	private div: HTMLDivElement;
	private progressDiv: HTMLDivElement;
	private _progress: number;
	get progress() {
		return this._progress;
	}
	set progress(value: number) {
		this.progressDiv.style.width = value.toString() + '%';
	}
	constructor(barThickness: number, barColor: string) {
		super(barThickness, barColor);
	}
	connectedCallback() {
		this.setInnerHTML();
		this.progress = 0;
	}

	private setInnerHTML() {
		this.div = document.createElement('div');
		this.progressDiv = document.createElement('div');
		this.progressDiv.style.height = '100%';
		this.progressDiv.style.backgroundColor = 'red';
		this.div.appendChild(this.progressDiv);
		this.appendChild(this.div);
		this.updateStyle();
	}

	private clickCallback(event: MouseEvent) {
		const width = this.div.offsetWidth;
		const x = event.offsetX < 0 ? 0 : event.offsetX; // Get the horizontal coordinate
		const percentage = (100 * x) / width;
		super.seek(percentage);
		this.progress = percentage;
	}

	updateStyle() {
		this.div.style.marginTop = '10px';
		this.div.style.width = '300px';
		this.div.style.height = this.barThickness.toString() + 'px';
		this.div.style.backgroundColor = this.barColor;
		this.div.onclick = (e) => {
			this.clickCallback(e);
		};
	}
}

class FunkyBar {}

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
class FunkyHandle {}

customElements.define('rs-generic-seekbar', GenericSeekbar);
customElements.define('rs-linear-seekbar', LinearSeekBar);
customElements.define('rs-linearbar', LinearBar);
customElements.define('rs-genericbar', GenericBar);
