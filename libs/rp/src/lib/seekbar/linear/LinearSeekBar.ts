import { GenericSeekbar } from '../generic/GenericSeekBar';
import { LinearBar } from '../linear/LinearBar';
import { LinearHandle } from '../linear/LinearHandle';

export class LinearSeekBar extends GenericSeekbar {
	protected _kind = 'linearSeekBar';
	get kind() {
		return this._kind;
	}
	constructor() {
		super();
	}

	protected fillVisuals() {
		console.log('filling visual');
		const linearBar = new LinearBar();
		const linearHandle = new LinearHandle();
		linearBar.addEventListener('seek', (evt: CustomEvent) => {
			this.emitPercentage(evt.detail.percentage);
		});
		this.visuals = [linearBar, linearHandle];
	}
}

customElements.define('rs-linear-seekbar', LinearSeekBar);
