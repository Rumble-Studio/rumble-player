
class GenericSeekbar extends HTMLElement{
  private position: number;
  private totalDuration: number;
  private positionBuffer: number;
  private isPlaying: boolean;

  constructor() {
    super();
  }
  seek(position: number): void{
    this.position = position
    const event = new CustomEvent('seek',{detail:{position}})
    this.dispatchEvent(event)
    console.log('seeked position: ',position)
  }
}

class LinearSeekBar extends GenericSeekbar{
  // TODO: Utiliser la classe CircularHandle et RectangleBar
  // Bar properties
  private barThickness: number;
  private barColor: string;
  // Handle properties
  private handleRadius: number
  private handleColor: string

  constructor() {
    super();
  }
}

class GenericHandle extends HTMLElement{

  private handleHTML: HTMLElement
  constructor() {
    super();
  }
  connectedCallback(){
    this.setInnerHTML()
  }
  private setInnerHTML(){
    this.handleHTML = document.createElement('div')
    this.appendChild(this.handleHTML)
    this.updateStyle()
  }
  updateStyle(){
    this.handleHTML.style.width = "20px";
    this.handleHTML.style.height = "20px"
    this.handleHTML.style.backgroundColor = "black"
  }

}
class CircularHandle{}
class GenericBar{}
class LinearBar{}
class FunkyHandle{}
class FunkyBar{}
