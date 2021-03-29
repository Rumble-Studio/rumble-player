import { GenericSeekbar } from '../generic/GenericSeekBar';
import { PercentageBar } from '../percentage/PercentageBar';

export class PercentageSeekBar extends GenericSeekbar {
	protected _kind = 'percentageSeekBar';

	constructor() {
		super();
	}

	fillVisuals() {
		this.visuals = [new PercentageBar()];
	}
}

customElements.define('rs-percentage-seekbar', PercentageSeekBar);
