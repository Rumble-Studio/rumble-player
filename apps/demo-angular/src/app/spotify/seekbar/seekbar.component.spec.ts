import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { SeekbarComponent } from './seekbar.component';

describe('SeekbarComponent', () => {
	let component: SeekbarComponent;
	let fixture: ComponentFixture<SeekbarComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SeekbarComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SeekbarComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
