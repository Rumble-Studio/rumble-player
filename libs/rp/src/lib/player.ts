// Will contain all the basic logic of the player

export class PlayerElement extends HTMLElement {
  public static observedAttributes = ['title'];
  play;
  record;
  pause;
  stop;
  download;
  player;
  source;
  private playList : string[];

  constructor(){
    super();
    this.playList = []
    // this.init()
  }
  connectedCallback(){
    //
  }
  disconnectedCallback(){
    this.stopPlaying()
  }
  adoptedCallback(){
    this.stopPlaying()
  }


  attributeChangedCallback(attrName, oldVal, newVal) {

    this.innerHTML =
      `<h1>Welcome to Rumble Studio ${this.title}!</h1>
        <div>
          <button id="play">play</button>
          <button id="pause">pause</button>
          <button id="resume">resume</button>
          <button id="stop">stop</button>
          <button id="next">next</button>
          <button id="prev">prev</button>
          <button id="download">download</button>
          <audio id="player" /></div>`;
    if (attrName==='source'){
      this.init()
      this.startPlaying()
      this.player.setAttribute('src',newVal)
    }
  }
  init() {
    this.play = document.getElementById('play');
    this.record = document.getElementById('record');
    this.pause = document.getElementById('pause');
    this.stop = document.getElementById('stop');
    this.download = document.getElementById('download');
    this.player = document.getElementById('player');
    this.player.setAttribute('src',this.getAttribute('source'))
    // this.idleMode();

  }
  startPlaying = () => {
    this.playingMode();
  }
  pausePlaying = () => {
    this.playingPauseMode();
  }
  resumePlaying = () => {
    this.playingResumeMode();
  }
  stopPlaying = () => {
    this.playingStopMode();
  }
  downloadTrack = () => {
    // whateverCode
  }
  idleMode = () => {
    this.player.style.visibility = 'hidden';
    this.record.classList = ['control'];
    this.play.classList.add('disabled');
    this.pause.classList.add('disabled');
    this.stop.classList.add('disabled');
    this.download.classList.add('disabled');
  }
  playingMode = () => {
    this.player.style.visibility = 'hidden';
    this.pause.classList = ['control'];
    this.stop.classList = ['control'];
    this.record.classList.add('disabled');
  }
  playingPauseMode = () => {
    this.play.classList = ['control'];
    this.pause.classList.add('disabled');
  }
  playingResumeMode = () => {
    this.pause.classList = ['control'];
    this.play.classList.add('disabled');
  }
  playingStopMode = () => {
    this.idleMode();
    this.player.style.visibility = 'visible';
  }

}

customElements.define('rs-player', PlayerElement);
