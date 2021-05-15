import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

class DialogData {}

@Component({
	selector: 'rumble-player-load-dialog',
	templateUrl: './load-dialog.component.html',
	styleUrls: ['./load-dialog.component.scss'],
})
export class LoadDialogComponent {
	link = '';

	constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

	onChange($event) {
		this.link = $event.target.value;
	}
}
