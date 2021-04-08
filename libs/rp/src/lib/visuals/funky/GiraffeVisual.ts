import { GenericVisual } from '../../GenericVisual';

export class GiraffeVisual extends GenericVisual {
	protected _kind = 'GiraffeVisual';

	div: HTMLDivElement;
	img: HTMLImageElement;

	constructor() {
		super();
	}

	protected createHTMLElements() {
		this.div = document.createElement('div');
		this.div.style.height = '250px';
		this.div.style.width = '250px';
		this.div.style.position = 'absolute';
		this.div.style.overflow = "hidden";

		this.img = document.createElement('img');
		this.img.style.cursor = 'pointer';
		this.img.setAttribute('src','https://images.ctfassets.net/81iqaqpfd8fy/3r4flvP8Z26WmkMwAEWEco/870554ed7577541c5f3bc04942a47b95/78745131.jpg?w=1200&h=1200&fm=jpg&fit=fill')
		this.img.style.width = '100%';
		this.img.style.objectFit = 'cover';
		this.img.style.transition = 'all 1s'

	}
	protected updateStyle() {
    super.updateStyle();
		this.div.appendChild(this.img);
		this._shadow.appendChild(this.div);
	}

	updateVisual() {
		this.img.style.opacity = ''+this.percentage/100;
	}
}

customElements.define('rs-giraffe-visual', GiraffeVisual);
