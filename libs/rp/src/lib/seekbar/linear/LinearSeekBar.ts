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
}

customElements.define('rs-linear-seekbar', LinearSeekBar);
