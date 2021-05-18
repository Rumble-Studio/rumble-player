import { GenericVisual } from './GenericVisual';

export class SimpleImage extends GenericVisual {
	private src: string;
  private _shadow: ShadowRoot;
  constructor() {
		super();
		this.createHTMLElements()
	}

	protected createHTMLElements() {
    this._shadow = this.attachShadow({ mode: 'open' });
		const wrapper = document.createElement('div');
		wrapper.style.height = '200px';
		wrapper.style.width = '200px';
		const image = document.createElement('img');
		image.style.maxHeight = '200px';
		const noImage = document.createElement('p')
    noImage.setAttribute('id','noImage')
    noImage.style.fontWeight = 'bold'
		if (this.src && this.src.length > 0) {
			image.setAttribute('src', this.src);
		}
		else{
		  noImage.innerHTML = '[NO IMAGE]'
    }
		wrapper.appendChild(noImage)
		wrapper.appendChild(image);
		const style = document.createElement('style');
		const title = document.createElement('p');
		title.innerHTML = 'image of selected song : ';
		this.shadowRoot.appendChild(style)
		this.shadowRoot.appendChild(wrapper)
	}

	protected setEmitters() {
		super.setEmitters();
	}

	protected updateVisual() {
		//
	}

	protected setListeners() {
		this.playerHTML.addEventListener('play', ()=>this.updateImage());
	}

	updateImage() {
		this.src = this.playerHTML.playlist[this.playerHTML.index].image;
    if (this.src && this.src.length > 0) {
      this.shadowRoot.querySelector('#noImage').innerHTML=''
      this.shadowRoot.querySelector('img').setAttribute('src', this.src);
    }
    else {
      this.shadowRoot.querySelector('#noImage').innerHTML = '[NO IMAGE]'
    }
	}
}

customElements.define('rs-simple-image', SimpleImage);
