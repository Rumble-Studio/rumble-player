import { GenericVisual } from '../../GenericVisual';
import { playerServiceEvent } from '../../playerService';

export class SimplePrevButton extends GenericVisual {
	protected _kind = 'SimplePrevButton';
	button: HTMLInputElement;

	constructor() {
		super();
	}

	protected createHTMLElements() {
		this.button = document.createElement('input');
		this.button.setAttribute('type', 'button');
		this.button.setAttribute('value', 'prev');
    this.button.disabled = true

    this.list_of_children = [this.button];
	}

	protected bindHTMLElements() {
		this.button.addEventListener('click', () => {
			this.playerService.prev();
		});
	}
  protected updateState(state: playerServiceEvent) {
    if (state.type === 'newPlaylist') {
      if(this.playerService.playlist.length>0){
        this.button.disabled = false
      }
    }

  }
}

customElements.define('rs-simple-prev-button', SimplePrevButton);
