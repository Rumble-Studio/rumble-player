import { GenericVisual } from '../../GenericVisual';
import { playerServiceEvent } from '../../playerService';

const cumulativeSum = ((sum) => (value) => (sum += value))(0);

function cumSum(a) {
	const result = [a[0]];

	for (let i = 1; i < a.length; i++) {
		result[i] = result[i - 1] + a[i];
	}

	return result;
}

export class SimpleMultiLinearBar extends GenericVisual {
	protected _kind = 'SimpleMultiLinearBar';
	private durationArray = [] as number[];
	private div: HTMLDivElement;
	private initialStyled = false;
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
		this.list_of_children = [style, div];
	}

	protected bindHTMLElements() {
		//
	}
  protected updateState(state: playerServiceEvent) {
    if (state.type === 'newPlaylist') {
      this.updateVisual()
    }

  }
	protected updateVisual() {
		const style = this.shadowRoot.querySelector('style');
		const div = this.shadowRoot.getElementById('mainBar');

		const virtualDurationsArray = [] as number[];
		this.playerService.playlist.map((value) => {
			if (value.valid) {
				virtualDurationsArray.push(
					value.howl.duration() ? value.howl.duration() : -1
				);
			} else {
				virtualDurationsArray.push(-2);
			}
		});
		console.log({ virtualDurationsArray });
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
		console.log({ durationsToUse, totalVirtualDuration });

		const cumulativeDurations = cumSum(durationsToUse);
		console.log({ cumulativeDurations });

		const indexBeingPlayed =
			this.playerService.index >= 0 ? this.playerService.index : 0;
		const currentPosition =
			this.playerService.position >= 0 ? this.playerService.position : 0;


    // TODO: les valeurs sont incorrects
		const virtualPosition =
			(currentPosition / virtualDurationsArray[indexBeingPlayed]) *
				durationsToUse[indexBeingPlayed] +
      (indexBeingPlayed >
			0
				? cumulativeDurations[indexBeingPlayed - 1]
				: 0);

		console.log({ virtualPosition });
		let tempStyle = this.generateHostStyle();
		if (div) {
			div.innerHTML = '';
			div.style.overflowX = 'scroll';
			durationsToUse.forEach((value, index) => {
				const subLineardiv = document.createElement('div');
				subLineardiv.setAttribute('id', 'subLineardiv' + index.toString());
				console.log('VALUE', value);
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
				const computedDuration = clickedPercentage; //the last factor should be one)

				const indexToSeek = cumulativeDurations.findIndex(
					(d) => d > computedDuration
				); // = 3
				const songComputedDuration =
					cumulativeDurations[indexToSeek] - computedDuration; // = 1.5
        // const nextDiv = this.shadowRoot.getElementById('subLineardiv'+(indexToSeek.toString()))
        // const subBcr= nextDiv.getBoundingClientRect()
        // const x = subBcr.width + subBcr.left
        // const x = *(durationsToUse[indexToSeek]-Math.min(0,durationsToUse[indexToSeek]))
        //
        console.log(indexToSeek,computedDuration,songComputedDuration)
				// this.playerService.seekPerPercentage(
				// 	indexToSeek,
				// 	songComputedDuration
				// );
			};
			this.list_of_children = [style, div];
		} else {
			console.log('STYLE IS NOT AVAILABLE');
		}

		// const cumulativeDurationsPercentage = durationsToUse.map((value,index,array)=>{
		//   let sum=0
		//   for(let i=0;i<=index;i++){
		//     sum+=array[i]
		//   }
		//   return sum
		// })

		//console.log(durationArray,durationsToUse,cumulativeDurations,totalVirtualDuration)
	}

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
