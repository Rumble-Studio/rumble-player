import { GenericVisual } from '../../GenericVisual';
import { RumblePlayerService } from '../../playerService';

export class MultiLinearBar extends GenericVisual {
	protected _kind = 'MultiLinearBar';

	div: HTMLDivElement = document.createElement('div');
	percentage: number;

	set playerService(player: RumblePlayerService) {
		super.playerService = player;
		this.div.innerHTML = '';
		let mainStyle = this.generateStyle();

		const style = document.createElement('style');
		this.div.setAttribute('id', 'bar');
		player.playlist.forEach((value, index, array) => {
			console.log('LENGTH', index);
			const div = this.generateSingleBar(index, 50);
			div.shadowRoot.appendChild(document.createElement('style'));
			this.shadowRoot.appendChild(div);
			mainStyle =
				mainStyle +
				`
      #bar${index.toString()}{
        width: ${100 / array.length}%;
        background-color: ${['red', 'green'][index % 2]};
        border-width:1px;
        border-color:${['red', 'green'][index % 2]};
        position:relative;
        display:inline-block;
        height:15px
      }
      `;
		});
		// console.log('DIV is', mainStyle, this.div);
		this._shadow.querySelector('style').textContent = mainStyle;
		this.list_of_children = [style];
	}

	constructor() {
		super();
	}

	protected createHTMLElements() {
		const style = document.createElement('style');
		this.div = document.createElement('div');
		this.div.setAttribute('id', 'bar');

		this.list_of_children = [style];
	}

	protected bindHTMLElements() {
		//
	}
	generateSingleBar = (index: number, percentage: number) => {
		const div = document.createElement('div');
		div.attachShadow({ mode: 'open' });
		div.setAttribute('id', 'bar' + index.toString());
		const progressDiv = document.createElement('div');
		progressDiv.attachShadow({ mode: 'open' });
		progressDiv.setAttribute('id', 'progressBar' + index.toString());

		div.shadowRoot.appendChild(progressDiv);
		div.style.cursor = 'pointer';
		div.addEventListener('click', (event) => {
			const bcr = div.getBoundingClientRect();
			const percentage = (event.clientX - bcr.left) / bcr.width;
			const clickEvent = new CustomEvent('seekPerPercentageAndIndex', {
				detail: { percentage, index, stopOthers:true, keepPlaying:true, updateGlobalIndex:true },
			});
			this.dispatchEvent(clickEvent);
		});
		return div;
	};

	updateVisual() {
		if (this._playerService) {
			const { index, percentage } = this._playerService;
			const bar = this._shadow.children.item(index + 1);
			const progressBar = bar.shadowRoot.querySelector('style');
			progressBar.textContent = `
      #progressBar${index.toString()}{
        width: ${100 * percentage}%;
        background-color: white;
        height:14px
      }`;
		}
	}

	generateStyle() {
		return `
		#bar{
			height:15px;
			position:relative;
			background-color: green;
			cursor:pointer;
		}
		`;
	}
	generateProgressStyle(percentage: number, index: number) {
		return `
		#progressBar${index}{
			height:15px;
			width: ${100 * percentage}%;
    	position:relative;
			background-color: blue;
			cursor:pointer;
		}
		`;
	}
}

customElements.define('rs-multi-linear-bar', MultiLinearBar);
