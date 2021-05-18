import { PlayerHTML } from '@rumble-player/player';

export class GenericVisual extends HTMLElement {
	protected _playerHTML: PlayerHTML;
	set playerHTML(player: PlayerHTML) {
		this._playerHTML = player;
		this.setListeners();
		this.setEmitters();
		this.updateVisual({});
	}
	get playerHTML() {
		return this._playerHTML;
	}

	setPlayerHTML(playerHTML: PlayerHTML) {
		this.playerHTML = playerHTML;
	}

	protected setListeners() {
		//
	}

	protected setEmitters() {
		//
	}

	protected updateVisual(state) {
		console.log('[GenericVisual](updateVisual) new state received', {
			state,
		});
	}
}

customElements.define('rs-generic', GenericVisual);
