import * as React from 'react';
import {
	RumblePlayerService,
	HTMLRumblePlayer,
	LinearBar,
	SimplePlayButton,
	GenericVisual,
} from '@rumble-player/rp';
import { fakePlaylist } from '../config/dummyAudioData.config';
import { ControlButton, Tasks } from './buttons/controls-button';

interface IProps {}

interface IState {
	isPlaying?: boolean;
	index?: number;
	player?: RumblePlayerService;
	position?: number;
}

function Line(props) {
	const { value, index, player } = props;
	return (
		<li key={value + index.toString()}>
			<ul>
				{player.index === index ? (
					<li>
						<a href={value.file}>File</a> &nbsp;
						<strong>[selected]</strong>{' '}
					</li>
				) : (
					<li>
						<a href={value.file}>File</a> &nbsp;
					</li>
				)}
				<li>
					position: {value.position ? value.position.toPrecision(2) : 0}
				</li>
				<li>playing: {value.howl?.playing()}</li>
			</ul>
		</li>
	);
}

export default class Player extends React.Component<IProps, IState> {
	constructor(props) {
		super(props);
		this.state = {
			isPlaying: false,
			index: 0,
		};
	}
	private containerRef = React.createRef();
	private player = new RumblePlayerService();
	private playerHTML = new HTMLRumblePlayer();

	componentDidMount = () => {
		this.playerHTML = new HTMLRumblePlayer();
		this.player = new RumblePlayerService();
		this.player.setPlaylistFromUrls(fakePlaylist);

		console.log(this.playerHTML);
		console.log(this.player);
		this.playerHTML.setPlayer(this.player);
		// this.setState({player:this.player})
		const linearBar: LinearBar = new LinearBar();
		console.log(linearBar);
		const simplePlayButton: SimplePlayButton = new SimplePlayButton();
		const BUTTONS = [] as GenericVisual[];
		['play', 'pause', 'stop', 'next', 'prev'].forEach((value) => {
			BUTTONS.push(new ControlButton(value, Tasks[value]));
		});
		//const myPlayButton: ControlButton = new ControlButton('play',Tasks['play']);

		const visualChildren: GenericVisual[] = [...BUTTONS, linearBar];
		this.playerHTML.setVisualChildren(visualChildren);
		// console.log(this.containerRef.current as HTMLDivElement);
		(this.containerRef.current as HTMLDivElement).appendChild(
			this.playerHTML
		);
		// console.log(this.containerRef.current as HTMLDivElement);
		// console.log(this.playerHTML);
	};

	togglePlayer = () => {
		if (this.player.isPlaying) {
			this.player.pause();
			this.setState({ isPlaying: false });
		} else {
			this.player.play();
			this.setState({ isPlaying: true });
		}
	};

	render() {
		const isPlaying = this.player.isPlaying;
		const player = this.state.player;
		return (
			<div>
				<br />
				<button onClick={this.togglePlayer}>
					click me to toggle play/pause
				</button>
				<hr />
				<br />
				<br />
				Current state: {isPlaying ? 'playing' : 'not playing'}
				<br />
				Current index: {this.state.index} <br />
				<hr />
				<div
					ref={this.containerRef as React.RefObject<HTMLDivElement>}
				></div>
				<hr />
				{player ? (
					<ol>
						{player.playlist.map((value, index) => {
							// return <p key={value + index.toString()}>{value}</p>;
							return (
								<Line value={value} index={index} player={player} />
							);
						})}
					</ol>
				) : null}
			</div>
		);
	}
}

// import React, { RefObject, useEffect, useState } from 'react';
// import Player from './player'
// import styles from './app.module.scss';
//
// import { Route, Link } from 'react-router-dom';
// import { fakePlaylist } from '../config/dummyAudioData.config';
// import {  HTMLRumblePlayer, RumblePlayerService, LinearBar, SimplePlayButton, GenericVisual } from '@rumble-player/rp';
// import { Timestamp } from 'rxjs/internal-compatibility';
// import { ControlButton , Tasks} from './buttons/controls-button';
// const containerRef = React.createRef();
// const player = new RumblePlayerService();
// const playerHTML = new HTMLRumblePlayer()
// const eventsHistory = [];
// player.setPlaylistFromUrls(fakePlaylist);
//
// export function App() {
// 	const [isPlaying, setPlaying] = useState(false);
// 	const [index, setIndex] = useState(0);
//
// 	useEffect(() => {
// 		(containerRef.current as HTMLDivElement).appendChild(playerHTML);
// 		player.setPlaylistFromUrls(fakePlaylist)
//     playerHTML.setPlayer(player)
//     const linearBar: LinearBar = new LinearBar();
//     const simplePlayButton: SimplePlayButton = new SimplePlayButton();
//     const BUTTONS = [] as GenericVisual[]
//     ['play','pause','stop','next','prev'].forEach(value => {
//       BUTTONS.push(new ControlButton(value,Tasks[value]))
//     })
//     //const myPlayButton: ControlButton = new ControlButton('play',Tasks['play']);
//
//     const visualChildren: GenericVisual[] = [...BUTTONS,
//       linearBar
//     ];
//     playerHTML.setVisualChildren(visualChildren);
// 		// EVENTLIST.forEach((value) => {
// 		// 	playerHTML.addEventListener(value, ($event: CustomEvent) => {
// 		// 		eventsHistory.push(
// 		// 			'Event type: ' +
// 		// 				value +
// 		// 				', data : ' +
// 		// 				JSON.stringify($event.detail)
// 		// 		);
// 		// 		setPlaying(player.isPlaying);
// 		// 		setIndex(player.index);
// 		// 	});
// 		//});
// 	}, []);
// 	const togglePlayer = () => {
// 		if (player.isPlaying) {
// 			player.pause();
// 		} else {
// 			player.play();
// 		}
// 	};
//
// 	return (
// 		<div className={styles.app}>
// 			{/* START: routes */}
// 			{/* These routes and navigation have been generated for you */}
// 			{/* Feel free to move and update them to fit your needs */}
// 			<br />
// 			<button onClick={togglePlayer}>click me to toggle play/pause</button>
// 			<hr />
// 			<br />
// 			<br />
// 			Current state: {isPlaying ? 'playing' : 'not playing'}
// 			<br />
// 			Current index: {index} <br />
// 			<hr />
// 			<div ref={containerRef as RefObject<HTMLDivElement>}></div>
// 			<hr />
// 			<ol>
// 				{player.playlist.map((value,index) => {
// 					// return <p key={value + index.toString()}>{value}</p>;
//           return (
//             <li key={value + index.toString()}>
//               <ul>
//                 {player.index === index?
//                   <li><a href={value.file}>File</a> &nbsp;<strong >[selected]</strong> </li> :
//                   <li><a href={value.file}>File</a> &nbsp;</li>}
//                 <li>position: {value.position ? value.position.toPrecision(2) : 0 }</li>
//                 <li>playing: {value.howl?.playing()}</li>
//               </ul>
//             </li>
//           )
// 				})}
// 			</ol>
//
//
// 			<Route
// 				path="/"
// 				exact
// 				render={() => (
// 					<div>
// 						{
// 							// This is the generated root route.{' '}
// 							//<Link to="/page-2">Click here for page 2.</Link>
// 						}
// 					</div>
// 				)}
// 			/>
// 			<Route
// 				path="/page-2"
// 				exact
// 				render={() => (
// 					<div>
// 						<Link to="/">Click here to go back to root page.</Link>
// 					</div>
// 				)}
// 			/>
// 			{/* END: routes */}
// 		</div>
// 	);
// }
//
// export default App;
