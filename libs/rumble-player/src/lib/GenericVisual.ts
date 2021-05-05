import { playerServiceEvent, RumblePlayerService } from './playerService';
import { HTMLRumblePlayer } from './playerHTML';

export class GenericVisual extends HTMLElement {
	public percentage = 0;
	public position = 0;
	protected list_of_children: HTMLElement[] = [];
	protected list_of_emitted_events: string[];
	protected list_of_subcribed_events: string[];

	protected _kind = 'GenericVisual';
	get kind() {
		return this._kind;
	}

	protected _shadow: ShadowRoot;
	protected _playerHTML: HTMLRumblePlayer;
	set playerHTML(player: HTMLRumblePlayer) {
		this._playerHTML = player;
		this.setListeners();
		this.updateVisual();
	}
	get playerHTML() {
		return this._playerHTML;
	}

	protected setListeners() {
		//
	}

	constructor(dontBuildHTMLElements = false) {
		super();
		this._shadow = this.attachShadow({ mode: 'open' });
		if (!dontBuildHTMLElements) {
			this.createHTMLElements();
			this.setInnerHTML();
			this.setEmitters();
		}
		// console.log('GENERIC VISUAL CONSTRUCTOR CALLED');
	}

	// HTML hooks

	connectedCallback() {
		//
	}

	attributeChangedCallback() {
		this.updateVisual();
	}

	// Generic visual construction

	/**
	 * build the HTML object to fill the DOM
	 */
	protected createHTMLElements() {
		// console.log('[GenericVisual](createHTMLElements)', 'nothing to create');
	}

	/**
	 * create the event listeners on the HTML child nodes
	 */
	protected setEmitters() {
		// console.log('[GenericVisual](bindHTMLElements)', 'nothing to bind');
	}

	/**
	 * Loop over children to add them to shadow DOM
	 */
	setInnerHTML() {
		this.list_of_children.forEach((child) =>
			this.shadowRoot.appendChild(child)
		);
	}

	// logic

	/**
	 * Called after new percentage, position, etc...
	 */
	protected updateVisual(payload?) {
		// console.log('[GenericVisual](updateVisual)', 'nothing to update');
	}
}

customElements.define('rs-generic-bar', GenericVisual);
