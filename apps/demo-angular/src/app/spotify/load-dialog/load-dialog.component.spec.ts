import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { LoadDialogComponent } from './load-dialog.component';

describe('LoadDialogComponent', () => {
	let component: LoadDialogComponent;
	let fixture: ComponentFixture<LoadDialogComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [LoadDialogComponent],
			imports: [RouterTestingModule],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(LoadDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should', () => {
		expect(component).not.toBeTruthy();
	});
});
