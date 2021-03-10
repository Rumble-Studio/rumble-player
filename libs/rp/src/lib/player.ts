// Will contain all the basic logic of the audio
import { Simulate } from 'react-dom/test-utils';
import play = Simulate.play;

const audioUrl = 'https://firebasestorage.googleapis.com/v0/b/rumble-studio-alpha.appspot.com/o/assets%2Faudio%2Fjingles%2Fenergetic%2FEnergetic-1.mp3?alt=media&token=a3f78303-bc9f-4624-ba0d-13bb183d017d'
export class RumblePlayer extends HTMLElement {
  public static observedAttributes = ['title'];
  playButton;
  recordButton;
  pauseButton;
  stopButton;
  downloadButton;
  private _index : number;
  get index (){
    return this._index
  }
  set index (value: number){
    if (value!=this._index){
      this._index = value
      const eventIndexChange = new CustomEvent('indexChange',{detail:value})
      this.dispatchEvent(eventIndexChange)
      this._updateAudioPlayerSrc()
    }
  }
  audio : HTMLAudioElement;
  source; // User input linked to audio src
  private playlist : string[];

  constructor(){
    super();
    this.setInnerHTML()
    this.index = -1
    this.playlist = []
    this.bindHTMLElements();
    this.setAudioSource(audioUrl)

  }
  /*connectedCallback(){
    //
  }
  disconnectedCallback(){
    //
  }
  adoptedCallback(){
    //
  }*/
  setInnerHTML(){
    this.innerHTML =`
        <div>
          <button id="play">play</button>
          <button id="pause">pause</button>
          <button id="resume">resume</button>
          <button id="stop">stop</button>
          <button id="next">next</button>
          <button id="prev">prev</button>
          <button id="download">download</button>
          <audio id="audio"  /></div>`;
  }


  /*attributeChangedCallback(attrName, oldVal, newVal) {

    if (attrName==='source'){
      this.audio.setAttribute('src',newVal)
    }
  }
   */
  bindHTMLElements() {
    this.playButton = document.getElementById('play');
    this.recordButton = document.getElementById('record');
    this.pauseButton = document.getElementById('pause');
    this.stopButton = document.getElementById('stop');
    this.downloadButton = document.getElementById('download');
    this.audio = document.getElementById('audio') as HTMLAudioElement;
  }
  public play(): Promise<void>{
    if(this.playlist.length===0) return;
    return this.audio.play()
  }
  public pause (){
    if(this.playlist.length===0) return;
    return this.audio.pause()
    //
  }
  public resume (){
    if(this.playlist.length===0) return;
    //
  }
  public stop (){
    //
  }
  public next(){
    if(this.playlist.length===0) return;
    this.index+=1
    if (this.index>=this.playlist.length){
      this.index = 0
    }
  }
  public prev(){
    if(this.playlist.length===0) return;
    this.index-=1
    if (this.index < 0){
      this.index = this.playlist.length-1
    }
  }
  public seek(position: number){
    if(this.playlist.length===0) return;
    // Move player head to a given time position(seconde)
  }
  public setAudioSource(value: string){
    // To accept one audio url
    this.setPlaylist([value])
  }
  public setPlaylist(playlist: string[]){
    // To accept several audio urls
    this.index = -1
    this.playlist = playlist
    this.index = this.playlist.length > 0 ? 0 : -1
    this.stop()
  }
  private _updateAudioPlayerSrc(){
    this.audio.setAttribute('src',this.playlist[this.index])
  }

  downloadTrack (){
    // whateverCode
  }
}

customElements.define('rs-player', RumblePlayer);
