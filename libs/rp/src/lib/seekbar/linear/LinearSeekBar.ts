import { GenericSeekbar } from '../generic/GenericSeekBar';
import { LinearBar } from '../linear/LinearBar';
import { LinearHandle } from '../linear/LinearHandle';

export class LinearSeekBar extends GenericSeekbar {
	protected _kind = 'linearSeekBar';

	constructor() {
		super();
	}

	protected fillVisuals() {
		const linearBar = new LinearBar();
		const linearHandle = new LinearHandle();
		const newVisuals = [linearBar, linearHandle];
		this.changeVisuals(newVisuals);
	}
	protected setInnerHTML() {
		this.onclick = (event: MouseEvent) => {
			console.log('%cClicked ', 'color:red');
			this.clickCallback(event);
		};

		this.onmousedown = (e) => {
			console.log('Mouse down');
			e.preventDefault();
			// get the mouse cursor position at startup:
			let x = e.clientX;
			let y = e.clientY;

			// call a function whenever the cursor moves:
			document.onmousemove = (e) => {
				e.preventDefault();
				x = e.clientX;
				y = e.clientY;
				// set the element's new position:

				let pos = (100 * e.clientX) / this.clientWidth;
				pos = pos <= 100 ? pos : 100;
				this.percentage = pos;
				console.log('slide percentage', pos);
			};
			document.onmouseup = () => {
				// stop moving when mouse button is released:
				document.onmouseup = null;
				document.onmousemove = null;
			};
		};
		super.setInnerHTML();
	}
	private clickCallback(event: MouseEvent) {
		const width = this.offsetWidth;
		const x = event.offsetX < 0 ? 0 : event.offsetX; // Get the horizontal coordinate
		const y = event.offsetY < 0 ? 0 : event.offsetY; // Get the vertical coordinate
		const percentage = (100 * x) / width;
		console.log('Click ', percentage);
		super.emitPercentage(percentage);
		//const clickEvent = new CustomEvent('seekPerPercentage', { detail: { percentage } });
		//this.dispatchEvent(clickEvent);
	}
}

customElements.define('rs-linear-seekbar', LinearSeekBar);
