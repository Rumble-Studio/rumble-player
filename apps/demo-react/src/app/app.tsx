import * as React from 'react';
import {
	RumblePlayerService,
	HTMLRumblePlayer,
	LinearBar,
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
	visualChildren?: GenericVisual[]
}

function Line(props) {
	const { value, index, player } = props;
	return (
		<li key={Math.random().toString()}>
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
	private interval: NodeJS.Timeout;
	private isPlaying: boolean;
	private position: number;
	private index: number;
	constructor(props) {
		super(props);
    this.playerHTML = new HTMLRumblePlayer();
    this.player = new RumblePlayerService();
    this.player.setPlaylistFromUrls(fakePlaylist);
    this.playerHTML.setPlayer(this.player);
		this.state = {
			isPlaying: false,
			index: 0,
      player:this.player
		};
	}
	private containerRef = React.createRef();
	private player = new RumblePlayerService();
	private playerHTML = new HTMLRumblePlayer();

	componentDidMount(){

		const linearBar: LinearBar = new LinearBar();
		console.log(linearBar);
		const BUTTONS = [] as GenericVisual[];
		['play', 'pause', 'stop', 'next', 'prev'].forEach((value) => {
		  const button = new ControlButton(value, Tasks[value])
			BUTTONS.push(button);
			console.log(button)
		});

		const visualChildren: GenericVisual[] = [...BUTTONS, linearBar];
    this.playerHTML.setVisualChildren(visualChildren);
    console.log('button',visualChildren);
    (this.containerRef.current as HTMLRumblePlayer).appendChild(
      this.playerHTML
    )
		this.interval = setInterval(this.updateStyle, 10);
	}



  updateStyle = () => {
		const { isPlaying, index, position } = this.state.player;
		this.isPlaying = isPlaying;
		this.index = index;
		this.position = position;
		this.setState({ isPlaying });
	};
	componentWillUnmount() {
		clearInterval(this.interval);
	}

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
				Current state: {this.isPlaying ? 'playing' : 'not playing'}
				<br />
				<hr />
				<rumble-player ref={this.containerRef as React.RefObject<HTMLRumblePlayer>} />
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
