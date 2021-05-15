

import * as React from 'react';
import Service from '../../../Service';
import { Song } from '@rumble-player/service';
import Track from '../track/Track';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface PProps {
}

interface PState {
  isHome: boolean;
  defaultImage: string;
}

export default class Playlist extends React.Component<PProps, PState>{
  constructor(props) {
    super(props);
    this.state ={
      isHome : true,
      defaultImage: 'https://i.scdn.co/image/ab67706f00000003c414e7daf34690c9f983f76e'
    }
  }
  static contextType = Service
  componentDidMount() {
    console.log(this.context)
  }

  render() {
    if (this.state.isHome){

      return (
        <div className={'playlist-container'}>
          <div className={'playlist-header'}>
            <img className={'art'} src={this.state.defaultImage} alt={'ok'}/>


            <div className={'album-details'}>
              <h1>Nom</h1>
              <h2>Nom Album</h2>
            </div>
          </div>
          <div className={'playlist-body'}>
            <Track index={0} song={null} header={true} />
            {this.context.player.playlist.map((song: Song, index) =>
              <Track index={index} song={song} header={false} key={song.id} />
            )}
          </div>
        </div>
      )
    } else {
      return (
        <div className={'playlist-container-1'}>
          <div style={{position: "relative"}} >
            <img className={'art-2'} src={this.state.defaultImage}/>
            <div className={'album-details-2'}></div>
          </div>
        </div>
      )
    }

  }

}
