import * as React from 'react';
import {
	RumblePlayerService,
	HTMLRumblePlayer,
	LinearBar,
	GenericVisual,
	Config3,
} from '@rumble-player/rp';
import { fakePlaylist } from '../config/dummyAudioData.config';
import { ControlButton, Tasks } from './buttons/controls-button';

interface IProps {}

interface IState {
	isPlaying?: boolean;
	index?: number;
	player?: RumblePlayerService;
	position?: number;
	visualChildren?: GenericVisual[];
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
	private exampleRef = React.createRef();
	constructor(props) {
		super(props);
		this.playerHTML = new HTMLRumblePlayer();
		this.player = new RumblePlayerService();
		this.player.setPlaylistFromUrls(fakePlaylist);
		this.playerHTML.setPlayer(this.player);
		this.state = {
			isPlaying: false,
			index: 0,
			player: this.player,
		};
	}
	private containerRef = React.createRef<HTMLRumblePlayer>();
	private player = new RumblePlayerService();
	private playerHTML = new HTMLRumblePlayer();

	componentDidMount() {
		console.log('didMount');
		//this.playerHTML.setFromConfig(Config3);
		this.playerHTML.loadConfig('config3');
		const ex = new ExampleCustom();
		(this.containerRef.current as HTMLRumblePlayer).replaceWith(
			this.playerHTML
		);
		(this.exampleRef.current as ExampleCustom).replaceWith(ex);
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
				<rumble-player
					ref={this.containerRef as React.RefObject<HTMLRumblePlayer>}
				/>
				<hr />
				<ex-rs ref={this.exampleRef as React.RefObject<ExampleCustom>} />
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

class ExampleCustom extends HTMLElement {
	constructor() {
		// always call super before doing anything
		super();
		// attaching an open shadow lets us access the shadowRoot
		// property from outside . eg elm.shadowRoot
		const shadow = this.attachShadow({ mode: 'open' });
		const div = document.createElement('div');
		const style = document.createElement('style');
		shadow.appendChild(style);
		shadow.appendChild(div);
	}
	connectedCallback() {
		this.updateStyle();
	}
	updateStyle() {
		const shadowRoot = this.shadowRoot;
		shadowRoot.querySelector('style').textContent = `
    div {
      background-color: red};
    }
  `;
	}
}
customElements.define('ex-rs', ExampleCustom);
