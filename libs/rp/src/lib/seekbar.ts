
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
    innerBarRadius = innerBarRadius ? innerBarRadius : 140
    outerBarRadius = outerBarRadius ? outerBarRadius : 150
    this.bar = new CircularBar(innerBarRadius, outerBarRadius, this.barColor);
    this.bar.addEventListener('seekTo', (evt: CustomEvent) => {
      console.log(
        '%cLINEAR SEEKBAR GOT SEEK EVENT',
        'color:red',
        evt.detail.percentage
      );
      super.seek(evt.detail.percentage);
    });
  }
  public setBarProgression(value: number) {
    this.bar.updateProgress(value)
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

  private div: HTMLDivElement;
  private progressSVG: SVGSVGElement;
  private emptyCircle: SVGCircleElement;
  private filledCircle: SVGCircleElement

  constructor(innerBarRadius: number, outerBarRadius: number, barColor: string) {
    const barThickness = outerBarRadius-innerBarRadius
    super(barThickness, barColor, innerBarRadius);
  }

  connectedCallback() {
    this.setInnerHTML();
    this.progress = 0;
  }

  protected setInnerHTML() {
    this.div = document.createElement('div');
    this.progressSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.emptyCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    this.filledCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');




    this.progressSVG.appendChild(this.emptyCircle)
    this.progressSVG.appendChild(this.filledCircle)
    this.div.appendChild(this.progressSVG);
    this.appendChild(this.div);

    this.updateStyle();
  }

  protected clickCallback(event: MouseEvent) {
    console.log('Click')
    const width = this.div.offsetWidth;
    const x = event.offsetX < 0 ? 0 : event.offsetX; // Get the horizontal coordinate
    const y = event.offsetY < 0 ? 0 : event.offsetY; // Get the vertical coordinate
    const minBorder = Math.pow(((this.barWidth-this.barThickness*2)),2)
    const maxBorder = Math.pow(((this.barWidth-this.barThickness)),2)
    console.log('Click', minBorder, maxBorder)
    console.log('Click',x*x,y*y,x*x+y*y )


  }

  protected updateStyle() {
    this.div.style.position = 'relative'
    this.div.style.width = this.barWidth.toString()+'px'
    this.div.style.height = this.barWidth.toString()+'px'
    this.div.style.borderRadius = '50%'
    this.div.style.boxShadow = 'inset 0 0 50px #000'
    this.div.style.backgroundColor = '#222'
    this.div.style.zIndex = '1000'
    this.div.style.margin = '10px'

    this.progressSVG.style.position = 'relative'
    this.progressSVG.style.width = this.barWidth.toString()+'px'
    this.progressSVG.style.height = this.barWidth.toString()+'px'
    this.progressSVG.style.zIndex = '1000'
    this.progressSVG.style.borderRadius = '50%'
    this.progressSVG.style.backgroundColor = 'white'
    this.progressSVG.style.transform = 'rotate(-90deg)'
    this.progressSVG.setAttribute('stroke-dasharray', 10 + ' 999')
    this.progressSVG.setAttribute('stroke-linecap', 'round')
    this.progressSVG.style.cursor = 'pointer'
    // This code below will be used to set percentage
    // const circumference = 2* Math.PI * (this.barWidth-this.barThickness)/2
    // const percent = 100
    // const draw = percent * circumference / 100
    // this.progressSVG.setAttribute('stroke-dasharray', draw + ' 999')

    this.emptyCircle.style.width = '100%'
    this.emptyCircle.style.height = '100%'
    this.emptyCircle.style.fill = 'gray'
    this.emptyCircle.style.stroke = 'gray'
    this.emptyCircle.style.strokeWidth = '0px'
    this.emptyCircle.style.transform = 'translate(5px, 5px)'
    this.emptyCircle.setAttribute('cx', ((this.barWidth-this.barThickness)/2).toString())
    this.emptyCircle.setAttribute('cy', ((this.barWidth-this.barThickness)/2).toString())
    this.emptyCircle.setAttribute('r', ((this.barWidth-this.barThickness*2)/2).toString())
    this.emptyCircle.style.cursor = 'default'


    this.filledCircle.style.width = '100%'
    this.filledCircle.style.height = '100%'
    this.filledCircle.style.fill = 'none'
    this.filledCircle.style.stroke = this.barColor
    this.filledCircle.style.strokeWidth = '10px'
    this.filledCircle.style.transform = 'translate(5px, 5px)'
    this.filledCircle.setAttribute('cx', ((this.barWidth-this.barThickness)/2).toString())
    this.filledCircle.setAttribute('cy', ((this.barWidth-this.barThickness)/2).toString())
    this.filledCircle.setAttribute('r', ((this.barWidth-this.barThickness)/2).toString())
    this.filledCircle.style.cursor = 'pointer'


    this.div.onclick = (e) => {
      this.clickCallback(e);
    };
    //
  }
  updateProgress (percentage: number) {
    const circumference = 2* Math.PI * (this.barWidth-this.barThickness)/2
    const draw = percentage * circumference / 100
    this.progressSVG.setAttribute('stroke-dasharray', draw + ' 999')
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

customElements.define('rs-genericbar', GenericBar);
customElements.define('rs-linearbar', LinearBar);
customElements.define('rs-circularbar', CircularBar);
