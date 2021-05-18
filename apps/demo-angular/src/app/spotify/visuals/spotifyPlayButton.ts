import { GenericVisual } from '@rumble-player/elements';

export class SpotifyPlayButton extends GenericVisual{
  button: HTMLElement;


  constructor() {
    super();

    this.button = document.createElement('i')
    this.button.style.color = 'white'

    this.button.style.cursor = 'pointer'

    this.button.innerHTML = 'play_circle_outline'

    this.appendChild(this.button);
  }

  protected setEmitters() {

    this.button.addEventListener('click', () => {
      console.log('clicked')
      this.playerHTML.play({});
    });
  }
  connectedCallback(){
    this.button.classList.add('control-icon')

    this.button.classList.add('material-icons')
    this.button.classList.add('control-icon')
    this.button.classList.add('bigger')
  }

  protected setListeners() {
    this.playerHTML.addEventListener('newPlaylist', () => this.enable());
    this.playerHTML.addEventListener('play', () => this.disable());
    this.playerHTML.addEventListener('pause', () => this.enable());
    this.playerHTML.addEventListener('stop', () => this.enable());
  }

  disable() {
    this.button.innerHTML= 'play_circle_pause'
  }
  enable() {
    this.button.innerHTML = 'play_circle_outline';
  }
}
customElements.define('rs-sp-play',SpotifyPlayButton)
