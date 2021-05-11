import * as React from 'react';
import {
	PlayerService,
	PlayerHTML,
	GenericVisual,
	RumbleConfigs,
} from '@rumble-player/player';

interface IProps {
	//
}

interface IState {
	isPlaying?: boolean;
	index?: number;
	player?: PlayerService;
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

		this.state = {
			isPlaying: false,
			index: 0,
			player: this.player,
		};
	}
	private containerRef = React.createRef<PlayerHTML>();
	private player = new PlayerService();
	private playerHTML = new PlayerHTML();

	componentDidMount() {
		this.playerHTML = new PlayerHTML();
		this.player = new PlayerService();
		this.playerHTML.setPlayerService(this.player);
		// this.playerHTML.loadConfig('config6');
		(this.containerRef.current as PlayerHTML).replaceWith(this.playerHTML);

		RumbleConfigs.defaultConfig(this.player, this.playerHTML);

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
				<button
					onClick={() => {
						this.player.setPLaylistFromRSSFeedURL(
							'https://feeds.buzzsprout.com/159584.rss'
						);
					}}
				>
					click me to load playlist from RSS
				</button>
				<hr />
				<br />
				<br />
				Current state: {this.isPlaying ? 'playing' : 'not playing'}
				<br />
				<hr />
				<rumble-player
					ref={this.containerRef as React.RefObject<PlayerHTML>}
				/>
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
