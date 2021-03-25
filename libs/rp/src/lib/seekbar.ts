
export class GenericSeekbar extends HTMLElement {
	private position: number;
	protected bar: GenericBar;
  protected barThickness: number;
  protected barColor: string;
	private positionBuffer: number;
	private isPlaying: boolean;

	constructor() {
		super();
	}
	setBarProgression(value: number) {
    this.bar.progress = value;
  }

  connectedCallback() {
    this.setInnerHTML();
  }
  setInnerHTML() {
    this.appendChild(this.bar);
  }

	seek(percentage: number): void {
		const event = new CustomEvent('seek', { detail: { percentage } });
		this.dispatchEvent(event);
		console.log('seeked percentage: ', percentage);
	}
}
export class LinearSeekBar extends GenericSeekbar {
	// TODO: Utiliser la classe CircularHandle et RectangleBar
	// Bar properties
	protected barWidth
	protected bar: LinearBar;
	// Handle properties
	private handleRadius: number;
	private handleColor: string;

	constructor(barThickness?: number, barColor?: string, barWidth?: number) {
		super();
		this.barThickness = barThickness ? barThickness : 3;
		this.barColor = barColor ? barColor : 'black';
		this.barWidth = barWidth ? barWidth : 250
		this.bar = new LinearBar(this.barThickness, this.barColor, this.barWidth);
		this.bar.addEventListener('seekTo', (evt: CustomEvent) => {
			console.log(
				'%cLINEAR SEEKBAR GOT SEEK EVENT',
				'color:red',
				evt.detail.percentage
			);
			super.seek(evt.detail.percentage);
		});
	}

}
export class CircularSeekBar extends GenericSeekbar{

  protected bar: CircularBar;

  constructor(innerBarRadius?: number, outerBarRadius?: number, barColor?: string) {
    super();
    this.barColor = barColor ? barColor : 'black';
    this.bar = new CircularBar(innerBarRadius, outerBarRadius, barColor);
    this.bar.addEventListener('seekTo', (evt: CustomEvent) => {
      console.log(
        '%cLINEAR SEEKBAR GOT SEEK EVENT',
        'color:red',
        evt.detail.percentage
      );
      super.seek(evt.detail.percentage);
    });
  }

}


class GenericBar extends HTMLElement {
	protected barThickness: number;
	protected barColor: string;
	protected barWidth: number
  protected _progress: number;
  get progress() {
    return this._progress;
  }
  set progress(value: number) {
    // To be overridden
  }
	constructor(barThickness: number, barColor: string, barWidth: number) {
		super();
		this.barThickness = barThickness;
		this.barColor = barColor;
		this.barWidth = barWidth
	}

	protected seek(percentage: number) {
		console.log('%cNEW PERCENTAGE IS', 'color:red', percentage);
		const e = new CustomEvent('seekTo', { detail: { percentage } });
		this.dispatchEvent(e);
	}
	protected setInnerHTML(){
	  // To be overridden
  }
  protected clickCallback(event: MouseEvent){
    // To be overridden
  }
  protected updateStyle(){
    // To be overridden
  }
}

export class LinearBar extends GenericBar {
	private div: HTMLDivElement;
	private progressDiv: HTMLDivElement;

	set progress(value: number) {
		console.log('received value for progress ', value);
		this.progressDiv.style.width = value.toString() + '%';
	}
	constructor(barThickness: number, barColor: string, barWidth: number) {
		super(barThickness, barColor, barWidth);
	}
	connectedCallback() {
		this.setInnerHTML();
		this.progress = 0;
	}

	protected setInnerHTML() {
		this.div = document.createElement('div');
		this.progressDiv = document.createElement('div');
		this.progressDiv.style.height = '100%';
		this.progressDiv.style.backgroundColor = 'blue';
		this.div.style.cursor = 'pointer';
		this.div.appendChild(this.progressDiv);
		this.appendChild(this.div);
		this.updateStyle();
	}

  protected clickCallback(event: MouseEvent) {
		const width = this.div.offsetWidth;
		const x = event.offsetX < 0 ? 0 : event.offsetX; // Get the horizontal coordinate
		const percentage = (100 * x) / width;
		super.seek(percentage);
		this.progress = percentage;
	}

  protected updateStyle() {
		this.div.style.marginTop = '10px';
		this.div.style.width = '300px';
		this.div.style.height = this.barThickness.toString() + 'px';
		this.div.style.backgroundColor = this.barColor;
		this.div.onclick = (e) => {
			this.clickCallback(e);
		};
	}
}
export class CircularBar extends GenericBar{
  // TODO Circula bar https://nosmoking.developpez.com/demos/css/gauge_circulaire.html
  constructor(innerBarRadius: number, outerBarRadius: number, barColor: string) {
    super(outerBarRadius-innerBarRadius, barColor, innerBarRadius);
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
customElements.define('rs-circular-seekbar', CircularSeekBar);
customElements.define('rs-linearbar', LinearBar);
customElements.define('rs-genericbar', GenericBar);
