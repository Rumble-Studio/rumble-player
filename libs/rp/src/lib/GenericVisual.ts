import { playerServiceEvent, RumblePlayerService } from './playerService';

export class GenericVisual extends HTMLElement {
	public percentage = 0;
	public position = 0;
	protected list_of_children: HTMLElement[] = [];

	protected _kind = 'GenericVisual';
	protected _shadow: ShadowRoot;
	protected _playerService : RumblePlayerService
  set player(player: RumblePlayerService){
	  this._playerService = player
    this._playerService.playingEventsCallbacks.push((state:playerServiceEvent)=> this.updateState(state)
    );
  }
  get player(){
    return this._playerService
  }
	get kind() {
		return this._kind;
	}

	constructor() {
		super();
		this._shadow = this.attachShadow({ mode: 'open' });
		this.createHTMLElements();
		this.setInnerHTML();
    this.bindHTMLElements();
		console.log('GENERIC VISUAL CONSTRUCTOR CALLED');
	}

	// HTML hooks

	connectedCallback() {
		console.log(
			'%c[GenericVisual](connectedCallback)',
			'color:crimson',
			this.kind
		);
		this.updateStyle();
	}

	attributeChangedCallback() {
		console.log('Custom square element attributes changed.');
		this.updateStyle();
	}
	protected updateState(state:playerServiceEvent){
   // console.log('STATE CHANGED',state)
  }

	// Generic visual construction

	/**
	 * build the HTML object to fill the DOM
	 */
	protected createHTMLElements() {
		console.log('[GenericVisual](createHTMLElements)', 'nothing to create');
	}

	/**
	 * create the event listeners on the HTML child nodes
	 */
	protected bindHTMLElements() {
		console.log('[GenericVisual](bindHTMLElements)', 'nothing to bind');
	}

	/**
	 * Loop over children to add them to shadow DOM
	 */
	setInnerHTML() {
		this.list_of_children.forEach((child) => this.shadowRoot.appendChild(child));
	}

	// logic

	public updatePerPercentage(newPercentage: number) {
		if (newPercentage != this.percentage) {
			this.percentage = newPercentage;
			this.updateVisual();
		}
	}
	public updatePerPosition(newPosition: number) {
		if (newPosition != this.position) {
			this.position = newPosition;
			this.updateVisual();
		}
	}

	/**
	 * Called after new percentage, position, etc...
	 */
	protected updateVisual() {
		// console.log('[GenericVisual](updateVisual)', 'nothing to update');
	}

	/**
	 * Called by HTML hooks
	 */
	protected updateStyle() {
		console.log('[GenericVisual](updateStyle)', 'nothing to update');
	}
}

customElements.define('rs-generic-bar', GenericVisual);
