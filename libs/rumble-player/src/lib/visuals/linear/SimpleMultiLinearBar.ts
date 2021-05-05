import { GenericVisual } from '../../GenericVisual';

function cumSum(a) {
	const result = [a[0]];

	for (let i = 1; i < a.length; i++) {
		result[i] = result[i - 1] + a[i];
	}

	return result;
}

export class SimpleMultiLinearBar extends GenericVisual {
	protected _kind = 'SimpleMultiLinearBar';
	constructor() {
		super();
		this.createHTMLElements();
	}

	protected createHTMLElements() {
		//this.list_of_children = [this.button];
		const style = document.createElement('style');
		style.textContent = '';
		const div = document.createElement('div');
		div.setAttribute('id', 'mainBar');
		// this.list_of_children = [style, div];
	}

	protected setEmitters() {
		//
	}
	protected setListeners() {
		this.playerHTML.addEventListener('newPlaylist', () =>
			this.updateVisual()
		);
		this.playerHTML.addEventListener('positionUpdate', () =>
			this.updateVisual()
		);
	}

	protected updateVisual = () => {
		const style = this.shadowRoot.querySelector('style');
		const div = this.shadowRoot.getElementById('mainBar');

		const virtualDurationsArray = [] as number[];
		this.playerHTML.playlist.map((value) => {
			if (value.valid) {
				virtualDurationsArray.push(
					value.howl.duration() ? value.howl.duration() : -1
				);
			} else {
				virtualDurationsArray.push(-2);
			}
		});
		const minSize = 10;
		const maxRatio = 3000;
		const currentMaxSize = virtualDurationsArray.some((d) => d > 0)
			? Math.max(...virtualDurationsArray)
			: minSize;
		const maxSizeToUse =
			currentMaxSize > maxRatio * minSize
				? maxRatio * minSize
				: currentMaxSize;
		let durationsToUse = virtualDurationsArray
			.map((d) => (d <= 0 ? minSize : d))
			.map((d) => (d > maxSizeToUse ? maxSizeToUse : d));
		let totalVirtualDuration = 0;
		for (const number of durationsToUse) {
			totalVirtualDuration += number;
		}
		durationsToUse = durationsToUse.map((d) => d / totalVirtualDuration);

		const cumulativeDurations = cumSum(durationsToUse);

		const indexBeingPlayed =
			this.playerHTML.index >= 0 ? this.playerHTML.index : 0;
		const currentPosition =
			this.playerHTML.position >= 0 ? this.playerHTML.position : 0;

		// TODO: les valeurs sont incorrects
		const virtualPosition =
			(currentPosition / virtualDurationsArray[indexBeingPlayed]) *
				durationsToUse[indexBeingPlayed] +
			(indexBeingPlayed > 0 ? cumulativeDurations[indexBeingPlayed - 1] : 0);

		let tempStyle = this.generateHostStyle();
		if (div) {
			div.innerHTML = '';
			div.style.overflowX = 'scroll';
			durationsToUse.forEach((value, index) => {
				const subLineardiv = document.createElement('div');
				subLineardiv.setAttribute('id', 'subLineardiv' + index.toString());
				tempStyle += `
          #subLineardiv${index}{
            height:100%;
            display:inline-block;
            width:${100 * value}%;
            background-color:blue;
            opacity:${100 * cumulativeDurations[index]}%;
          }
        `;
				div.appendChild(subLineardiv);
			});
			tempStyle += `
          #progressDiv{
            height:100%;
            position:absolute;
            top:0;
            width:${100 * virtualPosition}%;
            opacity:0.7;
            background-color:yellow;
          }
      `;
			const progressDiv = document.createElement('div');
			progressDiv.setAttribute('id', 'progressDiv');
			div.appendChild(progressDiv);
		}
		if (style) {
			style.textContent = tempStyle;
			div.onclick = (event) => {
				const bcr = div.getBoundingClientRect();
				const clickedPercentage = (event.clientX - bcr.left) / bcr.width;
				const computedDuration = clickedPercentage;

				const indexToSeek = cumulativeDurations.findIndex(
					(d) => d > computedDuration
				);

				const songComputedDuration =
					computedDuration -
					(indexToSeek > 0 ? cumulativeDurations[indexToSeek - 1] : 0);

				const percentageOfSongToSeek =
					songComputedDuration / durationsToUse[indexToSeek];

				const clickEvent = new CustomEvent('seekPerPercentageAndIndex', {
					detail: {
						percentage: percentageOfSongToSeek,
						index: indexToSeek,
						stopOthers: true,
						keepPlaying: true,
						updateGlobalIndex: true,
						finishOthers: false,
					},
				});
				this.playerHTML.processEventSeekPerPercentageAndIndexRef(
					clickEvent
				);
			};
			this.list_of_children = [style, div];
		} else {
			//
		}
	};

	generateHostStyle() {
		return `
		:host{
		  cursor:pointer;
		  height: 35px;
		  position:relative;
		  background-color:yellow;
		}

    #mainBar{
      height: 30px;
      margin-block:10px;
      position:relative;
      width: 100%;}

      `;
	}
}

customElements.define('rs-simple-multi-linear-bar', SimpleMultiLinearBar);
