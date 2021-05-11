import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadDialogComponent } from './load-dialog.component';
import {
	MAT_DIALOG_DATA,
	MatDialogModule,
	MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('LoadDialogComponent', () => {
	let component: LoadDialogComponent;
	let fixture: ComponentFixture<LoadDialogComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [LoadDialogComponent],
			imports: [
				MatDialogModule,
				MatFormFieldModule,
				MatInputModule,
				BrowserAnimationsModule,
			],
			providers: [
				{
					provide: MatDialogRef,
					useValue: {},
				},
				{
					provide: MAT_DIALOG_DATA,
					useValue: {},
				},
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(LoadDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should', () => {
		expect(component).toBeTruthy();
	});
});
