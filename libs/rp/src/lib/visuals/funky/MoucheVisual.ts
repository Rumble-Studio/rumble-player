import { GenericVisual } from '../../GenericVisual';

export class MoucheVisual extends GenericVisual {
	protected _kind = 'MoucheVisual';

	X = 250*Math.random();
	Y = 250*Math.random();

	img: HTMLImageElement;
	div: HTMLDivElement;

	constructor() {
		super();
	}

	protected createHTMLElements() {

		this.style.position = 'absolute';
		this.style.top = '0px';
		this.style.left = '0px';

		this.div = document.createElement('div');
		this.div.style.height = '250px';
		this.div.style.width = '250px';
		this.div.style.position = 'absolute';
		this.div.style.overflow = "hidden";
		// this.div.style.backgroundColor = "#12345655"

		
		this.img = document.createElement('img');
		this.img.style.cursor = 'pointer';
		this.img.setAttribute('src', 'https://thumbs.gfycat.com/EminentLightheartedAfricanelephant-max-1mb.gif');
		this.img.style.position = 'absolute';
		this.img.style.height = '30px';
		this.img.style.width = '30px';
		this.img.style.objectFit = 'cover';

		this.img.style.transition = 'all 1s'
	}
	protected setInnerHTML() {
		this.div.appendChild(this.img)
		this.appendChild(this.div);
		this.updateVisual();
	}

	updateVisual() {
		this.X = Math.min(250, Math.max(0, this.X + 70 * (Math.random() - 0.5)));
		this.Y = Math.min(250, Math.max(0, this.Y + 70 * (Math.random() - 0.5)));
		this.img.style.top = this.Y + 'px';
		this.img.style.rotate = (Math.random()*20)+'deg'
		this.img.style.left = this.X + 'px';
	}
}

customElements.define('rs-mouche-visual', MoucheVisual);
