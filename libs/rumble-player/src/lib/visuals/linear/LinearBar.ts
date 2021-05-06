import { GenericVisual } from '../../GenericVisual';

export class LinearBar extends GenericVisual {
	protected _kind = 'LinearBar';
  private _shadow: ShadowRoot;
	div: HTMLDivElement = document.createElement('div');
	progressDiv: HTMLDivElement = document.createElement('div');
	percentage: number;

	constructor() {
		super();
		this.createHTMLElements()
	}

	protected createHTMLElements() {
	  console.log('CREATE')
    this._shadow = this.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
		this.div = document.createElement('div');
		this.div.setAttribute('id', 'bar');
		this.progressDiv = document.createElement('div');
		this.progressDiv.setAttribute('id', 'progressBar');
		this.div.appendChild(this.progressDiv);
		this._shadow.appendChild(style)
    this._shadow.appendChild(this.div)
	}

	protected setEmitters() {
    console.log('EMITTER')

    this.addEventListener('click', (event) => {
			const bcr = this.getBoundingClientRect();
			const percentage = (event.clientX - bcr.left) / bcr.width;

			this.playerHTML.seekPerPercentage(percentage);
		});
	}

	protected setListeners() {
		this.playerHTML.addEventListener('newPosition', (payload)=>this.updateVisual(payload));
		this.playerHTML.addEventListener('seek', (payload)=>this.updateVisual());
	}

	updateVisual = (payload?) => {
    console.log('UPDATE')

    if (payload) {
		  console.log(payload)
			this.percentage = this.playerHTML.percentage;
		}
		this._shadow.querySelector('style').textContent = this.generateStyle(
			this.percentage
		);
	};

	generateStyle(percentage: number) {
		return `
		#bar{
			height:15px;
			position:relative;
			background-color: red;
			cursor:pointer;
		}
		#progressBar {
			width: ${100 * percentage}%;
			height: 100%;
			background-color: white;
			opacity:0.5
		}`;
	}
}

customElements.define('rs-linear-bar', LinearBar);
