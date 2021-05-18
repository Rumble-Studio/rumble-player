import * as React from 'react';
import Service from '../../../Service';
import './bar.scss'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SProps {
}

interface SState {
  percentage : number
}

export default class Seekbar extends React.Component<SProps, SState> {
  constructor(props) {
    super(props);
    this.state = {
      percentage: 0
    }
  }
  private progressRef = React.createRef<HTMLDivElement>();
  private barRef = React.createRef<HTMLDivElement>();
  static contextType = Service
  componentDidMount() {
    this.context.percentage.asObservable().subscribe((percentage)=>{this.updateBar(percentage)})
  }

  render() {
    return (
      <div className={'barContainer'}>
        <div className={'barHolder'} ref={this.barRef as React.RefObject<HTMLDivElement>} onClick={(event)=>this.onClick(event)}>
          <div  className={'bar'} ref={this.progressRef as React.RefObject<HTMLDivElement>} />
        </div>
      </div>
    )
  }

  private updateBar(percentage: number) {
    (this.progressRef.current as HTMLDivElement).style.width = (100*percentage)+'%'

  }

  private onClick(event) {
    const bcr = (this.barRef.current as HTMLDivElement).getBoundingClientRect();
    const percentage = (event.clientX - bcr.left) / bcr.width;
    console.log(percentage*100)
    this.context.seekPerPercentage(percentage);
  }
}
