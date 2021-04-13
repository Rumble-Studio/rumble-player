import { GenericVisual } from '../../GenericVisual';
import { playerServiceEvent, RumblePlayerService } from '@rumble-player/rp';
import { main } from 'ts-node/dist/bin';

export class MultiLinearBar extends GenericVisual {
  protected _kind = 'MultiLinearBar';

  div: HTMLDivElement = document.createElement('div');
  percentage: number;

  set playerService(player: RumblePlayerService) {
    super.playerService=player
    this.div.innerHTML = ''
    let mainStyle = this.generateStyle()
    const style = document.createElement('style');
    this.div.setAttribute('id', 'bar');
    player.playlist.forEach((value, index, array) => {
      console.log('LENGTH',index)
      this.shadowRoot.appendChild(this.generateSingleBar(index,50))
      mainStyle = mainStyle+`
      #bar${index.toString()}{
        width: 50%;
        background-color: ${['red','blue'][index%2]};
        position:relative;
        display:inline-block;
        height:15px
      }
      `;
    })
    console.log('DIV is',mainStyle,this.div)
    this._shadow.querySelector('style').textContent = mainStyle
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
    // this.addEventListener('click', (event) => {
    //   const bcr = this.getBoundingClientRect();
    //   const percentage = (event.clientX - bcr.left) / bcr.width;
    //   const clickEvent = new CustomEvent('seekPerPercentage', {
    //     detail: { percentage },
    //   });
    //   this.dispatchEvent(clickEvent);
    // });
  }
  generateSingleBar=(index:number,percentage:number)=>{
    const div = document.createElement('div');
    div.attachShadow({ mode: 'open' })
    div.setAttribute('id', 'bar'+index.toString());
    const progressDiv = document.createElement('div');
    progressDiv.setAttribute('id', 'progressBar'+index.toString());
    progressDiv.style.backgroundColor = 'white'
    progressDiv.style.width = '15%'
    div.shadowRoot.appendChild(progressDiv);
    div.style.cursor = 'pointer'
    progressDiv.innerText='hidhi'
    div.addEventListener('click',(event)=>{
      const bcr = div.getBoundingClientRect();
      const percentage = (event.clientX - bcr.left) / bcr.width;
      console.log('PERCENTAGE',percentage)
      const clickEvent = new CustomEvent('seekPerPercentageAndIndex', {
             detail: { percentage,index },
           });
      this.dispatchEvent(clickEvent);
    });
    return div
  }

  updateVisual() {
    //this._shadow.querySelector('style').textContent = this.generateStyle(
    //);
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
}

customElements.define('rs-multi-linear-bar', MultiLinearBar);
