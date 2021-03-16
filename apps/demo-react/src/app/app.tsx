import React, { useEffect } from 'react';

import styles from './app.module.scss';

import { Route, Link } from 'react-router-dom';
import { fakePlaylist } from './player.Config';
import { RumblePlayer } from '@rumble-player/rp';

export function App() {
  const playerRef = React.createRef();
  useEffect(() => {
    const player = playerRef.current as RumblePlayer
    console.log(playerRef.current)
  });

  return (
    <div className={styles.app}>

      {/* START: routes */}
      {/* These routes and navigation have been generated for you */}
      {/* Feel free to move and update them to fit your needs */}
      <br />
      <hr />
      <br />
      <rs-player ref={playerRef}  title={'rs player react'}/>
      <Route
        path="/"
        exact
        render={() => (
          <div>
            {// This is the generated root route.{' '}
            //<Link to="/page-2">Click here for page 2.</Link>
              }
          </div>
        )}
      />
      <Route
        path="/page-2"
        exact
        render={() => (
          <div>
            <Link to="/">Click here to go back to root page.</Link>
          </div>
        )}
      />
      {/* END: routes */}
    </div>
  );
}

export default App;
