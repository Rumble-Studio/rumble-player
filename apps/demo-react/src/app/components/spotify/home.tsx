import * as React from 'react';
import './home.scss'
import MusicVideoIcon from '@material-ui/icons/MusicVideo';
import AddBoxIcon from '@material-ui/icons/AddBox';
import HomeIcon from '@material-ui/icons/Home';

import Playlist from '../playlist/Playlist';
import Control from '../controls/control';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps {
  //
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IState {
  //
}

export default class Home extends React.Component<IProps, IState>{
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='main-panel'>
        <div className='drawer'>
          <div className='drawer-logo'>
            <MusicVideoIcon className='logo-icon'/>
            <h4 style={{margin: '5px'}}>iSpotify</h4>
          </div>
          <div className='drawer-body'>
            <div className='drawer-menu'>
              <div className='drawer-menu-item'>
                <HomeIcon className='menu-icon' />
                <h3 style={{color: 'inherit',flex: 3}}>Home</h3>
              </div>
              <div className='drawer-menu-item' >
                <AddBoxIcon className='menu-icon' />
            <h3 style={{color: 'inherit',flex: 3}}>Load Playlist</h3>
          </div>
        </div>
          </div>
          <div className='drawer-footer'></div>
        </div>
        <div className='body-content'>
          <div className='rs-header'></div>
          <div className='rs-body'>

              <Playlist />

          </div>
          <div className='rs-footer'>
            <div className='rs-footer-controls'>
              <div className='rs-footer-controls-line-1'>
                <Control  task={'shuffle'}/>
                <Control  task={'rewind'}/>
                <Control  task={'prev'}/>
                <Control  task={'play'}/>
                <Control  task={'next'}/>
                <Control  task={'forward'}/>
                <Control  task={'loop'}/>
              </div>
              <div className='rs-footer-controls-line-1'></div>
            </div>
            <div className='rs-footer-volume'></div>

          </div>

        </div>
      </div>
    );
  }
}




