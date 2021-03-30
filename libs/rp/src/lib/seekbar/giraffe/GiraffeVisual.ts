import { GenericVisual } from '../generic/GenericVisual';

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

		this.img = document.createElement('img');
		this.img.style.cursor = 'pointer';
		this.img.setAttribute('src','https://animalfactguide.com/wp-content/uploads/2013/01/iStock_000006372643XSmall.jpg')
		this.img.style.width = '100%';
		this.img.style.objectFit = 'cover';
	}
	protected setInnerHTML() {
		this.div.appendChild(this.img);
		this.appendChild(this.div);
		this.updateVisual();
	}

	updateVisual() {
		this.img.style.opacity = ''+this.percentage/100;
	}
}

customElements.define('rs-giraffe-visual', GiraffeVisual);
