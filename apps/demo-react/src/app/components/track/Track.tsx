import { Song } from '@rumble-player/service';
import * as React from 'react';
import Service, { secondsToFormat } from '../../../Service';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import { PauseCircleOutline } from '@material-ui/icons';

interface TProps {
  index: number;
  song: Song;
  header: boolean;

}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TState {
  duration: number,
  playing: boolean
}

export default class Track extends React.Component<TProps, TState> {

  constructor(props) {
    super(props);
    this.state = {
      duration:0,
      playing: false
    }
    try{
      props.song.onload = this.onLoad
    } catch (e) {
      //
    }
  }
  static contextType = Service
  componentDidMount() {
    console.log(this.context)
    this.context.playing.asObservable().subscribe(status => {
      this.setState({
        playing: status
      })
    })
  }
  onLoad = () => {
    this.setState({duration:this.props.song.howl.duration()})
  }
  onPlay=()=>{
    const {playing} = this.state
    const {index} = this.props
    const globalIndex = this.context.index.getValue()
    if(playing && globalIndex === index){
      this.context.pause()
    } else if (playing) {
      this.context.stop()
      this.context.play(index)
    } else if(globalIndex === index){
      this.context.play()
    } else {
      this.context.play(index)
    }
  }
  renderButton = () =>{
    if(this.state.playing){
      if(this.context.index.getValue()===this.props.index){
        return (<PauseCircleOutline style={{color: "white"}} onClick={this.onPlay}/>)
      }
    }
    return (<PlayCircleOutlineIcon style={{color: "white"}} onClick={this.onPlay}/>)

  }
  render() {
    if (this.props.header){
      return(
        <div className="track">
        <PlayCircleOutlineIcon style={{color: "transparent"}}/>
      <div className="track-details">
        <h3>#</h3>
        <h3>Title</h3>
        <h3 style={{textAlign: "center"}}>Artist</h3>
      <h3>Album</h3>
      <h3>Duration</h3>
      </div>
      </div>
    )
    } else {
      const {song} = this.props
      return (
        <div className="track">
          {this.renderButton()}

      <div className="track-details">
        <h3>{this.props.index}</h3>
        <h3>{song.title}</h3>
        <h3 style={{textAlign: "center"}}>Artist</h3>
      <h3>{song.playlistName}</h3>
      <h3>{secondsToFormat(this.state.duration)}</h3>
      </div>
      </div>
    )
    }
  }

}
