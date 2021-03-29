import { GenericSeekbar } from '../generic/GenericSeekBar';
import { PercentageBar } from '../percentage/PercentageBar';

export class PercentageSeekBar extends GenericSeekbar {
	protected _kind = 'percentageSeekBar';

	constructor() {
		super();
	}

	protected fillVisuals() {
		const percentageBar = new PercentageBar();
		const newVisuals = [percentageBar];
		this.changeVisuals(newVisuals);
	}
}

customElements.define('rs-percentage-seekbar', PercentageSeekBar);
