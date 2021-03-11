// Will contain all the basic logic of the audio
import { Simulate } from 'react-dom/test-utils';
import play = Simulate.play;
import { tryCatch } from 'rxjs/internal-compatibility';

const audioUrlPartOne = 'https://firebasestorage.googleapis.com/v0/b/rumble-studio-alpha.appspot.com/o/assets%2Faudio%2Fjingles%2Fenergetic%2FEnergetic-1.mp3?alt=media&token=a3f78303-bc9f-4624-ba0d-13bb183d017d'
const audioUrlPartTwo = 'https://firebasestorage.googleapis.com/v0/b/rumble-studio-alpha.appspot.com/o/assets%2Faudio%2Fjingles%2Fenergetic%2FEnergetic-1.mp3?alt=media&token=a3f78303-bc9f-4624-ba0d-13bb183d017d'
const audioUrl = audioUrlPartOne + ',' + audioUrlPartTwo
export class RumblePlayer extends HTMLElement {
  public static observedAttributes = ['title'];
  playButton : HTMLButtonElement;
  pauseButton : HTMLButtonElement;
  stopButton : HTMLButtonElement;
  downloadButton : HTMLButtonElement;
  nextButton : HTMLButtonElement;
  prevButton : HTMLButtonElement;
  private _index : number;
  get index (){
    return this._index
  }
  set index (value: number){
    if (value!=this._index){
      console.log('index changed from ', this._index, ' ',value)
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
    this.playlist = []

  }
  connectedCallback(){
    //
    this.setInnerHTML()
    this.bindHTMLElements();
    this.index = -1
    this.setAudioSource(audioUrl)
  }
  /*
  disconnectedCallback(){
    //
  }
  adoptedCallback(){
    //
  }*/
  setInnerHTML(){
    this.playButton = document.createElement('button')
    this.playButton.setAttribute('id', 'rs-play')
    this.playButton.innerText = 'play'
    this.pauseButton = document.createElement('button')
    this.pauseButton.setAttribute('id', 'rs-pause')
    this.pauseButton.innerText = 'pause'
    this.stopButton = document.createElement('button')
    this.stopButton.setAttribute('id', 'rs-stop')
    this.stopButton.innerText = 'stop'
    this.downloadButton = document.createElement('button')
    this.downloadButton.setAttribute('id', 'rs-download')
    this.downloadButton.innerText = 'download'
    this.nextButton = document.createElement('button')
    this.nextButton.setAttribute('id', 'rs-next')
    this.nextButton.innerText = 'next'
    this.prevButton = document.createElement('button')
    this.prevButton.setAttribute('id', 'rs-next')
    this.prevButton.innerText = 'prev'
    this.audio = document.createElement('audio')
    this.audio.setAttribute('id', 'rs-audio')


    this.appendChild(this.playButton)
    this.appendChild(this.pauseButton)
    this.appendChild(this.stopButton)
    this.appendChild(this.downloadButton)
    this.appendChild(this.nextButton)
    this.appendChild(this.prevButton)
    this.appendChild(this.audio)

  }


 /* attributeChangedCallback(attrName, oldVal, newVal) {

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
  */
  bindHTMLElements() {
    // Bind event to buttons
    this.playButton.addEventListener('click', ()=>{
      return this.play()
    })
    this.pauseButton.addEventListener('click', ()=>{
      return this.pause()
    })
    this.stopButton.addEventListener('click', ()=>{
      return this.stop()
    })
    this.downloadButton.addEventListener('click', ()=>{
      return this.download()
    })
    this.nextButton.addEventListener('click', ()=>{
      this.next()
      return this.play()
    })
    this.prevButton.addEventListener('click', ()=>{
      this.prev()
      return this.play()
    })
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
    if(this.playlist.length===0) return;
    this.audio.pause()
    this.audio.currentTime=0

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
    this.setPlaylist(value.split(','))
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

  private download() {
    const element = document.createElement('a');
    element.setAttribute('href',  encodeURIComponent(this.playlist[this._index]));
    element.setAttribute('download', 'rs-player-file.mp3');

    element.style.display = 'none';
    this.appendChild(element);

    element.click();

    this.removeChild(element);
  }
}

customElements.define('rs-player', RumblePlayer);
