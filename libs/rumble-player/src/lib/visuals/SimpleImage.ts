import { GenericVisual } from '../GenericVisual';
import { playerServiceEvent, RumblePlayerService } from '../playerService';

export class SimpleImage extends GenericVisual {
	private src: string;
	set player(player: RumblePlayerService) {
		this._playerService = player;
		this.src = player.playlist[player.index]?.image
			? player.playlist[player.index].image
			: '';
		this.shadowRoot.querySelector('img').setAttribute('src', this.src);
	}
	constructor() {
		super();
	}

	protected createHTMLElements() {
		super.createHTMLElements();
		const wrapper = document.createElement('div');
		wrapper.style.height = '200px';
		wrapper.style.width = '200px';
		const image = document.createElement('img');
		image.style.maxHeight = '200px';
		if (this.src && this.src.length > 0) {
			image.setAttribute('src', this.src);
		}
		wrapper.appendChild(image);
		const style = document.createElement('style');
		const title = document.createElement('p');
		title.innerHTML = 'image of selected song : ';
		this.list_of_children = [style, title, wrapper];
	}

	protected bindHTMLElements() {
		super.bindHTMLElements();
	}

	protected updateVisual() {
		//
	}
	protected updateState(state: playerServiceEvent) {
		if (state.type === 'play') {
			this.src = this.playerHTML.playlist[this.playerHTML.index].image;
			this.shadowRoot.querySelector('img').setAttribute('src', this.src);
		}
	}
}

customElements.define('rs-simple-image', SimpleImage);
