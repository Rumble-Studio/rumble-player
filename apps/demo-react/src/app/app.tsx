import React, { RefObject, useEffect, useState } from 'react';

import styles from './app.module.scss';

import { Route, Link } from 'react-router-dom';
import { fakePlaylist } from '../config/dummyAudioData.config';
import { EVENTLIST, RumblePlayer } from '@rumble-player/rp';
import { Timestamp } from 'rxjs/internal-compatibility';
const containerRef = React.createRef();
const player = new RumblePlayer();
const eventsHistory = [];
player.setPlaylistFromString(fakePlaylist);

export function App() {
	const [isPlaying, setPlaying] = useState(false);
	const [index, setIndex] = useState(0);

	useEffect(() => {
		(containerRef.current as HTMLDivElement).appendChild(player);
		EVENTLIST.forEach((value) => {
			player.addEventListener(value, ($event: CustomEvent) => {
				eventsHistory.push(
					'Event type: ' +
						value +
						', data : ' +
						JSON.stringify($event.detail)
				);
				setPlaying(player.isPlaying);
				setIndex(player.index);
			});
		});
	}, []);
	const togglePlayer = () => {
		if (player.isPlaying) {
			player.pause();
		} else {
			player.play();
		}
	};

	return (
		<div className={styles.app}>
			{/* START: routes */}
			{/* These routes and navigation have been generated for you */}
			{/* Feel free to move and update them to fit your needs */}
			<br />
			<button onClick={togglePlayer}>click me to toggle play/pause</button>
			<hr />
			<br />
			<br />
			Current state: {isPlaying ? 'playing' : 'not playing'}
			<br />
			Current index: {index} <br />
			<hr />
			<div ref={containerRef as RefObject<HTMLDivElement>}></div>
			<hr />
			<ol>
				{eventsHistory.map((value, index) => {
					return <p key={value + index.toString()}>{value}</p>;
				})}
			</ol>
			<Route
				path="/"
				exact
				render={() => (
					<div>
						{
							// This is the generated root route.{' '}
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
