import { GenericVisual } from '../../GenericVisual';
import { playerServiceEvent } from '../../playerService';

export class SimpleMultiLinearBar extends GenericVisual {
  protected _kind = 'SimpleMultiLinearBar';
  private durationArray = [] as number[];
  private div : HTMLDivElement
  private initialStyled = false
  constructor() {
    super();
    this.createHTMLElements()
  }

  protected createHTMLElements() {

    //this.list_of_children = [this.button];
    const style = document.createElement('style')
    style.textContent = this.generateStyle()+this.generateBarStyle()
    const div = document.createElement('div')
    div.setAttribute('id','mainBar')
    this.list_of_children = [style,div];

  }

  protected bindHTMLElements() {
    //
  }
  protected updateState(state: playerServiceEvent) {
    //
  }
  protected updateVisual() {

    const style = this.shadowRoot.querySelector('style')
    const div = this.shadowRoot.getElementById('mainBar')

    const durationArray = [] as number[]
    this.playerService.playlist.map(value => {
      if (value.valid){
        durationArray.push(value.howl.duration()?value.howl.duration():-1)
      } else {
        durationArray.push(-2)
      }
    })
    console.log(durationArray)
    const minSize = 10
    const maxRatio = 100
    const currentMaxSize = durationArray.some(d=> d>0) ? Math.max(...durationArray) : minSize
    const maxSizeToUse = currentMaxSize>maxRatio*minSize?maxRatio*minSize:currentMaxSize
    let durationsToUse = durationArray.map(d=>d<=0?minSize:d).map(d=>d>maxSizeToUse?maxSizeToUse:d)
     console.log(durationsToUse)
    let durationSum = 0
    for (const number of durationsToUse) {
      durationSum+=number
    }
    let realDurationSum = 0
    for (const number of durationArray) {
      realDurationSum+=number
    }
    let tempStyle = style.textContent= this.generateStyle()+this.generateBarStyle(durationSum)


    const realCumulativeDurations = durationArray.map((value,index,array)=>{
      let sum=0
      for(let i=0;i<=index;i++){
        sum+=array[i]
      }
      return sum
    })
    const cumulativeDurations = durationsToUse.map((value,index,array)=>{
      let sum=0
      for(let i=0;i<=index;i++){
        sum+=array[i]
      }
      return sum
    })
    console.log('CUMUL',durationsToUse)
    durationsToUse = durationsToUse.map(d=>d*1.0/durationSum)
    const indexBeingPlayed = this.playerService.index>=0?this.playerService.index:0
    const currentPosition = this.playerService.position>=0?this.playerService.position:0
    let virtualPosition = realCumulativeDurations[indexBeingPlayed]-realCumulativeDurations[0]
    //virtualPosition += currentPosition/durationArray[indexBeingPlayed] * durationsToUse[indexBeingPlayed]
    virtualPosition += currentPosition
    console.log(durationsToUse)
    //console.log(virtualPosition,realDurationSum,virtualPosition/realDurationSum)
    if (div){
      div.innerHTML = ''
      div.style.overflowX = 'scroll'
      durationsToUse.forEach(((value, index,array) => {
        const subdiv = document.createElement('div')
        subdiv.setAttribute('id','subdiv'+index.toString())
        console.log('VALUE',value)
        tempStyle += `
          #subdiv${index}{
            height:40px;
            display:inline-block;
            width:${100*value}%;
            background-color:${['green','red'][index%2]};

          }
        `;
        div.appendChild(subdiv)
      }))
      tempStyle += `
          #progressDiv{
            height:40px;
            position:absolute;
            top:0;
            width:${(100*virtualPosition/realDurationSum)}%;
            background-color:black;


          }
      `;
      const progressDiv = document.createElement('div')
      progressDiv.setAttribute('id','progressDiv')
      div.appendChild(progressDiv)
    }
    if(style) {
      style.textContent= tempStyle
      div.onclick=(event => {
        const bcr = div.getBoundingClientRect();
        const clickedPercentage = (event.clientX - bcr.left) / bcr.width;
        //console.log(percentage)
        const computedDuration = clickedPercentage * realDurationSum //the last factor should be one)
        const indexToSeek = realCumulativeDurations.findIndex(d=>d>computedDuration) // = 3
        const songComputedDuration = computedDuration - realCumulativeDurations[indexToSeek] // = 1.5
        //const songPercentage = songComputedDuration / durationsToUse[index]
        console.log(songComputedDuration,indexToSeek,computedDuration)
        //playerService.seekPerPercentage(indexToSeek, songPercentage)
      })
      this.list_of_children=[style,div]
    }

    // const cumulativeDurationsPercentage = durationsToUse.map((value,index,array)=>{
    //   let sum=0
    //   for(let i=0;i<=index;i++){
    //     sum+=array[i]
    //   }
    //   return sum
    // })

    //console.log(durationArray,durationsToUse,cumulativeDurations,durationSum)

  }
  generateStyle() {
    return `
		:host{
		  cursor:pointer;
		  height: 35px;
		  position:relative;
		  background-color:yellow;
		}`
		;
  }
  generateBarStyle(width?:number){
    return `#mainBar{
      height: 30px;
      margin-block:10px;
      position:relative;
      width: ${width?width:200}px;}
      `
  }
}

customElements.define('rs-simple-multi-linear-bar', SimpleMultiLinearBar);
