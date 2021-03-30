import { GenericSeekbar } from '../generic/GenericSeekBar';
import { GiraffeVisual } from './GiraffeVisual';
import { MoucheVisual } from './MoucheVisual';

export class GiraffeSeekBar extends GenericSeekbar {
	protected _kind = 'linearSeekBar';

	constructor() {
		super();
	}

	protected fillVisuals() {
		const giraffeVisual = new GiraffeVisual();
		const moucheVisual1 = new MoucheVisual();
		const moucheVisual2 = new MoucheVisual();
		const moucheVisual3 = new MoucheVisual();
		const moucheVisual4 = new MoucheVisual();
		const moucheVisual5 = new MoucheVisual();
		const newVisuals = [
			giraffeVisual,
			moucheVisual1,
			moucheVisual2,
			moucheVisual3,
			moucheVisual4,
			moucheVisual5,
		];
		this.changeVisuals(newVisuals);
	}
}

customElements.define('rs-giraffe-seekbar', GiraffeSeekBar);
