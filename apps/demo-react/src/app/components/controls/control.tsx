import * as React from 'react';
import ShuffleIcon from '@material-ui/icons/Shuffle';
import LoopIcon from '@material-ui/icons/Loop';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import FastForwardIcon from '@material-ui/icons/FastForward';
import FastRewindIcon from '@material-ui/icons/FastRewind';
import Service from '../../../Service';

interface CProps {
  task: string;
}

interface CState {
  enabled: boolean;
  playing: boolean
}

export default class Control extends React.Component<CProps, CState>{

  constructor(props) {
    super(props);
    this.state = {
      playing:false,
      enabled:false
    }
  }
  static contextType = Service
  componentDidMount() {
    this.context.playing.asObservable().subscribe(value => {
      this.setState({
        playing: value
      })
    })

  }

  render() {
    switch (this.props.task) {
      case 'shuffle':
        return (this.state.enabled? <ShuffleIcon className={'control-icon white'} onClick={()=>{this.onShuffle()}} /> :<ShuffleIcon className={'control-icon'} onClick={()=>{this.onShuffle()}} />)
      case 'loop':
        return (this.state.enabled?<LoopIcon className={'control-icon white'} onClick={()=>{this.onLoop()}}/>:<LoopIcon className={'control-icon'} onClick={()=>{this.onLoop()}}/>)
      case 'play':
        return (!this.state.playing?<PlayCircleOutlineIcon onClick={()=>{this.onPlay()}} className={'bigger'} fontSize={'large'}/>:
          <PauseCircleOutlineIcon onClick={()=>{this.onPause()}} className={'bigger'} fontSize={'large'}/>)
      case 'rewind':
        return (<FastRewindIcon className={'control-icon'} onClick={()=>{this.onRewind()}}/>)
      case 'forward':
        return (<FastForwardIcon className={'control-icon'} onClick={()=>{this.onForward()}}/>)
      case 'next':
        return (<SkipNextIcon className={'control-icon'} onClick={()=>{this.onNext()}}/>)
      case 'prev':
        return (<SkipPreviousIcon className={'control-icon'} onClick={()=>{this.onPrev()}}/>)
    }
  }

  onPlay(){
    this.context.play()
  }
  onPause(){
    this.context.pause()
  }
  onNext(){
    this.context.next()
  }
  onPrev(){
    this.context.prev()
  }
  onLoop(){
    let value : boolean
    if(this.context.loop){
      this.context.loop = false
      value = false
    } else {
      this.context.loop = true
      value = true
    }
    this.setState({
      enabled:value
    })
  }
  onShuffle(){
    let value : boolean
    if(this.context.shuffle){
      this.context.shuffle = false
      value = false
    } else {
      this.context.shuffle = true
      value = true
    }
    this.setState({
      enabled:value
    })
  }
  onRewind(){
    const e = new CustomEvent('jump', { detail: { jump: -15 } });
    this.context.seekForJump(e);
  }
  onForward(){
    const e = new CustomEvent('jump', { detail: { jump: 15 } });
    this.context.seekForJump(e);
  }


}
