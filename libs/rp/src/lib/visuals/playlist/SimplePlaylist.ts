import { GenericVisual } from '../../GenericVisual';

export class SimplePlaylist extends GenericVisual {
  protected _kind = 'SimplePlaylist';

  div: HTMLDivElement = document.createElement('div');
  private _playlist : string[] = []
  set playlist(playlist:string[]){
    this._playlist = playlist
    this._playerService.setPlaylistFromUrls(this._playlist)
    this.updateVisual()
  }
  get playlist(){
    return this._playlist
  }

  constructor(private playlistTitle = 'RS Playlist') {
    super();
  }

  protected createHTMLElements() {
    super.createHTMLElements();

    const style = document.createElement('style');
    this.div.setAttribute('id', 'container');

    this.list_of_children = [style, this.div];
  }

  protected bindHTMLElements() {
    super.bindHTMLElements();
  }

  updateVisual() {
    this._playlist.forEach(((value, index) => {
      this.div.appendChild(this.generateLine(value,index))
    }))
    this.list_of_children[1]=this.div
    super.setInnerHTML()
    this._shadow.querySelector('style').textContent = this.generateStyle();
    // this.progressDiv.style.width = 100 * this.percentage + 'px';
  }
  generateLine(song:string,index:number): HTMLDivElement{
    const div = document.createElement('div')
    div.style.display = 'flex'
    div.style.flexDirection = 'row'
    div.style.justifyContent = 'space-between'
    div.style.border = '1px solid blue'
    const p = document.createElement('p')
    p.innerText = song
    div.appendChild(p)
    const playButton = document.createElement('input')
    playButton.setAttribute('type','button')
    playButton.setAttribute('value','play')
    playButton.addEventListener('click',()=>{
      this._playerService.play(index)
    })

    const pauseButton = document.createElement('input')
    pauseButton.setAttribute('type','button')
    pauseButton.setAttribute('value','pause')
    pauseButton.addEventListener('click',()=>{
      this._playerService.pause(index)
    })
    div.appendChild(playButton)
    div.appendChild(pauseButton)
    return div

  }

  generateStyle() {
    return `
		#container{
			width:90%;
			position:relative;
			display: flex;
			flex-direction:column;
		}
`;
  }
}
